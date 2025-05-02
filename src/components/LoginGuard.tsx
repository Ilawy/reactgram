import { useNavigate } from "react-router";
import { useUser } from "../hooks/pb.context";
import { PropsWithChildren } from "react";
import Login from "../routes/Login";

export default function LoginGuard({ children }: PropsWithChildren) {
    const { loading, user } = useUser();
    const navigate = useNavigate();
    if (loading) {
        return (
            <div>
                <div className="spinner spinner-lg"></div>
            </div>
        );
    } else if (!user) {
        return <Login />
    } else {
        return children;
    }
}
