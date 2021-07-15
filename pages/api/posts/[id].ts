import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import fs from "fs";
import { Post } from "@helpers/types";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get((req, res) => {
    // i just copied from StackOverflow, ok?
	const dirname = "public/pagesrc";
    
    let allPages: Post[] = [];
    const fileNames = fs.readdirSync(dirname);

    fileNames.forEach((fileName) => {
        const content = fs.readFileSync(`${dirname}/${fileName}`, "utf-8");
        if (!content) return;
        allPages.push(JSON.parse(content))
    });

    const result = allPages.find((page) => page.id === req.query.id);
    if (!result) return res.status(404).json({error: "not found"});
    res.status(200).json(result);
});

export default handler;
