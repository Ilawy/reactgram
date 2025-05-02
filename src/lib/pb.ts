import PocketBase from "pocketbase";
import { TypedPocketBase } from "../types/pocketbase-types";

const pb = new PocketBase(
    import.meta.env.VITE_PUBLIC_PB_URL,
) as TypedPocketBase;

// TODO: don't go live with this
pb.autoCancellation(false);

export default pb;
