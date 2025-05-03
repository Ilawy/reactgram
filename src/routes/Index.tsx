import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import pb from "../lib/pb";
import { FeedResponse, UsersRecord } from "../types/pocketbase-types";
import { useUser } from "../hooks/pb.context";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import PBInfinite from "../components/PBInfinite";
import { useNavigate } from "react-router";
import PostGroup from "../components/PostGroup";

export default function Index() {
    const { user } = useUser();
    const newPostRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDialogElement>(null);
    const [likedPosts, setLikedPosts] = useState<
        { post: string; id: string }[]
    >([]);
    const newPostInView = useInView(newPostRef, {
        margin: `16px 0px`,
        initial: false,
    });
    const navigate = useNavigate();

    function handleModalOpen() {
        if (user) modalRef.current!.showModal();
        else {
            navigate("/login");
        }
    }

    return (
        <>
            <NewPostModal ref={modalRef} />
            <motion.button
                onClick={handleModalOpen}
                initial={{
                    bottom: !newPostInView ? "10%" : "-10%",
                }}
                animate={{
                    bottom: !newPostInView ? "10%" : "-10%",
                    transition: {
                        bounce: 0.30,
                        type: "spring",
                    },
                }}
                className={`fixed right-8 btn btn-xl btn-square rounded-full bg-primary text-primary-content`}
            >
                <Plus />
            </motion.button>

            <motion.div className="w-full flex items-center flex-col mx-auto gap-4  py-8 px-2">
                <div
                    ref={newPostRef}
                    className="w-full bg-base-100 p-4 m-3 rounded-2xl flex flex-col gap-3"
                >
                    <p>Share what matters</p>
                    <button
                        onClick={handleModalOpen}
                        className="btn btn-lg py-4 p-3 rounded-xl flex items-center justify-between"
                    >
                        New Post
                        <Plus />
                    </button>
                </div>
                {/* posts here */}
                <PBInfinite<FeedResponse<number, { author: UsersRecord }>>
                    collection="feed"
                    options={{
                        expand: "author",
                        sort: "-created",
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
            </motion.div>
        </>
    );
}

interface INewPost {
    body: string;
    image: FileList;
}

function NewPostModal(
    { ref }: { ref: React.RefObject<HTMLDialogElement | null> },
) {
    const { register, handleSubmit, reset } = useForm<INewPost>();

    const { user } = useUser();

    async function submit(data: INewPost) {
        const form = new FormData();
        form.set("image", data.image.item(0)!);
        form.set("body", data.body);
        form.set("author", user!.id);
        try {
            await pb.collection("posts").create(form);
            reset();
            ref.current!.close();
        } catch (error) {
        }
    }
    return (
        <dialog id="my_modal_2" className="modal" ref={ref}>
            <form onSubmit={handleSubmit(submit)} className="modal-box">
                <h3 className="font-bold text-2xl">New Post</h3>
                <div className="p-4 flex flex-col gap-4">
                    <input
                        {...register("image", {
                            required: true,
                        })}
                        type="file"
                        className="file-input w-full"
                    />
                    <textarea
                        {...register("body", {
                            required: true,
                            min: 1,
                        })}
                        className="textarea w-full"
                        placeholder="Write post here"
                    >
                    </textarea>
                    <button className="btn btn-primary btn-soft">Post</button>
                    <button
                        form="_new_post_dialog_close"
                        className="btn btn-outline btn-soft"
                    >
                        Cancel
                    </button>
                </div>
            </form>
            <form
                method="dialog"
                id="_new_post_dialog_close"
                className="modal-backdrop"
            >
                <button>close</button>
            </form>
        </dialog>
    );
}
