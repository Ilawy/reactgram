import { Annoyed, ArrowLeft, ArrowUpCircleIcon, Pen, Plus } from "lucide-react";
import { useUser } from "../hooks/pb.context";
import { Link, useLocation, useParams } from "react-router";
import { useAsync } from "react-use";
import pb from "../lib/pb";
import {
    FeedResponse,
    ProfilesRecord,
    UsersRecord,
} from "../types/pocketbase-types";
import {
    PropsWithChildren,
    ReactNode,
    Ref,
    useEffect,
    useRef,
    useState,
} from "react";
import PBInfinite from "../components/PBInfinite";
import PostGroup from "../components/PostGroup";
import { AuthRecord } from "pocketbase";

interface ProfileProps {
    mode: "self" | "user";
}

export default function Profile({ mode: initialMode }: ProfileProps) {
    const { user } = useUser();
    const params = useParams();
    const [likedPosts, setLikedPosts] = useState<
        { post: string; id: string }[]
    >([]);
    const mode: ProfileProps["mode"] =
        user?.id === params?.id ? "self" : initialMode;
    const id = mode === "self" ? user!.id : params.id!;
    const from = mode === "self" ? "/profile" : `/u/${id}`;
    const {
        loading: profileLoading,
        value: profile,
        error,
    } = useAsync(
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

    if (error) {
        return (
            <div className="flex flex-col p-3 items-center justify-center text-lg mt-16">
                <Annoyed size={64} className="mb-8" />
                <p>This profile cannot be displayed</p>
                <p>
                    Retry to refresh the page or{" "}
                    <a className="underline font-bold" href="/">
                        go home
                    </a>
                </p>
            </div>
        );
    }
    return (
        <>
            <ProfileEditDrawer>
                <header className="p-3 bg-white flex justify-between items-center m-4 rounded-xl empty:hidden">
                    <Link
                        to={location?.state?.from || "/"}
                        className="px-3 py-1">
                        <ArrowLeft />
                    </Link>
                    {mode === "self" && (
                        <div>
                            <button
                                className="btn btn-sm btn-soft btn-accent"
                                onClick={() => pb.authStore.clear()}>
                                Logout
                            </button>
                        </div>
                    )}
                </header>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center py-4 px-2">
                        {/* profile details */}
                        <div className="flex flex-col gap-3">
                            {/* profile pic and name */}
                            {profile?.avatar ? (
                                <img
                                    src={pb.files.getURL(
                                        profile,
                                        profile.avatar,
                                    )}
                                    className="rounded-full w-24 h-24"
                                    alt=""
                                />
                            ) : (
                                <div className="skeleton w-24 h-24 rounded-full relative">
                                    <div className="absolute w-full h-full rounded-full bg-base-100/30"></div>
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
                        {mode === "user" && (
                            <button
                                disabled={loading}
                                className="btn btn-lg flex-1 btn-primary btn-soft">
                                <Plus /> Follow
                            </button>
                        )}
                        {mode === "self" && (
                            <label
                                htmlFor="my-drawer"
                                className="btn btn-lg flex-1 btn-primary btn-soft drawer-button">
                                <Pen /> Edit Profile
                            </label>
                        )}
                    </div>
                </div>
                <div className="w-full flex items-center flex-col mx-auto gap-4  py-8 px-2">
                    <PBInfinite<FeedResponse<number, { author: UsersRecord }>>
                        collection="feed"
                        options={{
                            filter: `author='${id}'`,
                            expand: `author`,
                            sort: "-created",
                        }}>
                        {({ items }) => (
                            <PostGroup
                                from={from}
                                likedPosts={likedPosts}
                                setLikedPosts={setLikedPosts}
                                items={items}
                                user={user}
                            />
                        )}
                    </PBInfinite>
                </div>
            </ProfileEditDrawer>
        </>
    );
}

function ProfileEditDrawer({
    children,
    ref,
}: PropsWithChildren<{
    ref?: Ref<HTMLInputElement>;
}>) {
    const { user, loading } = useUser();

    if (loading)
        return (
            <div className="flex items-center justify-center p-3">
                <span className="spinner loading"></span>
            </div>
        );
    if (!user) return children;
    return (
        <div className="drawer">
            <input
                ref={ref}
                id="my-drawer"
                type="checkbox"
                className="drawer-toggle"
                defaultChecked
            />
            <div className="drawer-content">{children}</div>
            <div className="drawer-side">
                <label
                    htmlFor="my-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"></label>
                <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    <ImageChanger user={user} />
                </div>
            </div>
        </div>
    );
}

function ImageChanger({ user }: { user: AuthRecord & ProfilesRecord }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [imageURL, setImageURL] = useState<null | string>(null);

    useEffect(() => {
        if (user.avatar) setImageURL(pb.files.getURL(user, user.avatar));
    }, [user]);

    function handleImageClick() {
        inputRef.current?.click();
    }

    async function handleImageChange() {
        if (inputRef.current && inputRef.current.files?.length) {
            const image = inputRef.current.files.item(0);
            if (!image) return;
            const form = new FormData();
            form.set("avatar", image);
            pb.collection("users").update(user.id, form);
        }
    }

    return (
        <>
            <input
                onChange={handleImageChange}
                type="file"
                accept="image/*"
                ref={inputRef}
                className="hidden"
            />
            <button
                onClick={handleImageClick}
                className="w-16 h-1/6 relative rounded-full overflow-hidden group">
                {imageURL && (
                    <img
                        className="brightness-70 group-hover:brightness-70"
                        src={imageURL}
                        alt=""
                    />
                )}
                <span className="absolute top-1/2 left-1/2 -translate-1/2 text-white">
                    <ArrowUpCircleIcon />
                </span>
            </button>
        </>
    );
}
