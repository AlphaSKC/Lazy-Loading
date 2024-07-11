import { Box, Paper, Grid, Typography, Button, Modal, TextField, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, styled } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AddIcon from '@mui/icons-material/Add';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useEffect, useState } from "react";
import { createBrand, deleteBrand, getBrands, updateBrand } from "../../../services/BrandServices";

interface Brands {
    pkMarca?: number;
    marca: string;
}

const CustomTextField = styled(TextField)({
    '& label': {
        color: 'black',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'black',
        },
        '&:hover fieldset': {
            borderColor: '#1B4965',
        },
        '& input': {
            color: '#1B4965',
        }
    }
});

export default function TableMarcas() {

    const [rows, setRows] = useState<Brands[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<Brands | null>(null);

    const [open, setOpen] = useState(false);

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteBrandId, setDeleteBrandId] = useState<number | null>(null);

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getBrands();
            setRows(data);
        }
        catch (e) {
            console.error(e);
        }
    }
    const columns: GridColDef[] = [
        { field: 'pkMarca', headerName: 'ID', width: 100 },
        { field: 'marca', headerName: 'Marca', width: 200 },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 200,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <strong>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginRight: 8, borderRadius: '20px' }}
                        onClick={async () => {
                            setSelectedBrand(params.row);
                            setOpen(true);
                        }}
                    >
                        <DriveFileRenameOutlineIcon />
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        style={{ borderRadius: '20px' }}
                        onClick={() => handleDeleteConfirmOpen(params.row.pkMarca)}
                    >
                        <DeleteOutlineIcon />
                    </Button>
                </strong>
            ),
        },
    ];

    const handleAdd = () => {
        setSelectedBrand(null);
        setOpen(true);
    }

    const CloseModal = () => {
        setOpen(false);
    }

    const handleSave = async () => {
        if (selectedBrand) {
            try {
                if (selectedBrand.pkMarca === 0) {
                    console.log(selectedBrand);
                    const response = await createBrand(selectedBrand);
                    console.log(response);
                    setAlertMessage(response.message);
                    setAlertSeverity('success');
                    await fetchData();
                }
                else {
                    const response = await updateBrand(selectedBrand);
                    setAlertMessage(response.message);
                    setAlertSeverity('success');
                    await fetchData();
                }
            }
            catch (e) {
                setAlertMessage(`Error al guardar la marca: ${e}`);
                setAlertSeverity('error');
            }
            setAlertOpen(true);
            setOpen(false);
        }
    }

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    const handleDeleteConfirmOpen = (id: number) => {
        setDeleteBrandId(id);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirmClose = () => {
        setDeleteConfirmOpen(false);
    };

    const handleDelete = async () => {
        if (deleteBrandId) {
            try {
                const response = await deleteBrand(deleteBrandId);
                setAlertMessage(response.message);
                setAlertSeverity('success');
                await fetchData();
            } catch (error) {
                setAlertMessage(`Error al eliminar la marca: ${error}`);
                setAlertSeverity('error');
            }
            setAlertOpen(true);
            setDeleteConfirmOpen(false);
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '25px',
            marginLeft: 'auto',
            marginRight: 'auto',
            flexWrap: 'wrap',
            width: 'auto',
        }}>
            {/* Tabla */}
            <Paper>
                <Grid item xs={12} md={12} lg={12}>
                    <Box sx={{ margin: '20px 50px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        <Typography><strong>Marcas</strong></Typography>
                        <Button variant="contained" onClick={handleAdd} sx={{ background: 'green' }}>
                            <AddIcon /> Agregar
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        getRowId={(row) => row.pkMarca}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        pageSizeOptions={[5]}
                    />
                </Grid>
            </Paper>
            {/* Modal Create */}
            <Modal open={open} onClose={CloseModal}>
                <Box
                    component="form"
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        background: 'white',
                        border: '2px solid #FFF',
                        borderRadius: '20px',
                        boxShadow: 24
                    }}
                >
                    {/* Titulo */}
                    <Box sx={{
                        display: 'flex',
                        backgroundColor: '#1B4965',
                        padding: '20px',
                        borderRadius: '20px',
                        marginBottom: '5px',
                    }}>
                        <Typography variant="h6" component="h2" sx={{
                            color: '#FFF',
                            fontWeight: 'bold',
                        }}>
                            {selectedBrand?.pkMarca === 0 ? 'Crear Marca' : 'Editar Marca'}  
                        </Typography>
                    </Box>
                    {/* Form */}
                    <Box sx={{ padding: '20px' }}>
                        <CustomTextField
                            label="Nombre"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={selectedBrand?.marca}
                            onChange={(e) => setSelectedBrand({ ...selectedBrand, marca: e.target.value })}
                        />
                        <Box sx={{ marginTop: '20px' }}>
                            <Button variant="contained" sx={{ background: '#1B4965', fontWeight: 'bold', width: '100%' }} onClick={handleSave}>
                                {selectedBrand?.pkMarca === 0 ? 'Crear' : 'Guardar'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            {/* Alerta de acciones */}
            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>

            <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar esta categoria?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteConfirmClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}