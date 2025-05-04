import { motion, AnimatePresence } from "motion/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import OAuthOptions from "./OAuthOptions";

export interface IRegister {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

// async function register(
//     data: IRegister,
//     navigate: ReturnType<typeof useNavigate>,
// ) {
//     // await delay(3000);
//     try {
//         toast.success("Welcome, back!");
//         const returnPath =
//             new URL(location.href).searchParams.get("return") || "/profile";
//         await navigate(returnPath);
//     } catch (error) {
//         toast.error((error as Error).message);
//         throw error; // so it can be displayed in ui
//     }
// }

export function RegisterForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<IRegister>();
    const [{ loading, error }, _loginFn] = useAsyncFn(async () => {});
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
                <OAuthOptions />
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
