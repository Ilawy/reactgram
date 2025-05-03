import { RecordListOptions } from "pocketbase";
import { CollectionRecords } from "../types/pocketbase-types";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useEffectOnce, useFirstMountState } from "react-use";
import { useInView } from "react-intersection-observer";
import pb from "../lib/pb";
import SkeletonPost from "./SkeletonPost";

interface CallbackProps<T> {
    items: T[];
}

interface PBInfiniteProps<T> {
    collection: keyof CollectionRecords;
    options?: RecordListOptions;
    perPage?: number;
    children: (props: CallbackProps<T>) => ReactNode;
}

export default function PBInfinite<T extends {}>(
    { collection, options = {}, perPage = 10, children }: PBInfiniteProps<T>,
) {
    const [page, setPage] = useState(1);
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPage, setTotalPages] = useState(0);
    const reachedEnd = items.length >= totalItems;
    const isFirstMount = useFirstMountState();

    const { ref: endRef, inView: isEndInView } = useInView();

    useEffect(() => {
        if (
            isEndInView && items.length > 0 && totalItems > items.length &&
            page < totalPage &&
            !isFirstMount
        ) {
            setPage((p) => {
                fetchChunk(p + 1);
                return p + 1;
            });
        }
    }, [isEndInView, items]);

    const fetchChunk = useCallback(async (page: number) => {
        try {
            setLoading(true);
            const result = await pb.collection(collection).getList<T>(
                page,
                perPage,
                options,
            );
            setTotalItems(result.totalItems);
            setTotalPages(result.totalPages);
            setItems((old) => [...old, ...result.items]);
        } catch (error) {
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffectOnce(() => {
        fetchChunk(page);
        return () => {
            setItems([]);
        };
    });

    // if  return ;
    // else if  {
    //     return ;
    // }

    return (
        <>
            {(!items.length && !loading)
                ? <span>No Posts Yet</span>
                : (!items.length && loading)
                ? (Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonPost key={i} />
                )))
                : (
                    <>
                        {(items.length) ? children({ items }) : null}
                        <div ref={endRef}>
                            {error && (
                                <div role="alert" className="alert alert-error">
                                    <span>Cannot retrieve more posts</span>
                                </div>
                            )}
                            {loading && (
                                <div className="flex justify-center items-center p-3">
                                    <span className="spinner"></span>
                                </div>
                            )}
                            {reachedEnd ? "END" : "LOADING"}
                        </div>
                    </>
                )}
        </>
    );
}
