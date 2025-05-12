import React, { useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TextField, Typography
} from '@mui/material';
import {
  FilterList, Bolt, CalendarMonth, AccessTime, LocationCity, Devices
} from '@mui/icons-material';

const initialData = [
  { nombre: 'Computador1', piso: 'Piso3 B', fecha: 'Enero 3 2025', hora: '1 PM', lectura: -300 },
  { nombre: 'Computador2', piso: 'Piso2 B', fecha: 'Enero 3 2025', hora: '1 PM', lectura: -300 },
  { nombre: 'Servidor Alpha', piso: 'Piso2 B', fecha: 'Enero 3 2025', hora: '1 PM', lectura: +300 },
  { nombre: 'Router Principal', piso: 'Piso1 A', fecha: 'Enero 4 2025', hora: '2 PM', lectura: -150 },
  { nombre: 'Switch Core', piso: 'Piso1 A', fecha: 'Enero 4 2025', hora: '2 PM', lectura: +200 },
  { nombre: 'Computador Ventas 1', piso: 'Piso4 A', fecha: 'Enero 5 2025', hora: '9 AM', lectura: -250 },
  { nombre: 'Computador Ventas 2', piso: 'Piso4 A', fecha: 'Enero 5 2025', hora: '9 AM', lectura: -280 },
  { nombre: 'Impresora Multifuncional', piso: 'Piso2 B', fecha: 'Enero 5 2025', hora: '10 AM', lectura: +50 },
  { nombre: 'Access Point Corredor', piso: 'Piso3 B', fecha: 'Enero 6 2025', hora: '11 AM', lectura: +30 },
  { nombre: 'Computador Diseño', piso: 'Piso1 A', fecha: 'Enero 6 2025', hora: '3 PM', lectura: -400 },
  // Add more rows to see the density effect
  { nombre: 'Computador10', piso: 'Piso3 B', fecha: 'Enero 7 2025', hora: '1 PM', lectura: -310 },
  { nombre: 'Computador11', piso: 'Piso2 B', fecha: 'Enero 7 2025', hora: '1 PM', lectura: -320 },
  { nombre: 'Computador12', piso: 'Piso2 B', fecha: 'Enero 7 2025', hora: '1 PM', lectura: +330 },
  { nombre: 'Computador13', piso: 'Piso1 A', fecha: 'Enero 7 2025', hora: '1 PM', lectura: -340 },
  { nombre: 'Computador14', piso: 'Piso1 A', fecha: 'Enero 7 2025', hora: '1 PM', lectura: +350 },
  { nombre: 'Computador15', piso: 'Piso3 B', fecha: 'Enero 8 2025', hora: '2 PM', lectura: -300 },
  { nombre: 'Computador16', piso: 'Piso2 B', fecha: 'Enero 8 2025', hora: '2 PM', lectura: -300 },
  { nombre: 'Computador17', piso: 'Piso2 B', fecha: 'Enero 8 2025', hora: '2 PM', lectura: +300 },
  { nombre: 'Computador18', piso: 'Piso1 A', fecha: 'Enero 8 2025', hora: '2 PM', lectura: -300 },
  { nombre: 'Computador19', piso: 'Piso1 A', fecha: 'Enero 8 2025', hora: '2 PM', lectura: +300 },{ nombre: 'Computador1', piso: 'Piso3 B', fecha: 'Enero 3 2025', hora: '1 PM', lectura: -300 },
  { nombre: 'Computador2', piso: 'Piso2 B', fecha: 'Enero 3 2025', hora: '1 PM', lectura: -300 },
  { nombre: 'Servidor Alpha', piso: 'Piso2 B', fecha: 'Enero 3 2025', hora: '1 PM', lectura: +300 },
  { nombre: 'Router Principal', piso: 'Piso1 A', fecha: 'Enero 4 2025', hora: '2 PM', lectura: -150 },
  { nombre: 'Switch Core', piso: 'Piso1 A', fecha: 'Enero 4 2025', hora: '2 PM', lectura: +200 },
  { nombre: 'Computador Ventas 1', piso: 'Piso4 A', fecha: 'Enero 5 2025', hora: '9 AM', lectura: -250 },
  { nombre: 'Computador Ventas 2', piso: 'Piso4 A', fecha: 'Enero 5 2025', hora: '9 AM', lectura: -280 },
  { nombre: 'Impresora Multifuncional', piso: 'Piso2 B', fecha: 'Enero 5 2025', hora: '10 AM', lectura: +50 },
  { nombre: 'Access Point Corredor', piso: 'Piso3 B', fecha: 'Enero 6 2025', hora: '11 AM', lectura: +30 },
  { nombre: 'Computador Diseño', piso: 'Piso1 A', fecha: 'Enero 6 2025', hora: '3 PM', lectura: -400 },
  // Add more rows to see the density effect
  { nombre: 'Computador10', piso: 'Piso3 B', fecha: 'Enero 7 2025', hora: '1 PM', lectura: -310 },
  { nombre: 'Computador11', piso: 'Piso2 B', fecha: 'Enero 7 2025', hora: '1 PM', lectura: -320 },
  { nombre: 'Computador12', piso: 'Piso2 B', fecha: 'Enero 7 2025', hora: '1 PM', lectura: +330 },
  { nombre: 'Computador13', piso: 'Piso1 A', fecha: 'Enero 7 2025', hora: '1 PM', lectura: -340 },
  { nombre: 'Computador14', piso: 'Piso1 A', fecha: 'Enero 7 2025', hora: '1 PM', lectura: +350 },
  { nombre: 'Computador15', piso: 'Piso3 B', fecha: 'Enero 8 2025', hora: '2 PM', lectura: -300 },
  { nombre: 'Computador16', piso: 'Piso2 B', fecha: 'Enero 8 2025', hora: '2 PM', lectura: -300 },
  { nombre: 'Computador17', piso: 'Piso2 B', fecha: 'Enero 8 2025', hora: '2 PM', lectura: +300 },
  { nombre: 'Computador18', piso: 'Piso1 A', fecha: 'Enero 8 2025', hora: '2 PM', lectura: -300 },
  { nombre: 'Computador19', piso: 'Piso1 A', fecha: 'Enero 8 2025', hora: '2 PM', lectura: +300 },
];

const commonCellSx = {
  fontSize: '0.8rem', // Smaller font size
  padding: '4px 8px', // Reduced padding (vertical horizontal)
};

const headerIconSx = {
  verticalAlign: 'middle',
  mr: 0.5, // Margin right for spacing
  fontSize: '1.1rem', // Slightly smaller icons
};

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
    <Box
      bgcolor="#f6f6f6"
      minHeight="100vh"
      sx={{
        width: "100vw",
        // height: "100vh", // Let content define height or use maxHeight
        display: 'flex',
        flexDirection: 'column',
        padding: 2, // Reduced overall padding
        gap: 2, // Reduced gap
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: '#555', paddingInline: 1, fontWeight: 'normal' }}>
        Lecturas de Consumo Energético
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 100px)', overflow: 'auto' }}> {/* Added maxHeight for scrollability */}
        <Table stickyHeader size="small"> {/* stickyHeader and size="small" */}
          <TableHead>
            <TableRow>
              <TableCell sx={commonCellSx}>
                <Devices sx={headerIconSx} /> <strong>Dispositivo</strong>
              </TableCell>
              <TableCell sx={commonCellSx}>
                <LocationCity sx={headerIconSx} /> <strong>Piso</strong>
              </TableCell>
              <TableCell sx={commonCellSx}>
                <CalendarMonth sx={headerIconSx} /> <strong>Fecha</strong>
              </TableCell>
              <TableCell sx={commonCellSx}>
                <AccessTime sx={headerIconSx} /> <strong>Hora</strong>
              </TableCell>
              <TableCell sx={commonCellSx}>
                <Bolt sx={headerIconSx} /> <strong>Lectura</strong>
              </TableCell>
            </TableRow>
            <TableRow>
              {[ 'nombre', 'piso', 'fecha', 'hora', 'lectura'].map((field) => (
                <TableCell key={field} sx={{ ...commonCellSx, py: 0.5 }}> {/* Less vertical padding for filter row */}
                  <TextField
                    variant="standard"
                    placeholder="Filtrar"
                    fullWidth
                    size="small" // Smaller TextField
                    value={filters[field]}
                    onChange={(e) => handleFilterChange(field, e.target.value)}
                    InputProps={{ sx: { fontSize: '0.8rem' } }} // Font size for input text
                    sx={{ '& .MuiInput-underline:before': { borderBottomWidth: '1px' } }} // Thinner underline
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow key={index} hover> {/* Added hover for better UX */}
                <TableCell sx={commonCellSx}>{row.nombre}</TableCell>
                <TableCell sx={commonCellSx}>{row.piso}</TableCell>
                <TableCell sx={commonCellSx}>{row.fecha}</TableCell>
                <TableCell sx={commonCellSx}>{row.hora}</TableCell>
                <TableCell sx={{ ...commonCellSx, color: row.lectura < 0 ? 'hotpink' : 'mediumseagreen', fontWeight: '500' }}>
                  {row.lectura > 0 ? `+${row.lectura}kw` : `${row.lectura}kw`}
                </TableCell>
              </TableRow>
            ))}
             {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={commonCellSx}>
                  No hay datos que coincidan con los filtros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DataPushes;