import { ArrowLeft, PenLine, Plus } from "lucide-react";
import { useUser } from "../hooks/pb.context";
import { Link, useLocation, useParams } from "react-router";
import { useAsync } from "react-use";
import pb from "../lib/pb";
import {
    FeedResponse,
    ProfilesRecord,
    UsersRecord,
} from "../types/pocketbase-types";
import { ReactNode, useState } from "react";
import PBInfinite from "../components/PBInfinite";
import Post from "../components/Post";
import PostGroup from "../components/PostGroup";

interface ProfileProps {
    mode: "self" | "user";
}

export default function Profile({ mode }: ProfileProps) {
    const { user } = useUser();
    const params = useParams();
     const [likedPosts, setLikedPosts] = useState<
            { post: string; id: string }[]
        >([]);
    const id = mode === "self" ? user!.id : params.id!;
    const from = mode === "self" ? "/profile" : `/u/${id}`;
    const { loading: profileLoading, value: profile } = useAsync(
        () => pb.collection("profiles").getOne<ProfilesRecord>(id),
        [user],
    );
    const location = useLocation();

    const loading = profileLoading;

    const stats = [
        {
            name: "Posts",
            count: profile?.posts ?? null,
        },
        {
            name: "Followers",
            count: profile?.followers ?? null,
        },
    ];

    return (
        <>
            {(location.state && location.state.from) && (
                <header className="p-3 bg-white flex items-center m-4 rounded-xl">
                    <Link to={location.state.from} className="px-3 py-1">
                        <ArrowLeft />
                    </Link>
                </header>
            )}
            <div className="flex flex-col gap-4">
                <div className="flex items-center py-4 px-2">
                    {/* profile details */}
                    <div className="flex flex-col gap-3">
                        {/* profile pic and name */}
                        {profile?.avatar
                            ? (
                                <img
                                    src={pb.files.getURL(
                                        profile,
                                        profile.avatar,
                                    )}
                                    className="rounded-full w-24 h-24"
                                    alt=""
                                />
                            )
                            : (
                                <div className="skeleton w-24 h-24 rounded-full relative">
                                    <div className="absolute w-full h-full rounded-full bg-base-100/30">
                                    </div>
                                </div>
                            )}
                        <span>
                            {profile?.name || (
                                <div className="skeleton bg-base-300 h-5 w-48" />
                            )}
                        </span>
                    </div>
                    <div className="flex gap-3 flex-1 w-full p-3 justify-evenly">
                        {/* stats */}
                        {stats.map((stat) => {
                            return (
                                <div className="flex flex-col items-center">
                                    <span className="text-xl font-bold">
                                        {stat.name}
                                    </span>
                                    <span className="text-xl">
                                        {stat.count as ReactNode}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="p-5 flex flex-wrap max-w-full gap-3">
                    <button
                        disabled={loading}
                        className="btn btn-lg flex-1 btn-primary btn-soft"
                    >
                        <Plus /> Follow
                    </button>
                    <button
                        disabled={loading}
                        className="btn btn-lg btn-primary btn-soft"
                    >
                        <PenLine />
                    </button>
                </div>
            </div>
            <div className="w-full flex items-center flex-col mx-auto gap-4  py-8 px-2">
                <PBInfinite<FeedResponse<number, { author: UsersRecord }>>
                    collection="feed"
                    options={{
                        filter: `author='${id}'`,
                        expand: `author`,
                    }}
                >
                   {({ items }) => (
                                           <PostGroup
                                               likedPosts={likedPosts}
                                               setLikedPosts={setLikedPosts}
                                               items={items}
                                               user={user}
                                           />
                                       )}
                </PBInfinite>
            </div>
        </>
    );
}
