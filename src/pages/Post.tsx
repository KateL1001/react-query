/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import React from 'react';
import {API_URL} from '../constants';
import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from 'react-query';

async function fetchDataPosts() {
    const {data} = await axios.get(`${API_URL}/posts?_limit=5`);
    return data
}
async function fetchDataComments() {
    const {data} = await axios.get(`${API_URL}/comments?_limit=100`);
    return data
}

async function createPost(data : any) {
    return axios.post(`${API_URL}/posts`, data)
}

const fetchNextPosts = ({
    pageParam = 1
}) => {
    return axios.get(`${API_URL}/posts?_page=${pageParam}`)
}

const List = () => {
    const [val,setVal] = React.useState('');
    const queryClient = useQueryClient()
    // const {data, isLoading, error} = useQuery('posts', fetchDataPosts, {
    // refetchOnWindowFocus: false,     keepPreviousData: true });
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status
    } = useInfiniteQuery('posts', fetchNextPosts, {
        getNextPageParam: (lastPage, pages) => lastPage.data[lastPage.data.length - 1].id / 10 + 1,
        keepPreviousData: true
    })
    const {data: comments, isLoading: isLoadingComments, error: errorComments, refetch} = useQuery('comments', fetchDataComments, {
        refetchOnWindowFocus: false,
        keepPreviousData: true
    });
    const {mutate} = useMutation(newPost => createPost(newPost), {
        onSuccess: () => queryClient.invalidateQueries('posts')
    });

    if (status === 'loading' || isLoadingComments) 
        return <div>Loading...</div>
    if (status === 'error'  || errorComments) 
        return <div>Error...</div>

    const submitForm = (e : any) => {
        e.preventDefault();
        const formD = new FormData(e.target);
        const fields = Object.fromEntries(formD);
        console.log('e', e)
        console.log('fields', {
            ...fields,
            id: Date.now()
        })
        mutate(fields);
        setVal('');
    }

    return (
        <div>
            <p>Form:</p>
            <form onSubmit={submitForm}>
                <input
                    name='title'
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    placeholder='name...'
                    type="text"/>
            </form>
            {data?.pages.map((el : any) => 
                (el.data.map((post : any) => <div key={post.id}>
                    <p>Title: {post.title}</p>
                    <div>Comments: {comments.filter((comment : any) => comment.postId === post.id).map((comment : any) => <p key={comment.id}>--{comment.body}</p>)}
                    </div>
                </div>))
            )}
            <div>
                <button
                    onClick={() => {fetchNextPage(); refetch();}}
                    disabled={!hasNextPage || isFetchingNextPage}
                    >
                    {isFetchingNextPage
                        ? 'Loading more...'
                        : hasNextPage
                            ? 'Load More'
                            : 'Nothing more to load'}
                </button>
            </div>
            <div>{isFetching && !isFetchingNextPage
                    ? 'Fetching...'
                    : null}</div>
        </div>
    );
};

export default List;