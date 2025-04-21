import { Navigate, Route, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import LoginPage from "./Pages/Auth/LoginPage";
import SignUpPage from "./Pages/Auth/SignUpPage";
import RegisterPage from "./Pages/Auth/RegisterPage";

import SideBar from "./Components/SideBar";

import { Toaster } from "react-hot-toast";

import HomePage from "./Pages/Home/HomePage";

import {Box} from "@mui/material"

function App() {
  const { data: authUser, isLoading} = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/me");
				const data = await res.json();
				if (data.error) return null;
				if (!res.ok){
					throw new Error(data.error || "Algo malo pasó")
				}
				return data
			} catch (error) {
				throw new Error(error);
			}
		},
		retry: false
	})

  return (
    <Box sx={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
		{isLoading && <div className="w-full h-full flex justify-center items-center"><h1 className="text-2xl">Cargando...</h1></div>}
		<Routes>
		<Route path='/' element={authUser ? <HomePage/> : <Navigate to="/login" />} />
		<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
		<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
		<Route path='/register' element={!authUser ? <RegisterPage /> : <Navigate to="/" />} />
		</Routes>

		<Toaster />
	</Box>
      
  )
}

export default App
