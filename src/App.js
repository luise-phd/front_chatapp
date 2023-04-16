import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Barra from "./components/Barra";
import RegistrarUsuario from './components/RegistrarUsuario';
import VerUsuariosList from './components/VerUsuariosList';
import EditarUsuarios from './components/VerUsuariosM';
import VerMensajes from './components/VerMensajes';
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
        <Route path="/verUsuarios" element={<VerUsuariosList />} />
        <Route path="/editarUsuarios" element={<EditarUsuarios />} />
        <Route path="/verMensajes/:telOrigen/:telDestino" element={<VerMensajes />} />
        {/* <Route path="/verMensajes/" element={<VerMensajes />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
