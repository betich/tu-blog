import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { PostProp, Post } from '@helpers/types';

const App: FunctionComponent<PostProp> = ({ post }) => {
    if (!post) return <h1>Not found</h1>;

    return (
        <>
            <Head>
                <title>{post.title}</title>
            </Head>
            <Link href="/posts">
                <a>To Posts</a>
            </Link>
            <h1>{post.title}</h1>
            <hr />
            <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
            <p>Created at {new Date(post.created_at).toDateString()}</p>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    // prerenders page and passes props to the main component

    if (!params) return ({ props: {post: {undefined}}});

    let baseUrl = "http://localhost:54321";
    if (process.env.VERCEL_URL) {
        baseUrl = `https://${process.env.VERCEL_URL}`
    }

    const res = await fetch(`${baseUrl}/api/posts/${params.id}`); // hardcoded, but we'll put this in firebase l8r
    
    if (res.status === 404) return { props: { post: undefined } };

    const post: Post = await res.json();
    return {
        props: { post }
    }
}

export default App;