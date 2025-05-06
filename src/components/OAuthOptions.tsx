import { AuthProviderInfo } from "pocketbase";
import { useAsync } from "react-use";
import pb from "../lib/pb";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useState } from "react";

export default function OAuthOptions() {
    const { loading, value, error } = useAsync<
        () => Promise<AuthProviderInfo[]>
    >(() =>
        pb
            .collection("users")
            .listAuthMethods()
            .then((result) =>
                result.oauth2.enabled ? result.oauth2.providers : [],
            ),
    );
    const navigate = useNavigate();
    const [authLoading, setAuthLoading] = useState(false);
    const returnPath =
        new URL(location.href).searchParams.get("return") || "/profile";
    async function authUsingProvider(provider: AuthProviderInfo) {
        try {
            setAuthLoading(true);
            await pb
                .collection("users")
                .authWithOAuth2({ provider: provider.name });
            navigate(returnPath);
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setAuthLoading(false);
        }
    }

    if (error) return null;
    else if (loading)
        return (
            <div className="flex items-center justify-center p-3">
                <span className="loading spinner"></span>
            </div>
        );
    else if (value)
        return (
            <>
                <div className="divider">OR</div>
                <div className="flex flex-col gap-2">
                    {value.map((option) => (
                        <button
                            disabled={authLoading}
                            onClick={() => authUsingProvider(option)}
                            type="button"
                            className="btn btn-secondary btn-soft">
                            {option.displayName}
                        </button>
                    ))}
                </div>
            </>
        );
}
