import { Compass, Cone, Grid, Home, LogIn, Settings, User } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import { useUser } from "../hooks/pb.context";

interface DockItemProps {
    icon: React.ReactNode;
    label: string;
    to: string;
    isActive?: boolean;
    scrollToTop?: boolean;
}

export function DockItem(
    { icon, label, to, isActive = false, scrollToTop = false }: DockItemProps,
) {
    const location = useLocation();

    return (
        <button
            className={`${
                isActive || location.pathname === to && "dock-active"
            }`}
        >
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
                className={"contents"}
            >
                {icon}
                <span className="dock-label">{label}</span>
            </Link>
        </button>
    );
}

const items: DockItemProps[] = [{
    to: "/",
    icon: <Compass />,
    label: "Explore",
}, 
// {
//     to: "/feed",
//     icon: <Cone style={{ rotate: "-90deg" }} />,
//     label: "Feed",
//     scrollToTop: true,
// }
];

export default function Dock() {
    const userState = useUser();
    return (
        <div className="dock">
            {items.map((item) => (
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
                    to="/login"
                    icon={<LogIn />}
                    label="Login"
                    scrollToTop
                />
            )}
        </div>
    );
}
