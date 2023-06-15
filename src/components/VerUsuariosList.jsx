import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Axios from "axios";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

import notificationSound from "../media/SD_ALERT_3.mp3";

export default function SelectedListItem() {
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const [usuarios, setUsuarios] = useState([]);
  const [phoneOrigen, setPhoneOrigen] = useState("");
  const [newMessages, setNewMessages] = useState(false);

  const obtenerUsuarios = async () => {
    const id = sessionStorage.getItem("idUsuario");
    const token = sessionStorage.getItem("token");

    const respuesta2 = await Axios.get(`/usuario/buscar/${id}`, {
      headers: { autorizacion: token },
    });
    const phone = respuesta2.data.phone;
    setPhoneOrigen(phone);

    const respuesta = await Axios.get(
      `/usuario/listarUsuariosConMensajes/${phone}`,
      {
        headers: { autorizacion: token },
      }
    );

    const usuariosActivos = respuesta.data.usuarios.filter((usuario) => {
      return usuario.state === "Activo" && usuario._id !== id;
    });
    setUsuarios(usuariosActivos);
  };

  const reproducirAudio = () => {
    // Verificar si el navegador admite notificaciones
    if (!("Notification" in window)) {
      console.log("Este navegador no admite notificaciones.");
      return;
    }

    // Reproducir el sonido de notificación
    const audio = new Audio(notificationSound);
    audio.play();

    // Se necesita recargar la página para que actualice los mensajes sin leer de cada usuario
    setTimeout(() => {
      window.location.reload();
    }, 610000);
    
    // Solicitar permiso al usuario para mostrar notificaciones
    // Notification.requestPermission().then(permission => {
    //   if (permission === "granted") {
    //     // Crear y mostrar la notificación
    //     new Notification("Tienes nuevos mensajes!");
    //   }
    // });
  };

  const totalMensajesSinLeer = usuarios.reduce(
    (total, usuario) => total + usuario.mensajesSinLeer,
    0
  );

  useEffect(() => {
    if (totalMensajesSinLeer > 0) {
      Swal.fire({
        icon: "success",
        title: totalMensajesSinLeer === 1 ? `Tienes ${totalMensajesSinLeer} mensaje sin leer!` : `Tienes ${totalMensajesSinLeer} mensajes sin leer!`,
        showConfirmButton: true,
        preConfirm: () => setNewMessages(true),
      });
    }
  }, [totalMensajesSinLeer]);

  useEffect(() => {
    obtenerUsuarios();

    const intervalId = setInterval(() => {
      console.log(totalMensajesSinLeer)
      if (totalMensajesSinLeer === 0) {
        Swal.fire({
          icon: "success",
          title: "No tienes mensaje nuevos!",
          showConfirmButton: true,
          preConfirm: () => setNewMessages(true),
        });
      }
      if (newMessages) {
        reproducirAudio();
      }
    }, 20000);

    return () => clearInterval(intervalId);
  }, [newMessages, totalMensajesSinLeer]);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    console.log(index);
    // window.location.href = '/verMensajes'
    window.location.href = "/verMensajes/" + phoneOrigen + "/" + index;
  };

  return (
    <div className="container" align="center">
      <Box sx={{ width: "100%", height: "100%", bgcolor: "background.paper" }}>
        <List component="nav" aria-label="main mailbox folders">
          {usuarios.map((usuario, index) => (
            <ListItemButton
              key={index}
              selected={selectedIndex === index}
              onClick={(event) => handleListItemClick(event, usuario.phone)}
            >
              <ListItemAvatar>
                <Avatar
                  // alt={`Avatar n°${index + 1}`}
                  // src={`/static/images/avatar/${index + 1}.jpg`}
                  src={`static/images/user.jpg`}
                />
              </ListItemAvatar>
              <ListItemText
                primary={usuario.nombre}
                secondary={usuario.phone}
              />
              <ListItemText
                primary=""
                secondary={
                  usuario.mensajesSinLeer > 0 ? usuario.mensajesSinLeer : ""
                }
                align="right"
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </div>
  );
}
