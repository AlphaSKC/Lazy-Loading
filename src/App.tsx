import React, { Suspense, lazy } from 'react';
import './App.css';
const ListaPokemones = lazy(()=> import('./components/ListaPokemones'));
const Contador = lazy(()=> import('./components/Contador'));

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Suspense fallback={<div>Cargando...</div>}>
          <Contador/>
          <ListaPokemones />
        </Suspense>
      </header>
    </div>
  );
}

export default App;
