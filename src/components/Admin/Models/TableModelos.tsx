import { useState, useEffect } from "react";
import { createModel, deleteModel, getModelByIdUpdate, getModels, updateModel } from "../../../services/ModelServices";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Alert, Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Modal, Paper, Snackbar, styled, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { getBrands } from "../../../services/BrandServices";

interface Model {
    pkModelo?: number;
    modelo: string;
    fkMarca: number;
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

export default function TableModelos() {
    const [rows, setRows] = useState<Model[]>([]);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);

    const [brands, setBrands] = useState<any[]>([]);

    const [open, setOpen] = useState(false);

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteModelId, setDeleteModelId] = useState<number | null>(null);

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getModels();
            setRows(data);
        }
        catch (e) {
            console.error(e);
        }
    }

    const columns: GridColDef[] =
        [
            { field: 'pkModelo', headerName: 'ID', width: 90 },
            { field: 'modelo', headerName: 'Modelo', width: 150 },
            { field: 'marca', headerName: 'Marca', width: 150 },
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
                                const model = await getModelByIdUpdate(params.row.pkModelo);
                                setSelectedModel(model);
                                handleEdit()
                            }}
                        >
                            <DriveFileRenameOutlineIcon />
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            style={{ borderRadius: '20px' }}
                            onClick={() => handleDeleteConfirmOpen(params.row.pkModelo)}
                        >
                            <DeleteOutlineIcon />
                        </Button>
                    </strong>
                ),
            },
        ];

    const handleEdit = async() => {
        const brands = await getBrands();
        setBrands(brands)
        setOpen(true);
    };

    const ChangeValuesAutoComplete = (value: any, field: keyof Model) => {
        if (selectedModel) {
            const parsedValue = parseInt(value, 10) || 0;

            setSelectedModel({
                ...selectedModel,
                [field]: parsedValue,
            });
        }
    };

    const ChangeValuesTextFields = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Model) => {
        if (selectedModel) {
            const value = e.target.value;
            setSelectedModel({
                ...selectedModel,
                [field]: value,
            });
        }
    };

    const handleAdd = async () => {
        try {
            const brands = await getBrands();
            setSelectedModel({ pkModelo: 0, modelo: '', fkMarca: 0 });
            setBrands(brands)
            setOpen(true);
        }
        catch (e) {
            console.error(e);
        }
    }
    const CloseModal = () => {
        setOpen(false);
    }

    const handleSave = async () => {
        if (selectedModel) {
            try {
                if (selectedModel.pkModelo === 0) {
                    const response = await createModel(selectedModel);
                    setAlertMessage(response.message);
                    setAlertSeverity('success');
                    await fetchData();
                }
                else {
                    const response = await updateModel(selectedModel);
                    setAlertMessage(response.message);
                    setAlertSeverity('success');
                    await fetchData();
                }
            }
            catch (e) {
                setAlertMessage(`Error al guardar el modelo: ${e}`);
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
        setDeleteModelId(id);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirmClose = () => {
        setDeleteConfirmOpen(false);
    };

    const handleDelete = async () => {
        if (deleteModelId) {
            try {
                const response = await deleteModel(deleteModelId);
                setAlertMessage(response.message);
                setAlertSeverity('success');
                await fetchData();
            } catch (error) {
                setAlertMessage(`Error al eliminar el modelo: ${error}`);
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
                        <Typography><strong>Modelos</strong></Typography>
                        <Button variant="contained" sx={{ background: 'green' }} onClick={handleAdd}>
                            <AddIcon /> Agregar
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        getRowId={(row) => row.pkModelo}
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
                            {selectedModel?.pkModelo === 0 ? 'Crear Modelo' : 'Editar Modelo'}
                        </Typography>
                    </Box>
                    {/* Form */}
                    <Box sx={{ padding: '20px' }}>
                        <CustomTextField
                            label="Nombre"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={selectedModel?.modelo || ''}
                            onChange={(e) => ChangeValuesTextFields(e, 'modelo')}
                        />
                        <Autocomplete
                            disablePortal
                            value={brands.find((brand) => brand.pkMarca === selectedModel?.fkMarca) || null}
                            onChange={(e, newValue) => ChangeValuesAutoComplete(newValue ? newValue.pkMarca : '', 'fkMarca')}
                            options={brands}
                            getOptionLabel={(option) => option.marca}
                            renderInput={(params) => <TextField {...params} label="Marca" />}
                        />
                        <Box sx={{ marginTop: '20px' }}>
                            <Button variant="contained" sx={{ background: '#1B4965', fontWeight: 'bold', width: '100%' }} onClick={handleSave}>
                                {selectedModel?.pkModelo === 0 ? 'Crear' : 'Guardar'}
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
                        ¿Estás seguro de que deseas eliminar este modelo?
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
