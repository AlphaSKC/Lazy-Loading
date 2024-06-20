import { Box, Typography, Grid, Card, CardMedia, Divider, CardContent, Button } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface Pokemon {
    name: string;
    url: string;
}

interface PokemonDetalles {
    name: string;
    sprites: {
        front_default: string;
    };
}

export default function ListaPokemones() {
    const [pokemones, setPokemones] = useState<PokemonDetalles[]>([]);
    const [nextPage, setNextPage] = useState<string | null>('https://pokeapi.co/api/v2/pokemon/?limit=10');
    const isMounted = useRef(false);

    useEffect(() => {
        if (!isMounted.current) {
            fetchPokemon();
            isMounted.current = true;
        }
    }, []); 

    const fetchPokemon = async () => {
        if (!nextPage) return;

        try {
            const response = await fetch(nextPage);
            const data = await response.json();

            const promises = data.results.map(async (pokemon: Pokemon) => {
                const response = await fetch(pokemon.url);
                return response.json();
            });

            const detailedPokemonList = await Promise.all(promises);
            setPokemones(prevList => [...prevList, ...detailedPokemonList]);
            setNextPage(data.next);
        } catch (error) {
            console.error('Error fetching the Pokémon:', error);
        }
    };

    const handleLoadMoreClick = () => {
        fetchPokemon();
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '25px',
                marginLeft: 'auto',
                marginRight: 'auto',
                gap: '20px',
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 'bold',
                    fontSize: '30px',
                    background: `url(${require('../assets/FondoLetra.jpg')})`,
                    backgroundSize: 'cover',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                Pokedex
            </Typography>
            <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
                {pokemones.map((pokemon, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                        <Card sx={{ maxWidth: '345px', height: '200px', margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'transparent', border: '2px solid', borderImage: 'linear-gradient(to right, #cc66ff, #00ffff) 1' }}>
                            <CardMedia
                                sx={{ height: 140, backgroundColor: '#D7D7D7' }}
                            >
                                <LazyLoadImage
                                    alt={pokemon.name}
                                    height={140}
                                    src={pokemon.sprites.front_default}
                                    width={140}
                                />
                            </CardMedia>
                            <Divider sx={{ width: '100%', height: '2px', background: `url(${require('../assets/Fondo.jpg')})`, backgroundSize: 'cover' }} />
                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxHeight: '100px', overflow: 'hidden' }}>
                                <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'white' }}>
                                    {pokemon.name}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {nextPage && (
                <Button variant="contained" onClick={handleLoadMoreClick} sx={{
                    color: 'black',
                    background: 'white',
                    borderRadius: '20px',
                    marginTop: '10px',
                    padding: '10px 40px',
                    fontWeight: 'bold',
                    ":hover": {
                        background: '#B3AAFF',
                    }
                }}>
                    Cargar más
                </Button>
            )}

        </Box>
    );
}
