import { AuthRecord } from "pocketbase";
import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";
import pb from "../lib/pb";
import { ProfilesRecord } from "../types/pocketbase-types";

// eslint-disable-next-line react-refresh/only-export-components
export const pbContext = createContext<{
    user: null | AuthRecord;
    loading: boolean;
}>({
    loading: true,
    user: null,
});

export function PBProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<null | (AuthRecord & ProfilesRecord)>(
        null,
    );
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setUser(pb.authStore.record as AuthRecord & ProfilesRecord);
        setLoading(false);
        const unsubscribe = pb.authStore.onChange(() => {
            setUser(pb.authStore.record as AuthRecord & ProfilesRecord);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <pbContext.Provider value={{ user, loading }}>
            {children}
        </pbContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
    return useContext(pbContext);
}
