import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {QueryClient, QueryClientProvider} from 'react-query';

import './index.css'
import List from './pages/Post';
import User from './pages/User';

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
    <QueryClientProvider client={queryClient}>
        <User/>
    </QueryClientProvider>
</StrictMode>,)
