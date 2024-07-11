import { Box, Button, InputAdornment, Modal, TextField, Typography, styled } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useEffect, useMemo, useState } from "react";

const CustomTextField = styled(TextField)({
    '& label': {
        color: '#FFF',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#FFF',
        },
        '&:hover fieldset': {
            borderColor: '#d65fe8',
        },
        '& input': {
            color: '#FFF',
        },
    },
    '& .MuiInputAdornment-root': {
        color: '#FFF',
    },
});

interface Gastos {
    id: number;
    nombre: string;
    monto: string;
}

const intialGastos: Gastos[] = [
    { id: 1, nombre: 'Comida', monto: '100' },
    { id: 2, nombre: 'Renta', monto: '200' },
    { id: 3, nombre: 'Transporte', monto: '50' },
    { id: 4, nombre: 'Entretenimiento', monto: '150' },
    { id: 5, nombre: 'Ropa', monto: '80' },
];

export default function CalculadoraGastos() {

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90, align: 'center', headerAlign: 'center' },
        {
            field: 'nombre',
            headerName: 'Nombre del gasto',
            width: 150,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'monto',
            headerName: 'Monto',
            width: 150,
            align: 'center',
            headerAlign: 'center',
        }
    ];

    useEffect(() => {
        console.log([,,,].length);
    });


    const [openModal, setOpenModal] = useState(false);
    const [nombre, setNombre] = useState('');
    const [monto, setMonto] = useState('');
    const [gastos, setGastos] = useState(intialGastos);

    const total = useMemo(() => {
        return gastos.reduce((acc, gasto) => acc + parseFloat(gasto.monto), 0);
    }, [gastos]);

    const handleOpen = () => {
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
    }

    const handleSave = () => {
        setGastos([...gastos, { id: gastos.length + 1, nombre: nombre, monto: monto }]);
        setNombre('');
        setMonto('');
        setOpenModal(false);
    }

    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '20px',
            }}>

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '30px',
                        color: '#000'
                    }}
                >
                    Calculadora de gastos
                </Typography>
                <Button variant="contained" color="success" onClick={handleOpen}>
                    Agregar gasto
                </Button>

                <DataGrid
                    rows={gastos}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                    sx={{
                        '& .MuiDataGrid-columnHeader': {
                            backgroundColor: '#13072E',
                            color: '#FFF',
                        },
                        '& .MuiDataGrid-filler': {
                            backgroundColor: '#13072E',
                        },
                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: '#a7b3fc',
                        },
                        '& .MuiDataGrid-cell': {
                            color: '#000',
                        },
                        '& .MuiDataGrid-footerContainer': {
                            backgroundColor: '#13072E',
                        },
                        '& .MuiDataGrid-selectedRowCount': {
                            color: '#FFF',
                            fontWeight: 'bold'
                        },
                        '& .MuiToolbar-root': {
                            color: '#FFF',
                        }
                    }}
                />
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '30px',
                        color: '#000'
                    }}
                >
                    Total de gastos ${total}
                </Typography>
                <Modal open={openModal} onClose={handleClose}>
                    <Box
                        component="form"
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            background: 'linear-gradient(to right, #13072E, #3F2182)',
                            border: '2px solid #FFF',
                            borderRadius: '20px',
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '5px',
                        }}>
                            <Typography variant="h6" component="h2" sx={{
                                color: '#FFF',
                                fontWeight: 'bold',
                            }}>
                                Crear Nueva Tarea
                            </Typography>
                        </Box>
                        <CustomTextField
                            label="Nombre"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DriveFileRenameOutlineIcon />
                                    </InputAdornment>
                                ),
                            }}
                            color='secondary'
                            variant="outlined"
                            margin="normal"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                        <CustomTextField
                            label="Monto"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AttachMoneyIcon />
                                    </InputAdornment>
                                ),
                            }}
                            color='secondary'
                            variant="outlined"
                            margin="normal"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <Button variant="contained" color="success" onClick={handleSave}>
                                Guardar
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        </>
    );
}