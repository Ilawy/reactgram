// deno-lint-ignore-file no-sloppy-imports
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import { useAsyncFn, useHash } from "react-use";
import { AnimatePresence, motion } from "motion/react";
import pb from "../lib/pb";
import { toast } from "sonner";
import { useNavigate } from "react-router";
interface ILogin {
    usernameOrEmail: string;
    password: string;
}

interface IRegister {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

async function login(data: ILogin, navigate: ReturnType<typeof useNavigate>) {
    // await delay(3000);
    try {
        await pb
            .collection("users")
            .authWithPassword(data.usernameOrEmail, data.password);
        toast.success("Welcome, back!");
        await navigate("/profile");
    } catch (error) {
        toast.error((error as Error).message);
        throw error; // so it can be displayed in ui
    }
}

export default function Auth() {
    const [hash] = useHash();
    const mode = hash === "#register" ? "register" : "login";

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
                    <a
                        role="tab"
                        href="#register"
                        className={`tab flex-1 ${
                            mode === "register" && "tab-active"
                        }`}>
                        Register
                    </a>
                </div>

                {mode === "login" ? <LoginForm /> : <RegisterForm />}
            </div>
        </div>
    );
}

function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ILogin>();
    const [{ loading, error }, loginFn] = useAsyncFn(login);
    const navigate = useNavigate();
    const onSubmit = useCallback((data: ILogin) => {
        loginFn(data, navigate);
    }, []);
    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
                action="">
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
                <Link to={"/register"} className="btn btn-outline btn-soft">
                    Register
                </Link>
                <Link to={"/reset-password"} className="text-primary">
                    Forgot your password again?
                </Link>
            </form>
            {error && (
                <p className="text-error-content bg-error/50 border border-error p-3 rounded-xl">
                    {error.message}
                </p>
            )}
        </>
    );
}

function RegisterForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<IRegister>();
    const [{ loading, error }, _loginFn] = useAsyncFn(login);
    // const navigate = useNavigate();
    const onSubmit = useCallback((data: IRegister) => {
        console.log(data);
    }, []);
    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
                action="">
                <label className="input input-lg w-full">
                    <span className="text-sm">Name</span>
                    <input
                        type="text"
                        className="grow"
                        placeholder="John Doe"
                        {...register("name", {
                            required: "Please enter your name",
                        })}
                    />
                </label>
                <label className="input input-lg w-full">
                    <span className="text-sm">Email</span>
                    <input
                        type="text"
                        className="grow"
                        placeholder="john.doe@example.com"
                        {...register("email", {
                            required: "Email or username cannot be empty",
                        })}
                    />
                </label>
                {errors.email && (
                    <span className="text-sm text-error">
                        {errors.email?.message}
                    </span>
                )}
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
                {/* password confirm */}
                <label className="input input-lg w-full">
                    <span className="text-sm">Password (Again)</span>
                    <input
                        type="password"
                        className="grow"
                        placeholder="MyAwesomePassword"
                        {...register("passwordConfirmation", {
                            required: "Password cannot be empty",
                            validate: (passwordConfirmation) =>
                                getValues("password") === passwordConfirmation,
                        })}
                    />
                </label>
                <span className="text-sm text-error">
                    {errors.passwordConfirmation?.type === "validate" &&
                        "Passwords doesn't match"}
                </span>
                <motion.button className="btn btn-primary btn-soft" layout>
                    <AnimatePresence>
                        <motion.span layout key={"login_word"}>
                            Register
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
                <a href={"#login"} className="text-primary">
                    Already a user?
                </a>
            </form>
            {error && (
                <p className="text-error-content bg-error/50 border border-error p-3 rounded-xl">
                    {error.message}
                </p>
            )}
        </>
    );
}
