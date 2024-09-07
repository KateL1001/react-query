import React from 'react';
import { API_URL } from '../constants';
import axios from 'axios';
import { useQuery } from 'react-query';

async function fetchDataUser() {
    const {data} = await axios.get(`${API_URL}/users/1`);
    return data
}
async function fetchTodosUser(id:any) {
    const {data} = await axios.get(`${API_URL}/todos?userId=${id.queryKey[1]}`);
    return data
}

const User = () => {
    const {data: userD, isLoading: isLoadingUser, error: errorUser} = useQuery('user', fetchDataUser, {
        refetchOnWindowFocus: false,
        keepPreviousData: true
    });
    const {data: todos, isLoading: isLoadingTodos, error: errorTodos} = useQuery(['todos', userD?.id], fetchTodosUser,  {enabled: !!userD}
    );

    if (isLoadingUser || isLoadingTodos) 
        return <div>Loading...</div>
    if (errorUser || errorTodos) 
        return <div>Error...</div>
console.log('todos', userD)
    return (
        <div>
            <div>
                <h1>{userD.name}</h1>
                <p>{userD.email}</p>
            </div>
            <div>
                <p>Todos:</p>
                {todos.map((todo: any) => (
                    <div key={todo.id}>
                        <p>{todo.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default User;