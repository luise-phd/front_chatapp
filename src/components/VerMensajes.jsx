import Box from "@mui/material/Box";
import List from "@mui/material/List";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

// import notificationSound from '../media/SD_ALERT_3.mp3';

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";

import Axios from "axios";
import Swal from "sweetalert2";

export default function EnviarMensaje() {

  const [msg, setMsg] = useState("");
  const [mensajes, setMensajes] = useState([]);

  const [edicionRealizada, setEdicionRealizada] = useState(false);

  const listRef = useRef(null);

  const { telOrigen, telDestino } = useParams();
  // console.log(telOrigen, telDestino);

  const obtenerMensajes = useCallback(async () => {
    // const id = sessionStorage.getItem("idUsuario");
    const token = sessionStorage.getItem("token");
    const respuesta = await Axios.get("/mensaje/listar/"+ telOrigen + "/" + telDestino, {
      headers: { autorizacion: token },
    });
    setMensajes(respuesta.data);

    // Obtener los IDs de los mensajes para editar el estado
    // const mensajeIds = respuesta.data.map((mensaje) => mensaje._id);
    // console.log(mensajeIds)

    // Editar los estados de los mensajes a 1
    // await Axios.post("/mensaje/editarEstado", { mensajeIds }, {
    //   headers: { autorizacion: token },
    // });

    listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
    
  }, [telOrigen, telDestino]);

  const editarEstadosMensajes = useCallback(async () => {
    const token = sessionStorage.getItem("token");
    const respuesta = await Axios.get("/mensaje/listar/"+ telOrigen + "/" + telDestino, {
      headers: { autorizacion: token },
    });
    setMensajes(respuesta.data);

    // Obtener los IDs de los mensajes para editar el estado
    const mensajeIds = respuesta.data.map((mensaje) => mensaje._id);

    await Axios.post("/mensaje/editarEstado/"+ telOrigen + "/" + telDestino, { mensajeIds }, {
      headers: { autorizacion: token },
    });

    setEdicionRealizada(true);
  }, [telOrigen, telDestino]);

  const enviar = async (e) => {
    e.stopPropagation();
    const mensaje = {
      msg,
      phoneDestino: telOrigen,
      phoneOrigen: telDestino,
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
      // console.log(mensaje);
      await Axios.post("/mensaje/enviar", mensaje, {
        headers: { autorizacion: token },
      });
      setMsg("");
    }
  };

  // const socket = io(process.env.REACT_APP_SOCKET_SERVER);

  // useEffect(() => {
  //   obtenerMensajes();
  // }, [obtenerMensajes]);

  // useEffect(() => {
  //   obtenerMensajes();

  //   const intervalId = setInterval(() => {
  //     obtenerMensajes();
  //   }, 1000); // hacer una solicitud cada segundo

  //   return () => clearInterval(intervalId);
  // }, [obtenerMensajes]);

  useEffect(() => {
    obtenerMensajes();
  }, [obtenerMensajes]);

  useEffect(() => {
    if (!edicionRealizada) {
      editarEstadosMensajes();
    }

    const intervalId = setInterval(() => {
      obtenerMensajes();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [obtenerMensajes, editarEstadosMensajes, edicionRealizada]);

  /*const handleClick = () => {
    // Verificar si el navegador admite notificaciones
    if (!("Notification" in window)) {
      console.log("Este navegador no admite notificaciones.");
      return;
    }

    const audio = new Audio(notificationSound);
    audio.play();

    // Solicitar permiso al usuario para mostrar notificaciones
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        // Crear y mostrar la notificación
        new Notification("Tienes nuevos mensajes!");

        // Reproducir el sonido de notificación
        // const audio = new Audio(notificationSound);
        // audio.play();
      }
    });
  }*/
  
  return (
    <div className="container" align="center">
      <div style={{ height: "76vh" }}>
        <Box
          sx={{ width: "100%", height: "100%", bgcolor: "background.paper" }}
        >
          <div style={{ height: "98%", overflowY: "scroll" }}>
            <List ref={listRef}>
              {mensajes.map((mensaje, index) => (
                <ListItemButton
                  key={index}
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
        {/* <Button onClick={handleClick}>Lanzar notificación</Button> */}
      </div>
    </div>
  );
}