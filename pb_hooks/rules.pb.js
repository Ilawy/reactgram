//@ts-check
/// <reference path="../.pb_data/types.d.ts" />

// Ensure that only one post is being pinned for each author
onRecordCreate((e) => {
    if (!e.record) throw new Error("cannot access record");
    const author = e.record.get("author");
    if (typeof author !== "string")
        throw new Error("cannot retrieve author id");

    if (!e.record.get("pinned")) {
        e.next();
        return;
    }
    const pinned = $app.findRecordsByFilter(
        "posts",
        `author='${author}' && pinned = true`,
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
}, "posts");

// Ensure that only one post is being pinned for each author (on update)
onRecordUpdate((e) => {
    if (!e.record) throw new Error("cannot access record");
    const author = e.record.get("author");
    if (typeof author !== "string")
        throw new Error("cannot retrieve author id");
    if (!e.record.get("pinned")) {
        e.next();
        return;
    }
    const pinned = $app.findRecordsByFilter(
        "posts",
        `author='${author}' && pinned = true`,
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
}, "posts");
