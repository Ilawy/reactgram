import { useEffect } from "react";
import {
    FeedResponse,
    ProfilesRecord,
    UsersRecord,
} from "../types/pocketbase-types";
import Post from "./Post";
import pb from "../lib/pb";
import { RecordModel } from "pocketbase";

interface PostGroupProps {
    items: FeedResponse<number, { author: UsersRecord }>[];
    likedPosts: { post: string; id: string }[];
    setLikedPosts: React.Dispatch<
        React.SetStateAction<{ post: string; id: string }[]>
    >;
    user: (RecordModel & ProfilesRecord) | null;
}

export default function PostGroup(
    { items, user, likedPosts, setLikedPosts }: PostGroupProps,
) {
    //TODO: find a way to inform the post of the new likes count
    useEffect(() => {
        const posts_filter = items.map((p) => `post='${p.id}'`).join("||");

        const unsubscribe = pb.collection("likes").subscribe("*", (event) => {
            if (event.action === "delete") {
                setLikedPosts((likes) =>
                    likes.filter((like) => like.id !== event.record.id)
                );
            } else if (event.action === "create") {
                setLikedPosts((likes) => [...likes, event.record]);
            }
        }, {
            filter: `(${posts_filter})`,
            fields: "post,id",
        });

        pb.collection("likes").getFullList({
            filter: `(${posts_filter})`,
            fields: "post,id",
        }).then((result) => setLikedPosts(result));

        return () => {
            unsubscribe.then((d) => d());
        };
    }, [items, user]);

    return (
        <>
            {items.map((item) => {
                return (
                    <Post
                        liked={likedPosts.find((l) => l.post === item.id)?.id}
                        key={item.id}
                        post={item}
                        from="/"
                    />
                );
            })}
        </>
    );
}
