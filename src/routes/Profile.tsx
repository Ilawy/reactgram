import {
    Annoyed,
    ArrowLeft,
    ArrowUpCircleIcon,
    Pen,
    UserMinus,
    UserPlus,
} from "lucide-react";
import { useUser } from "../hooks/pb.context";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useAsyncFn } from "react-use";
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
import { AuthRecord, ClientResponseError } from "pocketbase";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { getUpdatedObject } from "../lib/utils";
import { pick } from "lodash";

interface ProfileProps {
    mode: "self" | "user";
}

async function unfollow(id: string) {
    return pb.collection("follows").delete(id);
}

async function getFollowRelationId(
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

export default function Profile({ mode: initialMode }: ProfileProps) {
    const { user, loading: userLoading } = useUser();
    const params = useParams();
    const mode: ProfileProps["mode"] =
        user?.id === params?.id ? "self" : initialMode;
    const id = mode === "self" ? user!.id : params.id!;
    const from = mode === "self" ? "/profile" : `/u/${id}`;
    const [{ loading: profileLoading, value: profile, error }, fetchProfile] =
        useAsyncFn(
            () => pb.collection("profiles").getOne<ProfilesRecord>(id),
            [user],
        );

    const [{ loading: unfollowLoading }, doUnfollow] = useAsyncFn(unfollow);

    const [
        { loading: followingLoading, value: followRelation },
        fetchFollowRelationId,
    ] = useAsyncFn(getFollowRelationId, [user, profile]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        fetchFollowRelationId(user?.id, profile?.id);
    }, [user, profile, fetchFollowRelationId]);

    const toggleFollowing = async () => {
        if (!user || !profile) {
            //TODO: required login
            return;
        }
        if (followRelation) {
            await doUnfollow(followRelation);
            await fetchFollowRelationId(user?.id, profile?.id);
            await fetchProfile();
        } else {
            await pb.collection("follows").create({
                followee: profile!.id,
                follower: user.id,
            });
            await fetchFollowRelationId(user?.id, profile?.id);
            await fetchProfile();
        }
    };

    const location = useLocation();
    const navigate = useNavigate();
    const actionsLoading =
        profileLoading && userLoading && (followingLoading || unfollowLoading);

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
        if (mode === "self") {
            //forcefully logout in this case
            pb.authStore.clear();
            navigate("/auth");
            return null;
        }
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
                                onClick={toggleFollowing}
                                disabled={actionsLoading}
                                className="btn btn-lg flex-1 btn-primary btn-soft">
                                {followRelation ? (
                                    <>
                                        <UserMinus />
                                        Unfollow
                                    </>
                                ) : (
                                    <>
                                        <UserPlus /> Follow
                                    </>
                                )}
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
                        topic="profile-feed"
                        options={{
                            filter: `author='${id}'`,
                            expand: `author`,
                            sort: "-created",
                        }}>
                        {({ items }) => (
                            <PostGroup
                                from={from}
                                topic="profile-feed"
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
            />
            <div className="drawer-content">{children}</div>
            <div className="drawer-side">
                <label
                    htmlFor="my-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"></label>
                <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    <ImageChanger user={user} />
                    <DetailsChanger user={user} />
                </div>
            </div>
        </div>
    );
}

interface IChangableDetails {
    name: string;
}

function DetailsChanger({ user }: { user: NonNullable<AuthRecord> }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IChangableDetails>();
    const [{ loading }, updateDetails] = useAsyncFn(
        (data: Partial<IChangableDetails>) =>
            pb.collection("users").update(user.id, data),
    );

    async function submit(data: IChangableDetails) {
        const updatedOnlyValues = getUpdatedObject<IChangableDetails>(
            pick(user, ["name"]),
            data,
        );
        if (!Object.keys(updatedOnlyValues).length) {
            toast.error("No values are updated");
            return;
        }
        try {
            await updateDetails(updatedOnlyValues);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error((error as Error).message);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(submit)} action="">
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Name *</legend>
                    <input
                        type="text"
                        className="input"
                        placeholder="Name"
                        defaultValue={user.name}
                        {...register("name", { required: true })}
                    />
                    <p className="label">{errors.name?.message}</p>
                </fieldset>

                <button className="btn btn-primary">
                    Update
                    {loading && <span className="loading spinner loading-xs" />}
                </button>
            </form>
        </>
    );
}

function ImageChanger({ user }: { user: NonNullable<AuthRecord> }) {
    const inputRef = useRef<HTMLInputElement>(null);
    function handleImageClick() {
        inputRef.current?.click();
    }
    const [loading, setLoading] = useState(false);

    async function handleImageChange() {
        try {
            setLoading(true);
            if (inputRef.current && inputRef.current.files?.length) {
                const image = inputRef.current.files.item(0);
                if (!image) return;
                const form = new FormData();
                form.set("avatar", image);
                await pb.collection("users").update(user.id, form);
                toast.success("Image updated successfully");
            }
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
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
            <div className="p-3 flex items-center justify-center">
                <button
                    disabled={loading}
                    onClick={handleImageClick}
                    className="w-20 h-20 relative rounded-full overflow-hidden group">
                    {user.avatar && (
                        <img
                            className="brightness-70 group-hover:brightness-70"
                            src={pb.files.getURL(user, user.avatar)}
                            alt=""
                        />
                    )}
                    <span className="absolute top-1/2 left-1/2 -translate-1/2 text-white">
                        {loading ? (
                            <span className="spinner loading"></span>
                        ) : (
                            <ArrowUpCircleIcon />
                        )}
                    </span>
                </button>
            </div>
        </>
    );
}
