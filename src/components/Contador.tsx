import { Box, Button, Typography } from "@mui/material";
import { useReducer } from "react";

interface Action {
    type: string;
}

interface State {
    count: number;
}

const reductor = (state: State, action: Action) => {
    switch (action.type) {
        case 'increment':
            return { count: state.count + 1 };
        case 'decrement':
            return { count: state.count - 1 };
        case 'reset':
            return { count: 0 };
        default:
            throw new Error();
    }
}

export default function Contador() {
    const [state, dispatch] = useReducer(reductor, { count: 0 });

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            margin: '25px',
            padding: '25px',
            backgroundColor: '#f5f5f5',
            borderRadius: '10px',
            border: '2px solid #009999',
        }}>
            <Typography
                variant="h1"
                sx={{
                    fontWeight: 'bold',
                    background: `url(${require('../assets/FondoLetra.jpg')})`,
                    backgroundSize: 'cover',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                {state.count}
            </Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '20px',
            }}>
                <Button onClick={() => dispatch({ type: 'decrement' })} sx={{
                    backgroundColor: '#ff1a1a',
                    color: 'white',
                    fontWeight: 'bold',
                    '&:hover': {
                        backgroundColor: '#cc0000',
                    }
                }}>
                    -1
                </Button>
                <Button onClick={() => dispatch({ type: 'reset' })} sx={{
                    backgroundColor: '#1a75ff',
                    color: 'white',
                    fontWeight: 'bold',
                    '&:hover': {
                        backgroundColor: '#0052cc',
                    }
                }}>
                    0
                </Button>
                <Button onClick={() => dispatch({ type: 'increment' })} sx={{
                    backgroundColor: '#00cc44',
                    color: 'white',
                    fontWeight: 'bold',
                    '&:hover': {
                        backgroundColor: '#00b359',
                    }

                }}>
                    +1
                </Button>
            </Box>
        </Box>
    );
}
