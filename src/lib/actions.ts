import { toast } from "sonner";
import {
    FollowsRecord,
    ProfilesRecord,
    UsersRecord,
} from "../types/pocketbase-types";
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

export async function unlike(relId: string) {
    return pb.collection("likes").delete(relId);
}

export async function like(userId: string, postId: string) {
    return pb.collection("likes").create({
        post: postId,
        user: userId,
    });
}

export function createNewPost(form: FormData) {
    return pb.collection("posts").create(form, {
        expand: "author",
    });
}

export function updatePost(id: string, form: FormData) {
    return pb.collection("posts").update(id, form, {
        expand: "author",
    });
}

export async function unfollow(id: string) {
    return pb.collection("follows").delete(id);
}

export async function getFollowRelationId(
    follower: string | undefined,
    following: string | undefined,
) {
    return pb
        .collection("follows")
        .getFirstListItem(`follower='${follower}' && followee='${following}'`)
        .catch((e) =>
            e instanceof ClientResponseError && e.status === 404
                ? null
                : Promise.reject(e),
        )
        .then((v) => v?.id);
}

export async function getProfile(id: string) {
    return pb.collection("profiles").getOne<ProfilesRecord>(id);
}

export async function updateUser(
    userId: string,
    data: Omit<Partial<UsersRecord>, "id">,
) {
    pb.collection("users").update(userId, data);
}

export async function updateUserAvatar(
    userId: string,
    formOrAvatar: File | FormData,
    fieldName = "avatar",
) {
    if (formOrAvatar instanceof File) {
        const file = formOrAvatar;
        formOrAvatar = new FormData();
        formOrAvatar.set(fieldName, file);
    }
    return await pb.collection("users").update(userId, formOrAvatar);
}

export async function listOAuthMethods() {
    return pb
        .collection("users")
        .listAuthMethods()
        .then((result) =>
            result.oauth2.enabled ? result.oauth2.providers : [],
        );
}
