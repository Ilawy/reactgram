//@ts-check
/// <reference path="../.pb_data/types.d.ts" />

// Ensure that only one post is being pinned for each user
onRecordCreate((e) => {
    if (!e.record) throw new Error("cannot access record");
    const user = e.record.get("user");
    if (typeof user !== "string") throw new Error("cannot retrieve user id");

    if (!e.record.get("pinned")) {
        e.next();
        return;
    }
    const pinned = $app.findRecordsByFilter(
        "test",
        `user='${user}' && pinned = true`,
        "created",
        0,
        0
    );
    if (!pinned) throw new Error("cannot retrieve pinned posts list");
    for (const post of pinned) {
        if (!post) continue;
        post.set("pinned", false);
        $app.save(post);
    }
    e.next();
}, "test");

// Ensure that only one post is being pinned for each user (on update)
onRecordUpdate((e) => {
    if (!e.record) throw new Error("cannot access record");
    const user = e.record.get("user");
    if (typeof user !== "string") throw new Error("cannot retrieve user id");
    if (!e.record.get("pinned")) {
        e.next();
        return;
    }
    const pinned = $app.findRecordsByFilter(
        "test",
        `user='${user}' && pinned = true`,
        "created",
        0,
        0
    );
    if (!pinned) throw new Error("cannot retrieve pinned posts list");
    for (const post of pinned) {
        if (!post) continue;
        post.set("pinned", false);
        $app.save(post);
    }
    e.next();
}, "test");
