import React, { Suspense, lazy } from 'react';
import './App.css';
// import TareasContainer from './components/TaresContainer';
import Cronometro from './components/Cronometro';
import ImagePrevisualizar from './components/ImagePrevisualizar';
import CalculadoraGastos from './components/CalculadoraGastos';
// const ListaPokemones = lazy(() => import('./components/ListaPokemones'));
const Contador = lazy(() => import('./components/Contador'));

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Suspense fallback={<div>Cargando...</div>}>
          {/* <Cronometro />
          <ImagePrevisualizar/>
          <Contador /> */}
          <CalculadoraGastos></CalculadoraGastos>
          {/* <ListaPokemones /> */}
        </Suspense>
        {/* <TareasContainer/> */}
      </header>
    </div>
  );
}

export default App;
