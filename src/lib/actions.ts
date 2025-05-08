import { toast } from "sonner";
import { FollowsRecord } from "../types/pocketbase-types";
import pb from "./pb";
import { ClientResponseError } from "pocketbase";

export async function followUser(follower: string, following: string) {
    const payload: Pick<FollowsRecord, "followee" | "follower"> = {
        follower,
        followee: following,
    };
    return await pb
        .collection("follows")
        .create(payload)
        .catch((error) => {
            if (error instanceof ClientResponseError) {
                if (
                    Object.values(error.data.data)
                        .map((e: unknown) => (e as { code: string }).code)
                        .includes("validation_not_unique")
                )
                    return Promise.reject(
                        new Error("You're already following this account"),
                    );
            }
            return Promise.reject(new Error(error));
        });
}

export function getFollowedUsers(id: string, list: string[]) {
    const followedFilter = list.map((id) =>
        pb.filter(`followee = {:id}`, { id }),
    );
    return pb.collection("follows").getFullList({
        filter: pb.filter(
            `follower= {:id} && ${
                followedFilter.length ? followedFilter.join("||") : "false"
            }`,
            { id },
        ),
        fields: "follower,followee",
    });
}

export function displayError(error: unknown) {
    console.log("LOL");

    if (error instanceof Error) {
        toast.error(error.message);
    } else {
        toast.error(`${error}`);
    }
}

export async function togglePostPin(postId: string, oldPin: boolean) {
    return await pb
        .collection("posts")
        .update(postId, { pinned: !oldPin }, { expand: "author" });
}
