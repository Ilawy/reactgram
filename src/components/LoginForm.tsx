import { motion, AnimatePresence } from "motion/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAsyncFn } from "react-use";
import { toast } from "sonner";
import pb from "../lib/pb";
import OAuthOptions from "./OAuthOptions";

export interface ILogin {
    usernameOrEmail: string;
    password: string;
}

async function login(data: ILogin, navigate: ReturnType<typeof useNavigate>) {
    // await delay(3000);
    try {
        await pb
            .collection("users")
            .authWithPassword(data.usernameOrEmail, data.password);
        toast.success("Welcome, back!");
        const returnPath =
            new URL(location.href).searchParams.get("return") || "/profile";
        await navigate(returnPath);
    } catch (error) {
        toast.error((error as Error).message);
        throw error; // so it can be displayed in ui
    }
}

export function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ILogin>();
    const [{ loading, error }, loginFn] = useAsyncFn(login);
    const navigate = useNavigate();
    const onSubmit = useCallback(
        (data: ILogin) => {
            loginFn(data, navigate);
        },
        [loginFn, navigate],
    );
    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
                action="">
                <label className="input input-lg w-full">
                    <span className="text-sm">Username or email</span>
                    <input
                        type="text"
                        className="grow"
                        placeholder="Username or email"
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
                        {loading && (
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
                <OAuthOptions />
            </form>
            {error && (
                <p className="text-error-content bg-error/50 border border-error p-3 rounded-xl">
                    {error.message}
                </p>
            )}
        </>
    );
}
