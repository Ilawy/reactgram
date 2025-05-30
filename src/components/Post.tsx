import { motion } from "motion/react";
import { animate } from "motion";
import { FeedResponse, UsersRecord } from "../types/pocketbase-types";
import DOMPurify from "dompurify";
import { DateTime } from "luxon";
import pb from "../lib/pb";
import { Link, useNavigate } from "react-router";
import { ReactNode, Ref, useRef, useState } from "react";
import { useUser } from "../hooks/pb.context";
import { toast } from "sonner";
import likeFalseSrc from "../assets/like-false.png";
import likeTrueSrc from "../assets/like-true.png";
import dotsSrc from "../assets/dots.png";
import { AuthRecord } from "pocketbase";
import { like, unlike } from "../lib/actions";

interface PostProps {
    post: FeedResponse<number, { author: UsersRecord }>;
    from: string;
    viewAs?: string;
    ref?: Ref<HTMLDivElement>;
    liked?: string;
    topic: string;
    onPostEdit(
        post: FeedResponse<number, { author: UsersRecord }>,
    ): void | Promise<void>;
    customActions?: (props: {
        post: FeedResponse<number, { author: UsersRecord }>;
        user: AuthRecord;
    }) => ReactNode;
}

export default function Post({
    post,
    from,
    ref,
    liked,
    onPostEdit,
    customActions,
}: PostProps) {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes);
    // const [postExpanded, setPostExpanded] = useState(false);
    const protectedImageUrl = pb.files.getURL(post, post.image);
    const profileImageUrl = pb.files.getURL(
        post.expand?.author,
        post.expand?.author?.avatar!,
    );
    const navigate = useNavigate();
    const likeIconRef = useRef<HTMLImageElement>(null);

    async function toggleLike() {
        if (!user) {
            toast.info("Please login first to like a post", {
                action: {
                    label: "Login",
                    onClick() {
                        navigate(`/auth?return=${from}`);
                    },
                },
            });
            return;
        }
        try {
            setLoading(true);
            if (liked) {
                unlike(liked);
                setLikesCount((l) => (l || 1) - 1);
            } else {
                like(user.id, post.id);
                setLikesCount((l) => (l || 0) + 1);
                animate(likeIconRef.current!, {
                    filter: ["blur(1px)", "blur(3px)", "blur(0px)"],
                    y: [0, -5, 0],
                    scale: ["1", "1.2", "1"],
                });
            }
        } catch (error) {
            toast.error("Action cannot be done, please try again later");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <motion.div
            ref={ref}
            layout
            className="w-full p-3 bg-base-100 border border-base-200 rounded-2xl flex flex-col gap-4 shadow-1xl">
            <motion.div
                layout
                className="flex items-center justify-between gap-3 my-3">
                {/* upper row */}
                <motion.div layout className="flex items-center gap-3">
                    {/* details */}
                    <motion.img
                        layout
                        src={profileImageUrl}
                        className="rounded-full w-12 h-12"
                        alt=""
                    />
                    <motion.div className="flex flex-col gap-1">
                        <Link to={`/u/${post.author}`} state={{ from }}>
                            <motion.span layout className="font-bold">
                                {post.expand?.author?.name}
                            </motion.span>
                        </Link>
                        <motion.span>
                            {DateTime.fromSQL(post.created).toRelative()}
                        </motion.span>
                    </motion.div>
                </motion.div>
                <motion.div className="flex items-center gap-3">
                    {post.expand.author.id === user?.id && (
                        <button
                            onClick={() => onPostEdit(post)}
                            className="btn bg-transparent btn-sm">
                            <img src={dotsSrc} width={32} alt="" />
                        </button>
                    )}
                    {customActions && customActions({ post, user })}
                </motion.div>
            </motion.div>

            <motion.img
                layout
                className="w-full object-contain rounded-3xl"
                onLoad={(e) => e.currentTarget.classList.remove("skeleton")}
                src={protectedImageUrl}
            />
            <motion.div className="flex items-center gap-3" layout>
                {/* actions */}
                <motion.button
                    disabled={loading}
                    className="flex items-center gap-2"
                    onClick={toggleLike}>
                    <img
                        ref={likeIconRef}
                        src={liked ? likeTrueSrc : likeFalseSrc}
                        width="32px"
                    />
                    {likesCount}
                </motion.button>
            </motion.div>
            <motion.p
                layout
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.body),
                }}></motion.p>
        </motion.div>
    );
}
