import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { Post } from '@helpers/types';

type PostsProp = {
    posts: [Post]
}

const App: FunctionComponent<PostsProp> = ({ posts }) => {
    if (!posts) return <h1>Not found</h1>;

    const Posts = posts.map((post) => (
        <li key={post.id}>
            <Link href={`/posts/${post.id}`}><a>{post.title}</a></Link>
        </li>
    ));

    return (
        <>
            <Head>
                <title>Posts</title>
            </Head>
            <Link href="/">
                <a>To Main</a>
            </Link>
            <h1>Posts</h1>
            <hr />
            <ul>{Posts}</ul>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    let baseUrl = "http://localhost:54321";
    if (process.env.VERCEL_URL) {
        baseUrl = `https://${process.env.VERCEL_URL}`
    }
    console.log(process.env.VERCEL_URL);
    
    const res = await fetch(`${baseUrl}/api/posts`); // hardcoded, but we'll put this in firebase l8r
    if (res.status === 404) return { props: {} };
    
    const posts: Post = await res.json();
    return {
        props: { posts }
    }
}

export default App;