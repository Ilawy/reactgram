//@ts-check
import { Client } from "basic-ftp";
import "dotenv/config";
// @ts-ignore
import path from "node:path";

const {
    FTP_PASS,
    FTP_USER,
    FTP_HOST,
    FTP_PORT = 21,
    FTP_PB_HOOKS_PATH,
} = process.env;
Object.entries({ FTP_HOST, FTP_USER, FTP_PASS, FTP_PB_HOOKS_PATH }).forEach(
    ([name, value]) => {
        if (!value) throw new Error(`env ${name} is required`);
    }
);

(async () => {
    const client = new Client();
    // client.ftp.verbose = true;
    try {
        await client.access({
            host: FTP_HOST,
            user: FTP_USER,
            password: FTP_PASS,
            port: +FTP_PORT,
            secure: true,
        });
        await client.cd(FTP_PB_HOOKS_PATH);
        await client.uploadFromDir(path.join(process.cwd(), "pb_hooks"), ".");
    } catch (err) {
        console.log(err);
    }
    client.close();
})();
