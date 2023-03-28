import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Barra from "./components/Barra";
import RegistrarUsuario from './components/RegistrarUsuario';
// import RegistrarMensaje from './components/RegistrarMensaje';
import VerUsuarios from './components/VerUsuariosM';
// import VerMensajes from './components/VerMensajes';
import Login from "./components/LoginM";
import Index from "./components/index";

function App() {
  return (
    <Router>
      <Barra />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/index" element={<Index />} />
        <Route path="/registrarUsuario" element={<RegistrarUsuario />} />
        {/* <Route path="/registrarCiudad" element={<RegistrarCiudad />} /> */}
        <Route path="/verUsuarios" element={<VerUsuarios />} />
        {/* <Route path="/verCiudades" element={<VerCiudades />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
