import mitt from "mitt";
import { PostsResponse } from "../types/pocketbase-types";

export type GlobalEventsType = {
    feed: {
        action: "create" | "update" | "delete";
        record: PostsResponse;
    };
};

export const globalEvents = mitt<GlobalEventsType>();
