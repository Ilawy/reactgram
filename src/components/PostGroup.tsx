import { useEffect, useRef, useState } from "react";
import {
    FeedResponse,
    ProfilesRecord,
    UsersRecord,
} from "../types/pocketbase-types";
import Post from "./Post";
import pb from "../lib/pb";
import { RecordModel } from "pocketbase";
import PostModal from "./PostModal";

interface PostGroupProps {
    items: FeedResponse<number, { author: UsersRecord }>[];
    user: (RecordModel & ProfilesRecord) | null;
    from: string;
    topic: string;
    customActions?: Parameters<typeof Post>[0]["customActions"];
}
export default function PostGroup({
    items,
    user,
    topic,
    from,
    customActions,
}: PostGroupProps) {
    const [likedPosts, setLikedPosts] = useState<
        { post: string; id: string }[]
    >([]);
    //TODO: find a way to inform the post of the new likes count
    useEffect(() => {
        const posts_filter = items.map((p) => `post='${p.id}'`).join("||");

        const unsubscribe = pb.collection("likes").subscribe(
            "*",
            (event) => {
                if (event.action === "delete") {
                    setLikedPosts((likes) =>
                        likes.filter((like) => like.id !== event.record.id),
                    );
                } else if (event.action === "create") {
                    setLikedPosts((likes) => [...likes, event.record]);
                }
            },
            {
                filter: `(${posts_filter})`,
                fields: "post,id",
            },
        );

        pb.collection("likes")
            .getFullList({
                filter: `(${posts_filter})`,
                fields: "post,id",
            })
            .then((result) => setLikedPosts(result));

        return () => {
            unsubscribe.then((d) => d());
        };
    }, [items, user]);
    const modalRef = useRef<
        HTMLDialogElement & {
            edit: (post: PostGroupProps["items"][number]) => void;
        }
    >(null);
    return (
        <>
            <PostModal ref={modalRef} />
            {items.map((item) => {
                return (
                    <Post
                        liked={likedPosts.find((l) => l.post === item.id)?.id}
                        key={item.id}
                        post={item}
                        from={from}
                        topic={topic}
                        onPostEdit={(post) => {
                            modalRef.current?.edit(post);
                        }}
                        customActions={customActions}
                    />
                );
            })}
        </>
    );
}
