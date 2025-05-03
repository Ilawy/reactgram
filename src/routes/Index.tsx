import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import pb from "../lib/pb";
import { FeedResponse, UsersRecord } from "../types/pocketbase-types";
import { useUser } from "../hooks/pb.context";
import { Plus, UploadCloud } from "lucide-react";
import { useForm } from "react-hook-form";
import PBInfinite from "../components/PBInfinite";
import { useNavigate } from "react-router";
import PostGroup from "../components/PostGroup";
import { toast } from "sonner";

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
                        bounce: 0.3,
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
                            from="/"
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

function NewPostModal({
    ref,
}: {
    ref: React.RefObject<HTMLDialogElement | null>;
}) {
    const { register, handleSubmit, reset, formState } = useForm<INewPost>();
    const [previewURL, setPreviewURL] = useState<null | string>(null);
    const [loading, setLoading] = useState(false);

    const { user } = useUser();
    const { ref: fileInputRefSetter, ...fileInputRegister } = register(
        "image",
        {
            required: "Please select an image",
        },
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    function invokeFilePicker() {
        fileInputRef.current!.click();
    }

    const displayImagePreview: React.InputHTMLAttributes<HTMLInputElement>["onChange"] =
        (event) => {
            const file = event.target.files?.item(0);
            if (!file) {
                setPreviewURL(null);
                return;
            }
            const url = URL.createObjectURL(file);
            setPreviewURL(url);
        };

    async function submit(data: INewPost) {
        setLoading(true);
        const form = new FormData();
        form.set("image", data.image.item(0)!);
        form.set("body", data.body);
        form.set("author", user!.id);
        try {
            await pb.collection("posts").create(form);
            reset();
            ref.current!.close();
        } catch (error) {
            toast.error((error as Error).message);
            ref.current!.close();
        } finally {
            setLoading(false);
        }
    }
    return (
        <dialog id="my_modal_2" className="modal" ref={ref}>
            <form onSubmit={handleSubmit(submit)} className="modal-box">
                <h3 className="font-bold text-2xl">New Post</h3>
                <div className="p-4 flex flex-col gap-4">
                    <button
                        disabled={loading}
                        type="button"
                        className="btn"
                        onClick={invokeFilePicker}
                    >
                        <UploadCloud />
                        Pick image
                    </button>
                    <input
                        {...fileInputRegister}
                        ref={(e) => {
                            fileInputRefSetter(e);
                            fileInputRef.current = e;
                        }}
                        onChange={displayImagePreview}
                        type="file"
                        className="hidden"
                    />
                    {formState.errors.image && (
                        <span className="text-error">
                            {formState.errors.image.message}
                        </span>
                    )}
                    {previewURL && (
                        <img
                            className="max-h-96 object-contain"
                            src={previewURL}
                        />
                    )}
                    <textarea
                        disabled={loading}
                        {...register("body", {
                            required: "A post must have a body",
                            min: {
                                message: "Please add a value",
                                value: 1,
                            },
                        })}
                        className="textarea w-full"
                        placeholder="Write post here"
                    ></textarea>
                    {formState.errors.body && (
                        <span className="text-error">
                            {formState.errors.body.message}
                        </span>
                    )}
                    <motion.button
                        disabled={loading}
                        className="btn btn-primary btn-soft"
                        layout
                    >
                        <motion.span layout>Post</motion.span>
                        {loading && (
                            <motion.span
                                layout
                                className="spinner loading loading-xs"
                            />
                        )}
                    </motion.button>
                    <button
                        disabled={loading}
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
