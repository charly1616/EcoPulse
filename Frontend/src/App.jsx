import { Navigate, Route, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import LoginPage from "./Pages/Auth/LoginPage";
import SignUpPage from "./Pages/Auth/SignUpPage";
import RegisterPage from "./Pages/Auth/RegisterPage";


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


const {
    data: dataPushes,
  } = useQuery({
    queryKey: ["dataPushes"],
    queryFn: async () => {
      try {
        let use = authUser;
        if (!use) use = { CompanyID: "6804696b2322d13814172f55" };
        const res = await fetch("api/faci/getAll/" + use.CompanyID);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "Something went wrong");
        }

        const data = await res.json();

        // Properly flatten the nested structure
        const flattenedData = data.flatMap((fac) =>
          fac.areas.flatMap((ar) =>
            ar.devices.flatMap((dev) =>
              dev.datapushes.map((dat) => ({
                DeviceName: dev.Name,
                AreaName: ar.Name,
                FacilityName: fac.Name,
                Date: new Date(dat.DateStart).toLocaleDateString("es-ES"),
                Hour: new Date(dat.DateStart).toLocaleTimeString("en-US", {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          }),
                Consumpt: dat.Consumption,
              }))
            )
          )
        );

        console.log(flattenedData)
        return flattenedData;
      } catch (error) {
        throw new Error(error.message || "Failed to fetch data");
      }
    },
  });

const {
    data: DBfacilities,
  } = useQuery({
    queryKey: ["facilitys"],
    queryFn: async () => {
      try {
        let use = authUser;
        if (!use) use = { CompanyID: "6804696b2322d13814172f55" };
        const res = await fetch("api/faci/getAll/" + use.CompanyID);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "Something went wrong");
        }

        const data = await res.json();

        // Properly flatten the nested structure
        const flattenedData = data.map((fac) =>{
            return {id: fac._id, name: fac.Name, areas: (fac.areas ?? []).map( ar => {
                return {id: ar._id,color: (ar.Attributes.Color ?? "rgba(255, 110, 110, 0.43)")
					,name: ar.Name, x: ar.From[0],y: ar.From[1]
					, width: (ar.To[0] -  ar.From[0]), height: (ar.To[1] -  ar.From[1])
					, components: (ar.devices ?? []).map( dev => {
						return {type: 1, x:dev.Position[0], y:dev.Position[1], name: dev.Name, id:dev._id}
					}) }
            })}
        }
        );

        return flattenedData;
      } catch (error) {
        console.log("ERROR: " + error.message)
        throw new Error(error.message || "Failed to fetch data");
      }
    },
  });


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
