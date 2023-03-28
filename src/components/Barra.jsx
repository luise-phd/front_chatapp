import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";

import React, { useState, useEffect } from "react";

export default function Barra() {
  const [show, setShow] = useState(true);
  // const [opcionRegistro, setOpcionRegistro] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      setMenu(true);
      setShow(false);
      // setOpcionRegistro(true);
    }
  }, []);

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
            <i class="fas fa-user-tie"></i> Bienvenido: {sessionStorage.getItem('nombre')}
          </Navbar.Brand>
          {/* <Navbar.Brand href="#"></Navbar.Brand>
          <Navbar.Brand href="#"></Navbar.Brand>
          <Navbar.Brand
            hidden={show}
            style={{ color: "#FFF", textDecoration: "none" }}
            href="/registrarUsuario"
          >
            <i className="fas fa-user-plus"></i>
            <Navbar.Brand>Registrarse</Navbar.Brand>
            </Navbar.Brand> */}
          <Navbar.Brand hidden={show} href="#" onClick={() => salir()} to="/">
            <i class="fas fa-user-times"></i> Cerrar sesión
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
                  title="Registros"
                  id="offcanvasNavbarDropdown"
                >
                  <NavDropdown.Item href="/registrarUsuario">
                    <i class="fas fa-user-plus"></i> Registrar usuario
                  </NavDropdown.Item>
                  {/* <NavDropdown.Item href="/registrarUsuario">
                    Registrar Usuario
                  </NavDropdown.Item> */}
                </NavDropdown>

                <NavDropdown
                  hidden={show}
                  title="Reportes"
                  id="offcanvasNavbarDropdown"
                >
                  <NavDropdown.Item href="/verUsuarios">
                    <i class="fas fa-clipboard"></i> Ver usuarios
                  </NavDropdown.Item>
                  {/* <NavDropdown.Item href="/verCiudades">
                    Ver ciudades
                  </NavDropdown.Item> */}
                </NavDropdown>
              </Nav>
              <Form className="d-flex">
                <Form.Control
                  hidden={show}
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
                <Button hidden={show} variant="outline-success">
                  Search
                </Button>
              </Form>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      <br />
    </>
  );
}
