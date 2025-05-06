import { UploadCloud } from "lucide-react";
import { motion } from "motion/react";
import { ClientResponseError } from "pocketbase";
import { useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { useUser } from "../hooks/pb.context";
import { postsEvents } from "../lib/events";
import pb from "../lib/pb";

interface IPost {
    body: string;
    image: FileList;
}

export interface PostModalProps {
    ref: React.RefObject<HTMLDialogElement | null>;
    // insertNewPost(post: PostsResponse): void | Promise<void>
}

export default function PostModal({ ref }: PostModalProps) {
    const { register, handleSubmit, formState, reset } = useForm<IPost>();
    const [previewURL, setPreviewURL] = useState<null | string>(null);
    const [loading, setLoading] = useState(false);

    const { user } = useUser();
    const {
        ref: fileInputRefSetter,
        onChange: fineInputOnChange,
        ...fileInputRegister
    } = register("image", {
        required: "Please select an image",
    });
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
            fineInputOnChange(event);
        };

    const submit: SubmitHandler<IPost> = async (data) => {
        setLoading(true);
        const form = new FormData();
        form.set("image", data.image.item(0)!);
        form.set("body", data.body);
        form.set("author", user!.id);
        try {
            const newPost = await pb.collection("posts").create(form, {
                expand: "author",
            });
            postsEvents.emit("index-feed", {
                action: "create",
                record: newPost,
            });

            reset();
            setPreviewURL(null);
            ref.current!.close();
        } catch (error) {
            if (error instanceof ClientResponseError && error.data.data) {
                toast.error(
                    <pre>{JSON.stringify(error.data.data, null, 2)}</pre>,
                );
            }
            toast.error((error as Error).message);
            ref.current!.close();
        } finally {
            setLoading(false);
        }
    };
    return (
        <dialog id="my_modal_2" className="modal" ref={ref}>
            <form onSubmit={handleSubmit(submit)} className="modal-box">
                <h3 className="font-bold text-2xl">New Post</h3>
                <div className="p-4 flex flex-col gap-4">
                    <button
                        disabled={loading}
                        type="button"
                        className="btn"
                        onClick={invokeFilePicker}>
                        <UploadCloud />
                        Pick image
                    </button>
                    <input
                        {...fileInputRegister}
                        onChange={displayImagePreview}
                        ref={(e) => {
                            fileInputRefSetter(e);
                            fileInputRef.current = e;
                        }}
                        accept="image/*"
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
                        placeholder="Write post here"></textarea>
                    {formState.errors.body && (
                        <span className="text-error">
                            {formState.errors.body.message}
                        </span>
                    )}
                    <motion.button
                        disabled={loading}
                        className="btn btn-primary btn-soft"
                        layout>
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
                        className="btn btn-outline btn-soft">
                        Cancel
                    </button>
                </div>
            </form>
            <form
                method="dialog"
                id="_new_post_dialog_close"
                className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
}
