import { DataGrid } from "@mui/x-data-grid";

import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import Axios from "axios";
import Swal from 'sweetalert2';

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";

export default function VerUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [idusuario, setIdUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [admin, setAdmin] = useState([]);
  const [adminSelect, setAdminSelect] = useState([]);
  const [state, setState] = useState([]);  
  const [stateSelect, setStateSelect] = useState([]);

  const [contador, setContador] = useState(1);

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    obtenerUsuarios();
    setAdmin(["Si", "No"]);
    setAdminSelect("Si");
    setState(["Activo", "Inactivo"]);
    setStateSelect("Activo");
  }, []);

  const obtenerUsuarios = async () => {
    const id = sessionStorage.getItem("idUsuario");
    const token = sessionStorage.getItem("token");
    const respuesta = await Axios.get("/usuario/listar/", {
      headers: { autorizacion: token },
    });
    setUsuarios(respuesta.data)
    console.log(id);
  };

  const data = usuarios.map((usuario, index) => ({
    id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    phone: usuario.phone,
    admin: usuario.admin,
    state: usuario.state,
    fila: contador + index
  }));

  const obtenerUsuario = async(params) => {
    setShow(true);
    const id = params.id;
    const token = sessionStorage.getItem("token");
    const respuesta = await Axios.get("/usuario/buscar/" + id, {
      headers: { autorizacion: token },
    });
    console.log(respuesta.data);

    setIdUsuario(respuesta.data._id)
    setNombre(respuesta.data.nombre);
    setEmail(respuesta.data.email);
    setPhone(respuesta.data.phone);
    setAdminSelect(respuesta.data.admin);
    setStateSelect(respuesta.data.state);
  };
  
  const editarUsuario = async() => {
    const id = idusuario
    const token = sessionStorage.getItem("token")
    const usuario = {
      nombre,
      email,
      phone,
      admin: adminSelect,
      state: stateSelect
    }
    const respuesta = await Axios.put("/usuario/editar/" + id, usuario, {
      headers: { autorizacion: token },
    })
    const mensaje = respuesta.data.mensaje
    obtenerUsuarios()

    Swal.fire({
      icon: 'success',
      title: mensaje,
      showConfirmButton: false,
      timer: 1500
    })

    setShow(false)
  };

  const eliminarUsuario = async(params) => {
    const id = params.id
    const token = sessionStorage.getItem("token")
    const respuesta = await Axios.delete("/usuario/eliminar/" + id, {
      headers: { autorizacion: token },
    })
    const mensaje = respuesta.data.mensaje
    console.log(mensaje)

    Swal.fire({
      icon: 'success',
      title: mensaje,
      showConfirmButton: false,
      timer: 1500
    })

    obtenerUsuarios()
  };

  const columns: GridColDef[] = [
    { field: "fila", headerName: "ID", headerAlign: "center", align: "center", width: 40 },
    { field: "nombre", headerName: "NOMBRE", width: 200 },
    { field: "email", headerName: "EMAIL", width: 200 },
    { field: "phone", headerName: "N. TELÉFONO", width: 120 },
    { field: "admin", headerName: "ADMINISTRADOR", headerAlign: "center", width: 130},
    { field: "state", headerName: "ESTADO", width: 80 },
    {
      headerName: "ACCIONES",
      width: 110,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div>
            <Tooltip title="Editar">
              <IconButton onClick={() => obtenerUsuario(params)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton onClick={() => eliminarUsuario(params)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <div className="container" align="center">
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>

      <Modal isOpen={show} toggle={handleClose} size="xs">
        <ModalHeader>
          <div>
            <h3>Editar usuario</h3>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className="container mt-4">
            <div className="row">
              <div className="col-md-9 mx-auto">
                <div className="card">
                  <div className="container text-center fa-5x">
                    <i className="fas fa-user-plus"></i>
                  </div>
                  <div className="card-header bg-info text-center">
                    <h4>Registrar usuario</h4>
                  </div>
                  <div className="card-body">
                    <form onSubmit={"guardar"}>
                      <div className="row">
                        <div className="form-group">
                          <label>Nombre</label>
                          <input
                            type="text"
                            className="form-control required"
                            onChange={(e) => setNombre(e.target.value)}
                            value={nombre}
                          />
                        </div>

                        <div className="form-group">
                          <label>Email</label>
                          <input
                            type="text"
                            className="form-control required"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                          />
                        </div>

                        <div className="form-group">
                          <label>N. Teléfono</label>
                          <input
                            type="text"
                            className="form-control required"
                            onChange={(e) => setPhone(e.target.value)}
                            value={phone}
                          />
                        </div>

                        <div className="col-md-6">
                          <label>Administrador</label>
                          <select
                            className="form-control"
                            onChange={(e) =>
                              setAdminSelect(e.target.value)
                            }
                            value={adminSelect}
                          >
                            {admin.map((adm) => (
                              <option key={adm}>
                                {adm}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label>Estado</label>
                          <select
                            className="form-control"
                            onChange={(e) =>
                              setStateSelect(e.target.value)
                            }
                            value={stateSelect}
                          >
                            {state.map((st) => (
                              <option key={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button color='primary' onClick={() => editarUsuario()}>Editar</Button>{'  '}
          <Button color='danger' onClick={handleClose}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
