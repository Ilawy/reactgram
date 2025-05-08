import { RecordListOptions, RecordModel } from "pocketbase";
import { CollectionRecords } from "../types/pocketbase-types";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useEffectOnce, useFirstMountState } from "react-use";
import { useInView } from "react-intersection-observer";
import pb from "../lib/pb";
import SkeletonPost from "./SkeletonPost";
import { X } from "lucide-react";
import { globalEvents, GlobalEventsType } from "../lib/events";
import { uniqBy } from "lodash";

interface CallbackProps<T> {
    items: T[];
}

interface PBInfiniteProps<T> {
    collection: keyof CollectionRecords;
    options?: RecordListOptions;
    perPage?: number;
    children: (props: CallbackProps<T>) => ReactNode;
    topic: string;
}

export default function PBInfinite<T extends RecordModel>({
    collection,
    options = {},
    perPage = 5,
    children,
    topic,
}: PBInfiniteProps<T>) {
    const [page, setPage] = useState(1);
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPage, setTotalPages] = useState(0);
    const reachedEnd = items.length >= totalItems;
    const isFirstMount = useFirstMountState();

    const { ref: endRef, inView: isEndInView } = useInView();
    const fetchChunk = useCallback(
        async (page: number) => {
            try {
                setLoading(true);
                const result = await pb
                    .collection(collection)
                    .getList<T>(page, perPage, options);
                setTotalItems(result.totalItems);
                setTotalPages(result.totalPages);
                setItems((old) => uniqBy([...old, ...result.items], "id"));
            } catch (error) {
                console.log(error);

                setError(error as Error);
            } finally {
                setLoading(false);
            }
        },
        [collection, options, perPage]
    );

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        globalEvents.on(topic as any, (event: GlobalEventsType["feed"]) => {
            if (event.action === "create") {
                setItems((items) => {
                    const result = uniqBy(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        [event.record as any, ...items],
                        "id"
                    );
                    return result;
                });
            } else if (event.action === "update") {
                console.log("got update!!");

                setItems((items) =>
                    items.map((item) =>
                        item.id === event.record.id
                            ? (event.record as unknown as T)
                            : item
                    )
                );
            }
        });
    }, [topic]);

    useEffect(() => {
        if (
            isEndInView &&
            items.length > 0 &&
            totalItems > items.length &&
            page < totalPage &&
            !isFirstMount
        ) {
            setPage((p) => {
                fetchChunk(p + 1);
                return p + 1;
            });
        }
    }, [
        fetchChunk,
        isEndInView,
        isFirstMount,
        items,
        page,
        totalItems,
        totalPage,
    ]);

    useEffectOnce(() => {
        fetchChunk(page);
        return () => {
            setItems([]);
        };
    });

    if (error) {
        return (
            <div className="w-full h-full">
                <div role="alert" className="alert alert-error w-full h-full">
                    <X />
                    <span>
                        Items cannot be retrieved, please refresh the page or
                        <a
                            className="mx-1 underline font-bold"
                            href="mailto:next.mohammed.amr@gmail.com">
                            contact support
                        </a>
                    </span>
                </div>
            </div>
        );
    }
    if (!items.length && !loading) return <span>No Posts Yet</span>;
    else if (!items.length && loading) {
        return Array.from({ length: 6 }).map((_, i) => (
            <SkeletonPost key={i} />
        ));
    }

    return (
        <>
            {items.length ? children({ items }) : null}
            <div ref={endRef}>
                {loading && (
                    <div className="flex justify-center items-center p-3">
                        <span className="spinner"></span>
                    </div>
                )}
                {reachedEnd ? "END" : "LOADING"}
            </div>
        </>
    );
}
