import { LayoutGroup, motion } from "motion/react";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import pb from "../lib/pb";
import { useEffectOnce, useSessionStorage } from "react-use";
import {
    FeedResponse,
    PostsResponse,
    UsersRecord,
} from "../types/pocketbase-types";
import { useUser } from "../hooks/pb.context";
import { Image } from "lucide-react";

export default function Index() {
    const [posts, setPosts] = useState<
        FeedResponse<number, { author: UsersRecord }>[]
    >([]);
    const { user } = useUser();

    useEffectOnce(() => {
        (async () => {
            const result = await pb.collection("feed").getList(1, 10, {
                expand: "author",
                fields:
                    "*,expand.author.name,expand.author.id,expand.author.avatar,expand.author.collectionId,expand.author.collectionName",
                sort: "-created",
            });
            setPosts(
                result.items as FeedResponse<number, { author: UsersRecord }>[],
            );
        })();
    });

    return (
        <>
            <motion.div
                style={{}}
                className="w-full flex items-center flex-col gap-4  py-8 px-2"
            >
                <div className="w-full bg-base-100 p-4 m-3 rounded-2xl flex flex-col gap-3">
                    <p>Share what matters</p>
                    <button className="bg-base-200 py-4 p-3 rounded-xl flex items-center justify-between">
                        Create a photo
                        <Image />
                    </button>
                </div>
                <LayoutGroup>
                    {posts.map((post) => (
                        <Post from="/" viewAs={user?.id} post={post} />
                    ))}
                </LayoutGroup>
            </motion.div>
        </>
    );
}
