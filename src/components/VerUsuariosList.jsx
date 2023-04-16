import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Axios from "axios";

import React, { useState, useEffect } from "react";

export default function SelectedListItem() {
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const [usuarios, setUsuarios] = useState([]);
  const [phoneOrigen, setPhoneOrigen] = useState("");

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    const id = sessionStorage.getItem("idUsuario");
    const token = sessionStorage.getItem("token");
    const respuesta = await Axios.get("/usuario/listar/", {
      headers: { autorizacion: token },
    })
    const usuariosActivos = respuesta.data.filter((usuario) => {
      return usuario.state === "Activo" && usuario._id !== id
    })
    setUsuarios(usuariosActivos)

    const respuesta2 = await Axios.get(`/usuario/buscar/${id}`, {
      headers: { autorizacion: token },
    });
    const phone = respuesta2.data.phone;
    setPhoneOrigen(phone)
  }

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    console.log(index);
    // window.location.href = '/verMensajes'
    window.location.href = '/verMensajes/' + phoneOrigen + "/" + index
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
              <ListItemText primary={usuario.nombre} secondary={usuario.phone} />
            </ListItemButton>
          ))}
        </List>        
      </Box>
    </div>
  );
}
