import { Alert, Box, Button, InputAdornment, Modal, Snackbar, TextField, Typography, styled } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useMemo, useReducer, useState, useCallback } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

interface Task {
    id: number;
    nombre: string;
    status: 'Completado' | 'No completado';
}

const initialRows: Task[] = [
    { id: 1, nombre: 'Formulario', status: 'No completado' },
    { id: 2, nombre: 'Modal', status: 'No completado' },
    { id: 3, nombre: 'Snackbar', status: 'No completado' },
    { id: 4, nombre: 'DataGrid', status: 'No completado' },
    { id: 5, nombre: 'TextField', status: 'No completado' },
    { id: 6, nombre: 'Button', status: 'Completado' },
];

type TaskAction =
    | { type: 'ADD_TASK'; payload: Task }
    | { type: 'DELETE_TASK'; payload: number }
    | { type: 'CHANGE_STATUS'; payload: number };

const taskReducer = (state: Task[], action: TaskAction): Task[] => {
    switch (action.type) {
        case 'ADD_TASK':
            return [...state, action.payload];
        case 'DELETE_TASK':
            return state.filter(task => task.id !== action.payload);
        case 'CHANGE_STATUS':
            return state.map(task =>
                task.id === action.payload ? { ...task, status: 'Completado' } : task
            );
        default:
            return state;
    }
};

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

export default function TareasContainer() {
    const [rows, dispatch] = useReducer(taskReducer, initialRows);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
    const [openModal, setOpenModal] = useState(false);
    const [newTask, setNewTask] = useState('');

    const completedTasksCount = useMemo(() => rows.filter((row) => row.status === 'Completado').length, [rows]);

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);

    const handleSave = useCallback(() => {
        const lastId = rows[rows.length - 1]?.id || 0;
        const newId = lastId + 1;
        dispatch({ type: 'ADD_TASK', payload: { id: newId, nombre: newTask, status: 'No completado' } });
        setAlertMessage('¡Tarea creada exitosamente!');
        setAlertSeverity('success');
        setAlertOpen(true);
        setNewTask('');
        handleClose();
    }, [rows, newTask, dispatch]);

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const handleDelete = useCallback((id: number) => {
        dispatch({ type: 'DELETE_TASK', payload: id });
        setAlertMessage('¡Tarea eliminada exitosamente!');
        setAlertSeverity('error');
        setAlertOpen(true);
    }, [dispatch]);

    const changeStatus = useCallback((id: number) => {
        dispatch({ type: 'CHANGE_STATUS', payload: id });
        setAlertMessage('¡Tarea completada exitosamente!');
        setAlertSeverity('success');
        setAlertOpen(true);
    }, [dispatch]);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90, align: 'center', headerAlign: 'center' },
        {
            field: 'nombre',
            headerName: 'Nombre',
            width: 150,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 200,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params: GridRenderCellParams) => (
                <strong>
                    {params.row.status === 'No completado' && (
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            style={{ marginRight: 8 }}
                            onClick={() => changeStatus(params.row.id)}
                        >
                            <CheckCircleIcon />
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        <DeleteIcon />
                    </Button>
                </strong>
            ),
        },
    ];

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '25px',
            marginLeft: 'auto',
            marginRight: 'auto',
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                margin: '20px',
            }}>
                <Typography variant="h4" component="h1" sx={{
                    color: '#13072E',
                    fontWeight: 'bold',
                    marginBottom: '10px',
                }}>
                    Lista de tareas
                </Typography>
                <Typography variant="h6" component="h2" sx={{
                    color: '#13072E',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                }}>
                    Tareas completadas: {completedTasksCount}
                </Typography>
                <Button variant="contained" sx={{
                    backgroundColor: '#13072E',
                    color: '#FFF',
                    '&:hover': {
                        backgroundColor: '#3F2182',
                    },
                }} onClick={handleOpen}>
                    Crear tarea
                </Button>
            </Box>
            <DataGrid
                rows={rows}
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
            <Snackbar open={alertOpen} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
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
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <Button variant="contained" color="success" onClick={handleSave}>
                            Guardar
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}
