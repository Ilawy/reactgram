import { Compass, Search } from "lucide-react";

export interface DockItemProps {
    icon: React.ReactNode;
    label: string;
    to: string;
    isActive?: boolean;
    scrollToTop?: boolean;
}

export const dockItems: DockItemProps[] = [
    {
        to: "/",
        icon: <Compass />,
        label: "Explore",
        scrollToTop: true,
    },
    {
        to: "/search",
        icon: <Search />,
        label: "Search",
        scrollToTop: true,
    },

    // {
    //     to: "/feed",
    //     icon: <Cone style={{ rotate: "-90deg" }} />,
    //     label: "Feed",
    //     scrollToTop: true,
    // }
];
