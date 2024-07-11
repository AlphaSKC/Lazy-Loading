import styled from "@emotion/styled";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Modal, Paper, Snackbar, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../../../services/CategorieServices";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AddIcon from '@mui/icons-material/Add';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface Category{
    pkCategoria?: number;
    categoria: string;
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

export default function TableCategorias() {
    const [rows, setRows] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const [open, setOpen] = useState(false);

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getCategories();
            setRows(data);
        }
        catch (e) {
            console.error(e);
        }
    }

    const columns: GridColDef[] = [
        { field: 'pkCategoria', headerName: 'ID', width: 100 },
        { field: 'categoria', headerName: 'Categoria', width: 200 },
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
                            setSelectedCategory(params.row);
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
                        onClick={() => handleDeleteConfirmOpen(params.row.pkCategoria)}
                    >
                        <DeleteOutlineIcon />
                    </Button>
                </strong>
            ),
        },
    ];

    const handleAdd = () => {
        setSelectedCategory({ pkCategoria: 0, categoria: '' });
        setOpen(true);
    }

    const CloseModal = () => {
        setOpen(false);
    }

    const handleSave = async () => {
        if (selectedCategory) {
            try {
                if (selectedCategory.pkCategoria === 0) {
                    console.log(selectedCategory);
                    const response = await createCategory(selectedCategory);
                    console.log(response);
                    setAlertMessage(response.message);
                    setAlertSeverity('success');
                    await fetchData();
                }
                else {
                    const response = await updateCategory(selectedCategory);
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
        setDeleteCategoryId(id);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirmClose = () => {
        setDeleteConfirmOpen(false);
    };

    const handleDelete = async () => {
        if (deleteCategoryId) {
            try {
                const response = await deleteCategory(deleteCategoryId);
                setAlertMessage(response.message);
                setAlertSeverity('success');
                await fetchData();
            } catch (error) {
                setAlertMessage(`Error al eliminar la categoria: ${error}`);
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
                        <Typography><strong>Categorias</strong></Typography>
                        <Button variant="contained" onClick={handleAdd} sx={{ background: 'green' }}>
                            <AddIcon /> Agregar
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        getRowId={(row) => row.pkCategoria}
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
                            {selectedCategory?.pkCategoria === 0 ? 'Crear Categoria' : 'Editar Categoria'}  
                        </Typography>
                    </Box>
                    {/* Form */}
                    <Box sx={{ padding: '20px' }}>
                        <CustomTextField
                            label="Nombre"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={selectedCategory?.categoria}
                            onChange={(e) => setSelectedCategory({ ...selectedCategory, categoria: e.target.value })}
                        />
                        <Box sx={{ marginTop: '20px' }}>
                            <Button variant="contained" sx={{ background: '#1B4965', fontWeight: 'bold', width: '100%' }} onClick={handleSave}>
                                {selectedCategory?.pkCategoria === 0 ? 'Crear' : 'Guardar'}
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