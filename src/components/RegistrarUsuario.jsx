import React, { useState, useEffect } from "react";
import Axios from "axios";
import Swal from "sweetalert2";

export default function RegistrarUsuario() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [admin, setAdmin] = useState([]);
  const [adminSelect, setAdminSelect] = useState([]);
  const [state, setState] = useState([]);
  const [stateSelect, setStateSelect] = useState([]);

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      setAdmin(["Si", "No"]);
      setAdminSelect("Si");
      setState(["Activo", "Inactivo"]);
      setStateSelect("Activo");
    }
  }, []);

  const guardar = async (e) => {
    e.preventDefault();
    const usuario = {
      nombre,
      email,
      phone,
      admin: adminSelect,
      state: stateSelect,
      pass: '123'
    };
    if (nombre === "") {
      Swal.fire({
        icon: "error",
        title: "Por favor ingrese el nombre de usuario",
        showConfirmButton: false,
        timer: 1500,
      });
    } else if (email === "") {
      Swal.fire({
        icon: "error",
        title: "Por favor ingrese el correo eléctronico",
        showConfirmButton: false,
        timer: 1500,
      });
    } else if (phone === "") {
      Swal.fire({
        icon: "error",
        title: "Por favor ingrese el No. de teléfono",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      const token = sessionStorage.getItem('token');
      console.log(usuario);
      const respuesta = await Axios.post("/usuario/crear", usuario, {
        headers: { autorizacion: token },
      });

      const mensaje = respuesta.data.mensaje
      console.log(mensaje);
      Swal.fire({
        icon: "success",
        title: mensaje,
        showConfirmButton: false,
        timer: 1500,
      });

      e.target.reset();
      setNombre("");
      setEmail("");
      setPhone("");
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-7  mx-auto">
          <div className="card">
            <div className="container text-center fa-5x">
              <i className="fas fa-user-plus"></i>
            </div>
            <div className="card-header bg-info text-center">
              <h4>Registrar Usuario</h4>
            </div>
            <div className="card-body">
              <form onSubmit={guardar}>
                <div className="row">
                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      className="form-control required"
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="text"
                      className="form-control required"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>No. de Teléfono</label>
                    <input
                      type="text"
                      className="form-control required"
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Administrador</label>
                    <select
                      className="form-control"
                      onChange={(e) => setAdminSelect(e.target.value)}
                    >
                      {admin.map((adm) => (
                        <option key={adm}>{adm}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label>Estado</label>
                    <select
                      className="form-control"
                      onChange={(e) => setStateSelect(e.target.value)}
                    >
                      {state.map((st) => (
                        <option key={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <br />
                <button type="submit" class="btn btn-outline-info">
                  <span class="fa fa-save"></span> Guardar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
