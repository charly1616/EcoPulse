import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './index.css'
import App from './App.jsx'

const queryClient = new QueryClient({
   defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos de datos "frescos"
      refetchOnWindowFocus: false,
    },
  },
})


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App/>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)