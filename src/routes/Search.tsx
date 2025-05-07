import {
    ArrowRight,
    MessageCircleWarning,
    SearchIcon,
    UserCheck,
    UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import useDebouncedState from "../lib/useDebouncedState";
import pb from "../lib/pb";
import { motion } from "motion/react";
import { FollowsResponse, ProfilesResponse } from "../types/pocketbase-types";
import { useUser } from "../hooks/pb.context";
import { displayError, followUser, getFollowedUsers } from "../lib/actions";
import { Link } from "react-router";

export default function Search() {
    const [term, setTerm] = useDebouncedState("");
    const [follows, setFollows] = useState<
        Pick<FollowsResponse, "id" | "followee" | "follower">[]
    >([]);
    const [{ loading, error, value: searchResult }, search] = useAsyncFn(
        (search: string) =>
            pb
                .collection("profiles")
                .getList(1, 5, { filter: `name~'${search}'` })
                .then((data) => data.items) as Promise<ProfilesResponse[]>,
    );
    const { user } = useUser();
    useEffect(() => {
        const value = term.trim();
        if (!value || value.length < 3) return;
        search(value).then((result) => {
            if (!result.length) {
                return;
            }
            getFollowedUsers(
                `${user?.id}`,
                result.map((item) => item.id) || [],
            ).then(setFollows);
        });
    }, [term]);

    const [{ loading: followLoading }, invokeFollowUser] = useAsyncFn(
        (...args: Parameters<typeof followUser>) =>
            followUser(...args).catch(displayError),
    );

    return (
        <div className="py-8 px-2">
            <motion.label layout className="input w-full">
                <motion.span layout>
                    <SearchIcon />
                </motion.span>
                <motion.input
                    layout
                    onChange={(ev) => setTerm(ev.currentTarget.value)}
                    type="search"
                    required
                    placeholder="Search"
                />
                {loading && (
                    <motion.span
                        layout
                        className="spinner loading"></motion.span>
                )}
            </motion.label>

            {error && (
                <div role="alert" className="alert alert-error my-5">
                    <MessageCircleWarning />
                    <span>{error.message}</span>
                </div>
            )}

            <ul className="list bg-base-100 rounded-box shadow-md my-5">
                {/* <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
                    Most played songs this week
                </li> */}
                {searchResult &&
                    searchResult.map((item) => {
                        const isFollowed = !!follows.find(
                            (f) => f.followee === item.id,
                        );
                        return (
                            <li key={item.id} className="list-row">
                                <div>
                                    <img
                                        className="size-10 rounded-box"
                                        src={pb.files.getURL(item, item.avatar)}
                                    />
                                </div>
                                <div>
                                    <div>{item.name}</div>
                                    <div className="text-xs uppercase font-semibold opacity-60">
                                        {item.followers
                                            ? `${item.followers} followers`
                                            : "No followers"}
                                    </div>
                                </div>
                                {item.id !== user?.id && (
                                    <button
                                        disabled={followLoading || isFollowed}
                                        onClick={() =>
                                            invokeFollowUser(user!.id, item.id)
                                        }
                                        className="btn btn-square btn-ghost">
                                        {isFollowed ? (
                                            <UserCheck />
                                        ) : (
                                            <UserPlus />
                                        )}
                                    </button>
                                )}
                                <Link
                                    to={`/u/${item.id}`}
                                    className="btn btn-square btn-ghost">
                                    <ArrowRight />
                                </Link>
                            </li>
                        );
                    })}
            </ul>
            <div className="flex flex-col justify-center items-center">
                {term.length < 3 && <p>Please write something to search</p>}
                {term.length >= 3 && !searchResult?.length && !loading && (
                    <p>No results</p>
                )}
            </div>
        </div>
    );
}
