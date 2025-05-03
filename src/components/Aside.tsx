import { NavLink } from "react-router";
import { dockItems } from "../types/dockItems";
import { useUser } from "../hooks/pb.context";
import { User } from "lucide-react";

export default function Aside() {
    const { user } = useUser();
    return (
        <aside className="col-span-1">
            <div className="hidden lg:flex bg-base-200 mx-auto my-4 max-w-sm p-5 sticky top-4 flex-col gap-4 min-h-[40ch] rounded-3xl">
                {dockItems.map((item) => (
                    <NavLink
                        to={item.to}
                        key={item.to}
                        className={({ isActive }) =>
                            `bg-base-100 flex gap-3 p-3 rounded-2xl cursor-pointer hover:bg-base-300 active:bg-base-200 transition border border-base-300 ${
                                isActive && "border-4"
                            }`
                        }
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
                {user && (
                    <NavLink
                        to={"/profile"}
                        className={({ isActive }) =>
                            `bg-base-100 flex gap-3 p-3 rounded-2xl cursor-pointer hover:bg-base-300 active:bg-base-200 transition border border-base-300 ${
                                isActive && "border-4"
                            }`
                        }
                    >
                        <User />
                        Profile
                    </NavLink>
                )}
            </div>
        </aside>
    );
}
