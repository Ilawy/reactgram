import { useAsyncFn } from "react-use";
import pb from "../lib/pb";
import { RecordListOptions } from "pocketbase";
import { CollectionRecords } from "../types/pocketbase-types";

interface UseCollectionListOptions extends RecordListOptions {}

export function useCollectionList(
    collectionName: string,
    { page, perPage, ...options }: UseCollectionListOptions,
) {
    const result = useAsyncFn(() =>
        pb.collection(collectionName).getList(page, perPage, options)
    );
    return result;
}

export function useCollectionRecord(
    collectionName: keyof CollectionRecords,
    filter: string,
    options?: RecordListOptions,
) {
    const result = useAsyncFn(() =>
        pb.collection(collectionName).getFirstListItem(filter, options)
    );

    return result;
}
