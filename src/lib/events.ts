import mitt from "mitt";
import { PostsResponse } from "../types/pocketbase-types";

type PostsEventsType = Record<
    string,
    {
        action: "create" | "edit" | "update" | "delete";
        record: PostsResponse;
    }
>;

export const postsEvents = mitt<PostsEventsType>();
