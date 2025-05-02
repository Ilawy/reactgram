import { Bookmark, ThumbsUp } from "lucide-react";
import { motion } from "motion/react";
import DOMPurify from "dompurify";



export default function SkeletonPost() {
    // const [postExpanded, setPostExpanded] = useState(false);

    return (
        <motion.div
            layout
            className="w-full p-3 bg-base-100 border border-base-200 rounded-2xl flex flex-col gap-4 shadow-1xl"
        >
            <motion.div
                layout
                className="flex items-center justify-between gap-3 my-3"
            >
                {/* upper row */}
                <motion.div layout className="flex items-center gap-3">
                    {/* details */}
                    <div className="skeleton rounded-full w-12 h-12" />
                    <motion.div className="flex flex-col gap-1">
                        <div className="skeleton h-[1ch] w-12" />
                        <motion.span>
                            <div className="skeleton h-[0.5ch] w-12" />
                        </motion.span>
                    </motion.div>
                </motion.div>
                {
                    /* <motion.div className="flex gap-3">
                <button className="btn w-12 h-12">
                    <Pen />
                </button>
                <button className="btn w-12 h-12">
                    <Trash />
                </button>
            </motion.div> */
                }
            </motion.div>

            <div
                className="object-contain rounded-3xl skeleton w-full h-96"
            />
            <motion.div className="flex items-center gap-3" layout>
                {/* actions */}
                <motion.button className="flex items-center gap-2">
                    <ThumbsUp fill="#36e" stroke="#eee" />
                    0
                </motion.button>
                <Bookmark />
            </motion.div>
            <motion.p
                layout
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(""),
                }}
            >
            </motion.p>
        </motion.div>
    );
}
