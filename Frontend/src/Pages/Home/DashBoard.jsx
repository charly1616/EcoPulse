import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useMutation, useQueryClient } from '@tanstack/react-query'

const energyData = [
  { month: 'Jan', consumption: 400 },
  { month: 'Feb', consumption: 300 },
  { month: 'Mar', consumption: 500 },
  { month: 'Apr', consumption: 450 },
  { month: 'May', consumption: 600 },
  { month: 'Jun', consumption: 700 },
];

const departmentData = [
  { name: 'Producción', value: 400 },
  { name: 'Administración', value: 300 },
  { name: 'TI', value: 200 },
  { name: 'Logística', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);


  return (
    <Box bgcolor="#f6f6f6" minHeight="100vh" sx={{width: "100vw", height: "100vh", gap: 3, display: 'flex', flexDirection: 'column'}}>
      <Box sx={{ padding: 2, backgroundColor: '#fbfbfb', paddingInline: 4, fontSize: 20 }}>
        <Typography variant="p2" gutterBottom sx={{ color: '#525252'}}>
          Buenas tardes, {authUser.Name}
        </Typography>
      </Box>
      
      <Typography variant="p3" gutterBottom sx={{ color: '#7f7f7f', fontSize: 14, paddingInline: 6 }}>
        Revisión de consumo energético
      </Typography>


      <Box sx={{ padding: 2, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
        <Box xs={12} md={6} >
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Consumo mensual (kWh)
            </Typography>
            <ResponsiveContainer width={350} height={300}>
              <LineChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="consumption" stroke="#1976d2" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        <Box xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Consumo por instalación
            </Typography>
            <ResponsiveContainer width={300} height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        <Box xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Comparativo semestral (kWh)
            </Typography>
            <ResponsiveContainer width={350} height={300}>
              <BarChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="consumption" fill="#4caf50" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>
      
    </Box>
  );
};

export default Dashboard;
