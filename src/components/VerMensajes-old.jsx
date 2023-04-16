import Box from "@mui/material/Box";
import List from "@mui/material/List";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import Axios from "axios";
import Swal from "sweetalert2";

// import io from 'socket.io-client';

export default function EnviarMensaje() {
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const [msg, setMsg] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [phone, setPhone] = useState("");

  const { telOrigen } = useParams();
  // console.log(telOrigen);

  // const socket = io.connect("http://localhost:4000");

  const obtenerMensajes = useCallback(async () => {
    const id = sessionStorage.getItem("idUsuario");
    const token = sessionStorage.getItem("token");
    const respuesta = await Axios.get("/mensaje/listar/", {
      headers: { autorizacion: token },
    });
    const respuesta2 = await Axios.get(`/usuario/buscar/${id}`, {
      headers: { autorizacion: token },
    });
    const phone = respuesta2.data.phone;
    setPhone(phone);

    const mensajesSeleccionados = respuesta.data.filter((mensaje) => {
      return (
        (mensaje.phoneDestino === phone && mensaje.phoneOrigen === telOrigen) ||
        (mensaje.phoneDestino === telOrigen && mensaje.phoneOrigen === phone)
      );
    });
    setMensajes(mensajesSeleccionados);
  }, [telOrigen]);

  const enviar = async (e) => {
    e.preventDefault();
    const mensaje = {
      msg,
      phoneDestino: telOrigen,
      phoneOrigen: phone,
    };
    if (msg === "") {
      Swal.fire({
        icon: "error",
        title: "Por favor ingrese el mensaje",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      const token = sessionStorage.getItem("token");
      console.log(mensaje);
      const respuesta = await Axios.post("/mensaje/enviar", mensaje, {
        headers: { autorizacion: token },
      });

      const message = respuesta.data.mensaje;
      console.log(message);
      // Swal.fire({
      //   icon: "success",
      //   title: message,
      //   showConfirmButton: false,
      //   timer: 1500,
      // });
      setMsg("");
    }
  };

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  // useEffect(() => {
  //   obtenerMensajes();

  //   socket.on("connect", () => {
  //     console.log("Connected to server");
  //   });
  
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [obtenerMensajes, socket]);

  useEffect(() => {
    obtenerMensajes();
    const intervalId = setInterval(() => {
      obtenerMensajes();
    }, 2000); // hacer una solicitud cada 2 segundos  
    return () => clearInterval(intervalId);
  }, [obtenerMensajes]);
  
  return (
    <div className="container" align="center">
      <div style={{ height: "76vh" }}>
        <Box
          sx={{ width: "100%", height: "100%", bgcolor: "background.paper" }}
        >
          <div style={{ height: "98%", overflowY: "scroll" }}>
            <List>
              {mensajes.map((mensaje, index) => (
                <ListItemButton
                  key={index}
                  selected={selectedIndex === index}
                  onClick={(event) => handleListItemClick(event, mensaje._id)}
                >
                  <ListItemText
                    primary={mensaje.msg}
                    secondary={mensaje.date}
                  />
                </ListItemButton>
              ))}
            </List>
          </div>
        </Box>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <TextField
          style={{ width: "calc(100% - 70px)" }}
          required
          id="outlined-required"
          label="Mensaje"
          multiline
          defaultValue=""
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "56px",
            marginTop: "auto",
            "& > *:nth-of-type(1)": {
              marginRight: "-5px",
            },
          }}
          onClick={enviar}
        />
      </div>
    </div>
  );
}