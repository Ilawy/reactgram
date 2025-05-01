import { Link } from "react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCallback } from "react";
import { useAsyncFn } from "react-use";
import { AnimatePresence, motion } from "motion/react";
import pb from "../lib/pb";
import { delay } from "@std/async";
import { toast } from "sonner";
import { useNavigate } from "react-router";
interface ILogin {
    usernameOrEmail: string;
    password: string;
}

async function login(data: ILogin, navigate: ReturnType<typeof useNavigate>) {
    // await delay(3000);
    try {
        await pb.collection("users").authWithPassword(
            data.usernameOrEmail,
            data.password,
        );
        toast.success("Welcome, back!");
        await navigate("/profile");
    } catch (error) {
        toast.error(error.message);
        throw error; // so it can be displayed in ui
    }
}

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<ILogin>();
    const [{ loading, error }, loginFn] = useAsyncFn(login);
    const navigate = useNavigate();
    const onSubmit = useCallback((data: ILogin) => {
        loginFn(data, navigate);
    }, []);

    return (
        <div className="p-3 py-8 flex flex-col justify-center flex-1">
            <div className="bg-base-100 p-7 rounded-2xl flex flex-col gap-8">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                {error && (
                    <p className="text-error-content bg-error/50 border border-error p-3 rounded-xl">
                        {error.message}
                    </p>
                )}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                    action=""
                >
                    <label className="input input-lg w-full">
                        <span className="text-sm">Username</span>
                        <input
                            type="text"
                            className="grow"
                            placeholder="ilawy"
                            {...register("usernameOrEmail", {
                                required: "Email or username cannot be empty",
                            })}
                        />
                    </label>
                    <span className="text-sm text-error">
                        {errors.usernameOrEmail?.message}
                    </span>
                    <label className="input input-lg w-full">
                        <span className="text-sm">Password</span>
                        <input
                            type="text"
                            className="grow"
                            placeholder="MyAwesomePassword"
                            {...register("password", {
                                required: "Password cannot be empty",
                            })}
                        />
                    </label>
                    <span className="text-sm text-error">
                        {errors.password?.message}
                    </span>
                    <motion.button className="btn btn-primary btn-soft" layout>
                        <AnimatePresence>
                            <motion.span layout key={"login_word"}>
                                Login
                            </motion.span>
                            {loading &&
                                (
                                    <motion.span
                                        key={"login_indicator"}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        layout
                                        className="loading loading-xs"
                                    />
                                )}
                        </AnimatePresence>
                    </motion.button>
                    <Link to={"/register"} className="btn btn-outline btn-soft">
                        Register
                    </Link>
                    <Link to={"/reset-password"} className="text-primary">
                        Forgot your password again?
                    </Link>
                </form>
            </div>
        </div>
    );
}
