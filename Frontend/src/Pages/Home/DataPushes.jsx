import React, { useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TextField, Typography, IconButton
} from '@mui/material';
import {
  FilterList, Bolt, CalendarMonth, AccessTime, LocationCity, Devices
} from '@mui/icons-material';

const initialData = [
  { nombre: 'Computador1', piso: 'Piso3 B', fecha: 'Enero 3 2025', hora: '1 PM', lectura: -300 },
  { nombre: 'Computador1', piso: 'Piso2 B', fecha: 'Enero 3 2025', hora: '1 PM', lectura: -300 },
  { nombre: 'Computador1', piso: 'Piso2 B', fecha: 'Enero 3 2025', hora: '1 PM', lectura: +300 },
  { nombre: 'Computador1', piso: 'Piso1 A', fecha: 'Enero 3 2025', hora: '1 PM', lectura: -300 },
  { nombre: 'Computador1', piso: 'Piso1 A', fecha: 'Enero 3 2025', hora: '1 PM', lectura: +300 },
  // Puedes añadir más filas si deseas
];

const DataPushes = () => {
  const [filters, setFilters] = useState({
    nombre: '',
    piso: '',
    fecha: '',
    hora: '',
    lectura: ''
  });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredData = initialData.filter(row =>
    row.nombre.toLowerCase().includes(filters.nombre.toLowerCase()) &&
    row.piso.toLowerCase().includes(filters.piso.toLowerCase()) &&
    row.fecha.toLowerCase().includes(filters.fecha.toLowerCase()) &&
    row.hora.toLowerCase().includes(filters.hora.toLowerCase()) &&
    row.lectura.toString().includes(filters.lectura)
  );

  return (
    <Box bgcolor="#f6f6f6" minHeight="100vh" sx={{width: "100vw", height: "100vh", gap: 3, display: 'flex', flexDirection: 'column' , padding: 4, paddingInline: 12}}>
      <Typography variant="p3" gutterBottom sx={{ color: '#7f7f7f', fontSize: 14, paddingInline: 6 }}>
        Lecturas de Consumo Energético
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Devices sx={{ verticalAlign: 'middle' }} /> <strong>Dispositivo</strong>
              </TableCell>
              <TableCell>
                <LocationCity sx={{ verticalAlign: 'middle' }} /> <strong>Piso</strong>
              </TableCell>
              <TableCell>
                <CalendarMonth sx={{ verticalAlign: 'middle' }} /> <strong>Fecha</strong>
              </TableCell>
              <TableCell>
                <AccessTime sx={{ verticalAlign: 'middle' }} /> <strong>Hora</strong>
              </TableCell>
              <TableCell>
                <Bolt sx={{ verticalAlign: 'middle' }} /> <strong>Lectura</strong>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <TextField
                  variant="standard"
                  placeholder="Filtrar"
                  fullWidth
                  value={filters.nombre}
                  onChange={(e) => handleFilterChange('nombre', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  variant="standard"
                  placeholder="Filtrar"
                  fullWidth
                  value={filters.piso}
                  onChange={(e) => handleFilterChange('piso', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  variant="standard"
                  placeholder="Filtrar"
                  fullWidth
                  value={filters.fecha}
                  onChange={(e) => handleFilterChange('fecha', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  variant="standard"
                  placeholder="Filtrar"
                  fullWidth
                  value={filters.hora}
                  onChange={(e) => handleFilterChange('hora', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  variant="standard"
                  placeholder="Filtrar"
                  fullWidth
                  value={filters.lectura}
                  onChange={(e) => handleFilterChange('lectura', e.target.value)}
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.nombre}</TableCell>
                <TableCell>{row.piso}</TableCell>
                <TableCell>{row.fecha}</TableCell>
                <TableCell>{row.hora}</TableCell>
                <TableCell sx={{ color: row.lectura < 0 ? 'hotpink' : 'mediumseagreen' }}>
                  {row.lectura > 0 ? `+${row.lectura}kw` : `${row.lectura}kw`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DataPushes;
