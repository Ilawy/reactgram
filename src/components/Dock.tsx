import { LogIn, User } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useUser } from "../hooks/pb.context";
import { DockItemProps, dockItems } from "../types/dockItems";
import { motion } from "motion/react";

export function DockItem({
    icon,
    label,
    to,
    isActive = false,
    scrollToTop = false,
}: DockItemProps) {
    const location = useLocation();

    return (
        <motion.button
            className={`${isActive || (location.pathname === to && "dock-active")}`}>
            <Link
                onClick={() => {
                    if (scrollToTop) {
                        window.scrollTo({
                            left: 0,
                            top: 0,
                            behavior: "smooth",
                        });
                    }
                }}
                to={to}
                className={"contents"}>
                {icon}
                <span className="dock-label">{label}</span>
            </Link>
        </motion.button>
    );
}

export default function Dock() {
    const userState = useUser();
    return (
        <div className="dock md:hidden">
            {dockItems.map((item) => (
                <DockItem
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    isActive={item.isActive}
                    key={item.label}
                    scrollToTop={item.scrollToTop}
                />
            ))}
            {userState.user && (
                <DockItem
                    to="/profile"
                    icon={<User />}
                    label="Profile"
                    scrollToTop
                />
            )}
            {!userState.user && (
                <DockItem
                    to="/auth"
                    icon={<LogIn />}
                    label="Login"
                    scrollToTop
                />
            )}
        </div>
    );
}
