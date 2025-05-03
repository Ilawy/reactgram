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
    likedPosts: string[];
    setLikedPosts: React.Dispatch<React.SetStateAction<string[]>>;
    user: (RecordModel & ProfilesRecord) | null;
}

export default function PostGroup(
    { items, user, likedPosts, setLikedPosts }: PostGroupProps,
) {
    useEffect(() => {
        const posts_filter = items.map((p) => `post='${p.id}'`).join("||");
        pb.collection("likes").getFullList({
            filter: `(${posts_filter})`,
            fields: "post",
        }).then((result) => setLikedPosts(result.map((item) => item.post)));
    }, [items, user]);

    return (
        <>
            {items.map((item) => {
                return (
                    <Post
                        liked={likedPosts.includes(item.id)}
                        key={item.id}
                        post={item}
                        from="/"
                    />
                );
            })}
        </>
    );
}
