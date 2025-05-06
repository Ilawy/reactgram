// deno-lint-ignore-file no-sloppy-imports
import { useHash } from "react-use";
import { RegisterForm } from "../components/RegisterForm";
import { LoginForm } from "../components/LoginForm";
import { useEffect } from "react";
import pb from "../lib/pb";
import { useNavigate } from "react-router";

export default function Auth() {
    const [hash] = useHash();
    const mode = hash === "#register" ? "register" : "login";
    const returnPath =
        new URL(location.href).searchParams.get("return") || "/profile";
    const navigate = useNavigate();
    useEffect(() => {
        if (pb.authStore.isValid) navigate(returnPath);
    }, []);

    return (
        <div className="p-3 py-8 flex flex-col justify-center flex-1">
            <div className="bg-base-100 p-7 rounded-2xl flex flex-col gap-8">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <div role="tablist" className="tabs tabs-box">
                    <a
                        role="tab"
                        href="#login"
                        className={`tab flex-1 ${
                            mode === "login" && "tab-active"
                        }`}>
                        Login
                    </a>
                    {/* <a
                        role="tab"
                        href="#register"
                        className={`tab flex-1 ${
                            mode === "register" && "tab-active"
                        }`}>
                        Register
                    </a> */}
                </div>

                {mode === "login" ? <LoginForm /> : <RegisterForm />}
            </div>
        </div>
    );
}
