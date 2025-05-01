import { LayoutGroup, motion } from "motion/react";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import pb from "../lib/pb";
import { useEffectOnce, useSessionStorage } from 'react-use'
import { PostsResponse } from "../types/pocketbase-types";
import { useUser } from "../hooks/pb.context";



export default function Index() {
    const [posts, setPosts] = useState<PostsResponse<unknown>[]>([])
    const user = useUser()
    console.log(user);
    
    // const [lastSeenPost, setLastSeenPost] = useSessionStorage<null | string>("explore_last_seen", null)
    // console.log(lastSeenPost);
    
    useEffectOnce(()=>{
        (async ()=>{
            const result = await pb.collection("feed").getList(1, 10, {
                expand: "author",
                fields: "*,expand.author.name,expand.author.id,expand.author.avatar,expand.author.collectionId,expand.author.collectionName",
                sort: "-created"
            })
            setPosts(result.items)
        })();
    })
    
    
    return (
        <>
            <motion.div
                style={{ overflow: "scroll" }}
                className="mx-auto max-w-md flex items-center flex-col gap-4 mb-16 py-8 px-2"
            >
                <LayoutGroup>
                    {
                        posts.map(post=><Post post={post} />)
                    }
                </LayoutGroup>
            </motion.div>
        </>
    );
}
