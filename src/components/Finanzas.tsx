import { Box, Button, Grid, InputAdornment, Paper, styled, TextField, Typography } from "@mui/material";
import { useState } from "react";
import PercentIcon from '@mui/icons-material/Percent';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const CustomTextField = styled(TextField)({
    '& label': {
        color: '#13072E',
    },
    '& label.Mui-focused': {
        color: '#d65fe8',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#13072E',
        },
        '& fieldset.Mui-selected': {
            borderColor: '#d65fe8',
        },
        '&:hover fieldset': {
            borderColor: '#d65fe8',
        },
        '& input': {
            color: '#13072E',
        },
    },
    '& .MuiInputAdornment-root': {
        color: '#13072E',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#d65fe8',
    },
});

export default function Finanzas() {
    const [inversionInicial, setInversionInicial] = useState<number>(0);
    const [flujos, setFlujos] = useState<number[]>([]);
    const [inflacion, setInflacion] = useState<number>(0);

    const [rentabilidadTotal, setRentabilidadTotal] = useState<number>(0);
    const [rentabilidadFlujoMedio, setRentabilidadFlujoMedio] = useState<number>(0);
    const [rentabilidadInflacion, setRentabilidadInflacion] = useState<number>(0);
    const [payback, setPayback] = useState<number>(0);
    const [vpn, setVPN] = useState<number>(0);
    const [tir, setTIR] = useState<number>(0);
    const [calculado, setCalculado] = useState<boolean>(false);

    const handleAddFlujo = () => {
        setFlujos([...flujos, 0]);
    };

    const handleRemoveFlujo = () => {
        setFlujos(flujos.slice(0, -1));
    };

    const handleReset = () => {
        setInversionInicial(0);
        setFlujos([]);
        setInflacion(0);
        setRentabilidadTotal(0);
        setRentabilidadFlujoMedio(0);
        setRentabilidadInflacion(0);
        setPayback(0);
        setVPN(0);
        setTIR(0);
        setCalculado(false);
    };


    const handleChangeFlujo = (index: number, value: number) => {
        const newFlujos = [...flujos];
        newFlujos[index] = value;
        setFlujos(newFlujos);
    };

    const calcularResultados = () => {
        const rentabilidadTotal = calcularRentabilidadTotal(flujos, inversionInicial);
        const rentabilidadFlujoMedio = calcularRentabilidadFlujoMedio(flujos, inversionInicial);
        setRentabilidadTotal(rentabilidadTotal);
        setRentabilidadFlujoMedio(rentabilidadFlujoMedio);
        const rentabilidadInflacion = calcularRentabilidadInflacion(rentabilidadTotal / 100, inflacion / 100);
        setRentabilidadInflacion(rentabilidadInflacion);
        const payback = calcularPayback(inversionInicial, flujos);
        const vpn = calcularVPN(inversionInicial, flujos, inflacion / 100);
        const tir = calcularTIR(inversionInicial, flujos);

        setPayback(payback);
        setVPN(vpn);
        setTIR(tir);
        setCalculado(true);
    };

    const calcularRentabilidadTotal = (flujos: number[], inversion: number): number => {
        const flujoTotal = flujos.reduce((acc, flujo) => acc + flujo, 0);
        return (flujoTotal / inversion) * 100;
    };

    const calcularRentabilidadFlujoMedio = (flujos: number[], inversion: number): number => {
        const flujoMedio = flujos.reduce((acc, flujo) => acc + flujo, 0) / flujos.length;
        return (flujoMedio / inversion) * 100;
    }

    const calcularRentabilidadInflacion = (rentabilidad: number, inflacion: number): number => {
        const derecha = inflacion * (1 + (rentabilidad));
        return ((rentabilidad) + derecha) * 100;
    }

    const calcularPayback = (inversionInicial: number, flujos: number[]): number => {
        const F = flujos.reduce((acc, flujo) => acc + flujo, 0) / flujos.length;
        return inversionInicial / F;
    };

    const calcularVPN = (inversionInicial: number, flujos: number[], tasa: number): number => {
        return flujos.reduce((acc, flujo, i) => acc + flujo / Math.pow(1 + tasa, i + 1), -inversionInicial);
    };

    const calcularTIR = (inversionInicial: number, flujos: number[]): number => {
        const MAX_ITER = 1000;
        const TOLERANCE = 1e-6;
        let tir = 0.1;
        let delta = 0.1;
        for (let iter = 0; iter < MAX_ITER; iter++) {
            const vpn = calcularVPN(inversionInicial, flujos, tir);
            if (Math.abs(vpn) < TOLERANCE) break;
            tir = vpn > 0 ? tir + delta : tir - delta;
            delta /= 2;
        }
        return tir * 100;
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' },
            gap: '20px',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
        }}>
            <Paper elevation={2} sx={{
                padding: '20px',
                margin: '20px',
                backgroundColor: '#F9F5FF',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                maxWidth: '500px',
            }}>
                <Typography variant="h4" component="h1" sx={{
                    color: '#13072E',
                    fontWeight: 'bold',
                    marginBottom: '10px',
                }}>
                    Calculadora de Finanzas
                </Typography>
                <CustomTextField
                    label="Inversión Inicial"
                    type="number"
                    value={inversionInicial}
                    onChange={e => setInversionInicial(parseFloat(e.target.value))}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AttachMoneyIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <CustomTextField
                    label="Inflación (%)"
                    type="number"
                    value={inflacion}
                    onChange={e => setInflacion(parseFloat(e.target.value))}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PercentIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Box sx={{ maxHeight: '200px', overflowY: 'auto', padding: '20px' }}>
                    <Grid container spacing={2}>
                        {flujos.map((flujo, index) => (
                            <Grid item xs={12} sm={12} md={6} lg={6} key={index}>
                                <CustomTextField
                                    label={`Flujo ${index + 1}`}
                                    type="number"
                                    value={flujo}
                                    onChange={e => handleChangeFlujo(index, parseFloat(e.target.value))}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AttachMoneyIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Button variant="contained" sx={{
                            backgroundColor: '#00cc00',
                            color: '#FFF',
                            '&:hover': {
                                backgroundColor: '#00b359',
                            },
                        }} onClick={handleAddFlujo}>
                            Añadir Flujo
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Button variant="contained" sx={{
                            backgroundColor: '#0099ff',
                            color: '#FFF',
                            '&:hover': {
                                backgroundColor: '#006bb3',
                            },
                            '&:disabled': {
                                backgroundColor: '#CCC',
                                color: '#000',
                                cursor: 'not-allowed',
                            },
                            '&:hover:disabled': {
                                backgroundColor: '#CCC',
                                color: '#000',
                                cursor: 'not-allowed',
                            }
                        }} onClick={handleReset} disabled={flujos.length === 0 && inversionInicial === 0 && inflacion === 0}>
                            Restaurar Todo
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Button variant="contained" sx={{
                            backgroundColor: '#ff0000',
                            color: '#FFF',
                            '&:hover': {
                                backgroundColor: '#cc0000',
                            },
                            '&:disabled': {
                                backgroundColor: '#CCC',
                                color: '#000',
                                cursor: 'not-allowed',
                            },
                            '&:hover:disabled': {
                                backgroundColor: '#CCC',
                                color: '#000',
                                cursor: 'not-allowed',
                            }
                        }} onClick={handleRemoveFlujo} disabled={flujos.length === 0}>
                            Quitar Flujo
                        </Button>
                    </Grid>

                </Grid>
                <Button disabled={!(flujos.length > 0)} variant="contained" sx={{
                    backgroundColor: '#13072E',
                    color: '#FFF',
                    '&:hover': {
                        backgroundColor: '#3F2182',
                        cursor: 'pointer',
                    },
                    '&:disabled': {
                        backgroundColor: '#CCC',
                        color: '#000',
                        cursor: 'not-allowed',
                    },
                    '&:hover:disabled': {
                        backgroundColor: '#CCC',
                        color: '#000',
                        cursor: 'not-allowed',
                    }
                }} onClick={calcularResultados}>
                    Calcular resultados
                </Button>
            </Paper>
            <Paper elevation={2}
                sx={{
                    padding: '20px',
                    margin: '20px',
                    backgroundColor: '#F9F5FF',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    maxWidth: '600px',
                }}>
                <Typography variant="h4" component="h1" sx={{
                    color: '#13072E',
                    fontWeight: 'bold',
                    marginBottom: '10px',
                }}>
                    Resultados
                </Typography>
                <Box display={calculado ? 'flex' : 'none'}
                    sx={
                        {
                            gap: '10px',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }
                    }>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '10px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                    }}>
                        <Typography variant="h5" sx={{ color: '#d65fe8' }}>
                            Rentabilidad Total:
                        </Typography>
                        <Typography variant="h5" sx={{ color: '#13072E' }}>
                            {rentabilidadTotal} %
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '10px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                    }}>
                        <Typography variant="h5" sx={{ color: '#d65fe8' }}>
                            Rentabilidad Flujo Medio:
                        </Typography>
                        <Typography variant="h5" sx={{ color: '#13072E' }}>
                            {rentabilidadFlujoMedio} %
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '10px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                    }}>
                        <Typography variant="h5" sx={{ color: '#d65fe8' }}>
                            Payback:
                        </Typography>
                        <Typography variant="h5" sx={{ color: '#13072E' }}>
                            {payback.toFixed(2)} años
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '10px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                    }}>
                        <Typography variant="h5" sx={{ color: '#d65fe8' }}>
                            Rentabilidad Inflación:
                        </Typography>
                        <Typography variant="h5" sx={{ color: '#13072E' }}>
                            {rentabilidadInflacion.toFixed(4)} %
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '10px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                    }}>
                        <Typography variant="h5" sx={{ color: '#d65fe8' }}>
                            VPN:
                        </Typography>
                        <Typography variant="h5" sx={{ color: '#13072E' }}>
                            {vpn.toFixed(4)}
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '10px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                    }}>
                        <Typography variant="h5" sx={{ color: '#d65fe8' }}>
                            TIR:
                        </Typography>
                        <Typography variant="h5" sx={{ color: '#13072E' }}>
                            {tir.toFixed(4)} %
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}