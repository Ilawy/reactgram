import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { FeedResponse, UsersRecord } from "../types/pocketbase-types";
import { useUser } from "../hooks/pb.context";
import { ArrowUp, Plus } from "lucide-react";
import PBInfinite from "../components/PBInfinite";
import { useNavigate } from "react-router";
import PostGroup from "../components/PostGroup";
import PostModal from "../components/PostModal";

export default function Index() {
    const { user } = useUser();
    const newPostRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDialogElement>(null);
    const newPostInView = useInView(newPostRef, {
        margin: `16px 0px`,
        initial: false,
    });
    const navigate = useNavigate();

    function handleModalOpen() {
        if (user) modalRef.current!.showModal();
        else {
            navigate("/auth");
        }
    }

    return (
        <>
            <PostModal ref={modalRef} />
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
                className={`fixed right-8 btn btn-xl btn-square rounded-full bg-primary text-primary-content`}>
                <Plus />
            </motion.button>
            <motion.button
                onClick={() =>
                    scrollTo({ top: 0, left: 0, behavior: "smooth" })
                }
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
                className={`fixed right-24 btn btn-xl btn-square rounded-full bg-primary text-primary-content`}>
                <ArrowUp />
            </motion.button>

            <motion.div className="w-full flex items-center flex-col mx-auto gap-4  py-8 px-2">
                <div
                    ref={newPostRef}
                    className="w-full bg-base-100 p-4 m-3 rounded-2xl flex flex-col gap-3">
                    <p>Share what matters</p>
                    <button
                        onClick={handleModalOpen}
                        className="btn btn-lg py-4 p-3 rounded-xl flex items-center justify-between">
                        New Post
                        <Plus />
                    </button>
                </div>
                {/* posts here */}
                <PBInfinite<FeedResponse<number, { author: UsersRecord }>>
                    collection="feed"
                    topic="feed"
                    options={{
                        expand: "author",
                        sort: "-created",
                    }}>
                    {({ items }) => (
                        <PostGroup
                            topic="feed"
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
