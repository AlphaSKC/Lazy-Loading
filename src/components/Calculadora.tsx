import React, { useState, useMemo } from 'react';

const Calculadora: React.FC = () => {
    const [numero1, setNumero1] = useState<number>(0);
    const [numero2, setNumero2] = useState<number>(0);
    const [operacion, setOperacion] = useState<string>('suma');

    const resultado = useMemo(() => {
        switch (operacion) {
            case 'suma':
                return numero1 + numero2;
            case 'resta':
                return numero1 - numero2;
            case 'multiplicacion':
                return numero1 * numero2;
            case 'division':
                return numero1 / numero2;
            default:
                return 0;
        }
    }, [numero1, numero2, operacion]);

    return (
        <div>
            <input
                type="number"
                value={numero1}
                onChange={(e) => setNumero1(Number(e.target.value))}
            />
            <input
                type="number"
                value={numero2}
                onChange={(e) => setNumero2(Number(e.target.value))}
            />
            <select
                value={operacion}
                onChange={(e) => setOperacion(e.target.value)}
            >
                <option value="suma">Suma</option>
                <option value="resta">Resta</option>
                <option value="multiplicacion">Multiplicación</option>
                <option value="division">División</option>
            </select>
            <p>Resultado: {resultado}</p>
        </div>
    );
};

export default Calculadora;