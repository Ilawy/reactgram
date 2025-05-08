import { ChevronRight, Plus } from "lucide-react";
import { Link } from "react-router";
import { getChats } from "../lib/actions";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../hooks/pb.context";
import pb from "../lib/pb";
import { AuthRecord } from "pocketbase";

export default function Chats() {
    const { user } = useUser();
    const { data: chats, isLoading } = useQuery({
        queryKey: ["chats"],
        queryFn: getChats,
    });

    return (
        <div>
            <ul className="list overflow-y-auto h-[90vh]">
                <li className="p-4 py-6 pb-2 text-xs tracking-wide flex items-center justify-between sticky  top-0 left-0 z-50 bg-base-100/70 backdrop-blur-md">
                    <span className="text-xl font-bold">Chats</span>
                    <div>
                        <button className="btn btn-xs btn-primary btn-soft">
                            <Plus />
                        </button>
                    </div>
                </li>
                {isLoading && <span className="loading spinner" />}
                {chats &&
                    chats.map((chat) => (
                        <ChatListItem chat={chat} user={user!} />
                    ))}
            </ul>
        </div>
    );
}

const ChatListItem = ({
    chat,
    user,
}: {
    chat: Awaited<ReturnType<typeof getChats>>[number];
    user: NonNullable<AuthRecord>;
}) => {
    const peer_user =
        chat.peer_a === user.id ? chat.expand.peer_b : chat.expand.peer_a;

    return (
        <li className="list-row">
            <Link className="contents" to={"/profile"}>
                <div>
                    <img
                        className="size-10 rounded-box"
                        src={pb.files.getURL(peer_user, peer_user.avatar)}
                    />
                </div>
                <div className="flex items-center">
                    <div>{peer_user.name}</div>
                </div>
                <button className="btn btn-square btn-ghost">
                    <ChevronRight />
                </button>
            </Link>
        </li>
    );
};
