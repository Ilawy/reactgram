import { useUser } from "../hooks/pb.context";
import { PropsWithChildren } from "react";
import Auth from "../routes/Auth";

export default function LoginGuard({ children }: PropsWithChildren) {
    const { loading, user } = useUser();
    if (loading) {
        return (
            <div>
                <div className="spinner spinner-lg"></div>
            </div>
        );
    } else if (!user) {
        return <Auth />;
    } else {
        return children;
    }
}
