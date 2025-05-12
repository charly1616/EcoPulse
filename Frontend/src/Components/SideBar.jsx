import React from "react";
import { useState } from "react";
import {
  Box,Paper,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Divider,List, ListItem, ListItemButton,ListItemIcon
} from "@mui/material";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import { useMutation, useQueryClient } from "@tanstack/react-query";

//Icons
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import StorageIcon from '@mui/icons-material/Storage';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

import { useQuery } from "@tanstack/react-query";

const ItemStyle = { flexShrink: 1, flexGrow: 0, width: 'auto', maxWidth: '50px' }
const ListBtnSt = { padding: 1, borderRadius: 1, backgroundColor: '#f0f0f0', '&:hover': { backgroundColor: '#e0e0e0', borderTopRightRadius: '999px',borderBottomRightRadius: '999px' }, paddingTop: '4px', paddingBottom: '4px'}
const ListBtnStSelect = { padding: 1, borderRadius: 1, backgroundColor: '#FFCABA', paddingTop: '4px', paddingBottom: '4px', borderTopRightRadius: '999px',borderBottomRightRadius: '999px' }

export default function SideBar({onSeleccionarVista}) {
    const [selected, setSelected] = useState('dashboard');
    const queryClient = useQueryClient();

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const isAdmin = authUser && (authUser.Type === "Admin");
    const canEdit = authUser && (authUser.Type === "Admin" || authUser.Type === "Tech");

	const {mutate: logout} = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/auth/logout",{
					method: "POST",
				});
				const data = await res.json();

				if (!res.ok){
					throw new Error(data.error || "Algo malo pasó")
				}

			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"]});
		},
		onError: () => {
			toast.error("Salida fallada")
		}
	});


    const handleChangeView = (view) => {
        setSelected(view);
        onSeleccionarVista(view);
    }


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', paddingTop: 2, paddingBottom: 2,paddingInline: 1, backgroundColor: '#fdfdfd', borderRadius: 0}}
             elevation={0}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 2 }}>
                <img src="EcoPulseLogo.png" alt="" height={50} />
            </Box>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <List sx={{ display: 'flex', flexDirection: 'column', gap:1, paddingTop: 2 }}>
                    <ListItem disablePadding sx={ItemStyle}>
                    <ListItemButton sx={selected==='dashboard'?ListBtnStSelect:ListBtnSt} onClick={() => handleChangeView('dashboard')}>
                        <ListItemIcon> 
                            <DataThresholdingIcon sx={{ fontSize: 30 }}/>
                        </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding sx={ItemStyle}>
                        <ListItemButton sx={selected==='heatmap'?ListBtnStSelect:ListBtnSt} onClick={() => handleChangeView('dashboard')}>
                        <ListItemIcon > 
                                <LocalFireDepartmentIcon sx={{ fontSize: 30 }}/>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>

                    { canEdit &&
                    <>
                    <ListItem disablePadding sx={ItemStyle}>
                        <ListItemButton sx={selected==='instalation'?ListBtnStSelect:ListBtnSt} onClick={() => handleChangeView('structure')}>
                        <ListItemIcon> 
                                <LocationCityIcon sx={{ fontSize: 30 }}/>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding sx={ItemStyle}>
                        <ListItemButton sx={selected==='datapushes'?ListBtnStSelect:ListBtnSt} onClick={() => handleChangeView('datapushes')}>
                        <ListItemIcon> 
                            <StorageIcon sx={{ fontSize: 30 }}/>
                        </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    </>
                    }

                    
                    {isAdmin &&
                    <ListItem disablePadding sx={ItemStyle}>
                        <ListItemButton sx={selected==='manageUser'?ListBtnStSelect:ListBtnSt} onClick={() => handleChangeView('manageUser')}>
                        <ListItemIcon> 
                            <PersonSearchIcon sx={{ fontSize: 30 }}/>
                        </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    }
                </List>
            </Box >
            
            <Box sx={{paddingBottom: 2, paddingTop:7}}>
                <List sx={{ display: 'flex', flexDirection: 'column', gap:1, justifyContent: 'flex-end', alignItems:'flex-end',}}>
                    <ListItem disablePadding sx={ItemStyle}>
                        <ListItemButton sx={ListBtnSt}
                        onClick={(e) => {
                            e.preventDefault();
                            logout();
                        }}>
                        <ListItemIcon> 
                            <LogoutIcon sx={{ fontSize: 20, paddingLeft: 0.6 }} />
                        </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding sx={ItemStyle}>
                        <ListItemIcon > 
                            <AccountCircleIcon  sx={{ fontSize: 46 }} />
                        </ListItemIcon>
                    </ListItem>
                </List>
            </Box>
        </Box>
    )
}

