import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";

import React, { useState, useEffect } from "react";
import Axios from "axios";

export default function Barra() {
  const [show, setShow] = useState(true);
  const [menu, setMenu] = useState(false);
  const [opcionNuevo, setOpcionNuevo] = useState(false);
  const [opcionEditar, setOpcionEditar] = useState(false);

  const [admin, setAdmin] = useState("");
  
  const obtenerPrivilegiosUsuario = async() => {
    const id = sessionStorage.getItem("idUsuario");
    const token = sessionStorage.getItem("token");
    const respuesta = await Axios.get("/usuario/buscar/" + id, {
      headers: { autorizacion: token },
    });
    setAdmin(respuesta.data.admin)
    setOpcionNuevo(respuesta.data.admin === "Si")
    setOpcionEditar(respuesta.data.admin === "Si")
  };

  useEffect(() => {
    obtenerPrivilegiosUsuario();
    if (sessionStorage.getItem("token")) {
      setMenu(true);
      setShow(false);
    }
  }, [admin]);

  const salir = () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand={show} className="mb-3">
        <Container fluid>
          <Navbar.Toggle aria-controls="offcanvasNavbar" />
          <Navbar.Brand hidden={show} href="#">
            <i class="fas fa-user-tie"></i> {sessionStorage.getItem("nombre")}
          </Navbar.Brand>
          <Navbar.Brand hidden={show} href="#" onClick={() => salir()} to="/">
            <i class="fas fa-user-times"></i>
          </Navbar.Brand>
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">
                Opciones
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <NavDropdown
                  hidden={show}
                  title="Usuarios"
                  id="offcanvasNavbarDropdown"
                >
                  <NavDropdown.Item href="/registrarUsuario" hidden={!opcionNuevo}>
                    <i class="fas fa-user-plus"></i> Nuevo
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/editarUsuarios" hidden={!opcionEditar}>
                    <i class="fas fa-clipboard"></i> Editar
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/verUsuarios">
                    <i class="fas fa-message"></i> Mensajes
                  </NavDropdown.Item>
                  {/* <NavDropdown.Item href="/verUsuarios">
                    <i class="fas fa-key"></i> Cambiar contraseña
                  </NavDropdown.Item> */}
                </NavDropdown>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}
