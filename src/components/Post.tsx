import { Bookmark, ThumbsUp } from "lucide-react";
import { motion } from "motion/react";
import { FeedResponse, UsersRecord } from "../types/pocketbase-types";
import DOMPurify from "dompurify";
import { DateTime } from "luxon";
import pb from "../lib/pb";
import { Link, useNavigate } from "react-router";
import { Ref, useState } from "react";
import { useUser } from "../hooks/pb.context";
import { toast } from "sonner";

interface PostProps {
    post: FeedResponse<number, { author: UsersRecord }>;
    from: string;
    viewAs?: string;
    ref?: Ref<HTMLDivElement>;
    liked?: string;
}

export default function Post({ post, from, ref, liked }: PostProps) {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    // const [postExpanded, setPostExpanded] = useState(false);
    const protectedImageUrl = pb.files.getURL(post, post.image);
    const profileImageUrl = pb.files.getURL(
        post.expand?.author,
        post.expand?.author?.avatar!,
    );
    const navigate = useNavigate();

    function toggleLike() {
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
                pb.collection("likes").delete(liked);
            } else {
                pb.collection("likes").create({
                    post: post.id,
                    user: user.id,
                });
            }
        } catch (error) {
            toast.error("Action cannot be done, please try again later");
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
                {/* <motion.div className="flex gap-3">
                <button className="btn w-12 h-12">
                    <Pen />
                </button>
                <button className="btn w-12 h-12">
                    <Trash />
                </button>
            </motion.div> */}
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
                    <ThumbsUp fill={liked ? "#36e" : "none"} stroke="#eee" />
                    {post.likes}
                </motion.button>
                <Bookmark />
            </motion.div>
            <motion.p
                layout
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.body),
                }}></motion.p>
        </motion.div>
    );
}
