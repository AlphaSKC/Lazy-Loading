import React, { Suspense, lazy } from 'react';
import './App.css';
// import TareasContainer from './components/TaresContainer';
import Cronometro from './components/Cronometro';
import ImagePrevisualizar from './components/ImagePrevisualizar';
import CalculadoraGastos from './components/CalculadoraGastos';
import TableMarcas from './components/Admin/Brands/TableMarcas';
import TableCategorias from './components/Admin/Categories/TableCategorias';
import TableModelos from './components/Admin/Models/TableModelos';
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
          {/* <CalculadoraGastos></CalculadoraGastos> */}
          {/* <ListaPokemones /> */}
          {/* <TableMarcas></TableMarcas> */}
          {/* <TableCategorias></TableCategorias> */}
          <TableModelos></TableModelos>
        </Suspense>
        {/* <TareasContainer/> */}
      </header>
    </div>
  );
}

export default App;
