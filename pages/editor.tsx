import { useState, useEffect, FormEvent, FunctionComponent } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { ClientPost } from '@helpers/types';
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

import 'react-quill/dist/quill.snow.css';

// todo move to components
// todo optimize this shit bc it's so slow

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
];

// todo responsive toolbar

const QuillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
]

const QuillModules = {
    toolbar: toolbarOptions
}

const Editor: FunctionComponent = () => {
    const [value, setValue] = useState('');
    const [title, setTitle] = useState('');
    const [pageId, setPageId] = useState('');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        // todo Sanitize
        const data: ClientPost = {
            "title": title,
            "content": value
        };

        await fetch("api/posts", {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data)
        })
        .then(res => res.clone().json())
        .then(json => setPageId(json.id))
        .catch(err => console.error(err));

        setValue('');
        setTitle('');
    }

    const PageUrl = () => {
        if (!pageId) return <></>
        return (
        <>
            <p>
                Success! View the page live at &nbsp;
                <Link href={`/posts/${pageId}`}>
                    <a>/posts/{pageId}</a>
                </Link>
            </p>
        </>
        )
    }

    return (
        <>
            <Head>
                <title>Site Editor</title>
            </Head>
            <Link href="/">
                <a>To Main</a>
            </Link>
            <h1>Heellooo</h1>
            <hr />
            <form action="POST" onSubmit={handleSubmit}>
                <label htmlFor="title">Title: </label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} id="title" placeholder="title" />
                <button type="submit">Submit It!</button>
            </form>
            {PageUrl()}

            <div className="editor-area">
                <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={setValue}
                    placeholder="Just type something here"
                    modules={QuillModules}
                    fotmats={QuillFormats}
                />
            </div>
        </>
    )
}

export default Editor;