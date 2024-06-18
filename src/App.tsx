import React, { Suspense, lazy } from 'react';
import './App.css';
const ListaPokemones = lazy(()=> import('./components/ListaPokemones'));

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Suspense fallback={<div>Cargando...</div>}>
          <ListaPokemones />
        </Suspense>
      </header>
    </div>
  );
}

export default App;
