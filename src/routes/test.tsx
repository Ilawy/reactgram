import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {
    CollectionRecords,
    FeedRecord,
    FeedResponse,
} from "../types/pocketbase-types";
import pb from "../lib/pb";
import { RecordListOptions, RecordModel } from "pocketbase";
import Post from "../components/Post";
import { useInView } from "motion/react";
import { useEffectOnce, useFirstMountState } from "react-use";
import SkeletonPost from "../components/SkeletonPost";

export default function Test() {
    function fetchData(...args: any[]) {
        console.log("FET", args);
    }
    function refreshData(...args: any[]) {
        console.log("REF", args);
    }
    const [items, setItems] = useState(
        Array.from(
            { length: 10 },
            (_, i) => <div className="w-full h-96 bg-orange-500">{i}</div>,
        ),
    );
    return (
        <>
            <PBInfinite<FeedResponse>
                collection="feed"
                options={{
                    expand: "author",
                    sort: "-created",
                }}
            >
                {({ items }) => (items.map((item) => {
                    return (
                        <div key={item.id}>
                            <Post post={item} />
                        </div>
                    );
                }))}
            </PBInfinite>
        </>
    );
}

