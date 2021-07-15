import type { NextApiRequest, NextApiResponse } from "next";
import nc from 'next-connect';
import fs from 'fs';
import slugify from 'slugify';
import { Post } from '@helpers/types';

const myMiddleware = (req: NextApiRequest, res: NextApiResponse, next: Function) => {
	console.log("im here");
	next();
}

const handler = nc<NextApiRequest, NextApiResponse>();

// todo auth, sanitize

handler
.use(myMiddleware)
.get((req, res) => {
	let allPages: Post[] = [];
	// i just copied from StackOverflow, ok?
	const dirname = 'public/pagesrc';

    const fileNames = fs.readdirSync(dirname);
    
    fileNames.forEach((filename) => {
        const content = fs.readFileSync(`${dirname}/${filename}`, "utf-8");
        if (!content) return;
        allPages.push(JSON.parse(content))
    });

	if (!allPages) return res.status(404).json({ error: "not found" });
	res.status(200).json(allPages);
})
.post((req, res) => {
	const {title, content} = req.body;
	const data: Post = {
		title,
		content,
		created_at: Date.now(),
		id: slugify(title, {
			replacement: '-',
			remove: undefined, // remove by regex
			lower: true
		})
	}
	// write to db
	fs.writeFile(
		`public/pagesrc/${data.id}.json`,
		JSON.stringify(data),
		(err) => {
			if (err) throw err;
			console.log("Saved!");
		}
	);

	res.json(data);
});

export default handler;
