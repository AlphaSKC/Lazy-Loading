import { useState, useRef } from "react";
import { Box, Typography, Button } from "@mui/material";

export default function Cronometro() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          margin: "25px",
          padding: "25px",
          backgroundColor: "#f5f5f5",
          borderRadius: "10px",
          border: "2px solid #009999",
        }}
      >
        <Typography
          sx={{
              fontWeight: 'bold',
              background: `url(${require('../assets/FondoLetra.jpg')})`,
              backgroundSize: 'cover',
              fontSize: '3rem',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
          }}
        >
          Tiempo transcurrido: {secondsPassed.toFixed(3)}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "20px" }}>
          <Button
            onClick={handleStart}
            sx={{
              backgroundColor: "#00cc44",
              color: "white",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#00b359",
              },
            }}
          >
            Comenzar
          </Button>
          <Button
            onClick={handleStop}
            sx={{
              backgroundColor: "#ff1a1a",
              color: "white",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#cc0000",
              },
            }}
          >
            Detener
          </Button>
        </Box>
      </Box>
    </>
  );
}
