import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import React, {useState} from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2'

const theme = createTheme();

export default function SignIn() {
  const [phone, setPhone] = useState('')
  const [pass, setPass] = useState('')

  const login = async(e) => {
    e.preventDefault()
    const usuario = {phone, pass}
    const respuesta = await Axios.post('/usuario/login', usuario)
    console.log(respuesta)
    
    const mensaje = respuesta.data.mensaje

    if (mensaje !== 'Bienvenido') {
      Swal.fire({
        icon: 'error',
        title: mensaje,
        showConfirmButton: false,
        timer: 1500
      })
    } else {
      const token = respuesta.data.token
      const nombre = respuesta.data.nombre
      const idUsuario = respuesta.data.id

      sessionStorage.setItem('token', token)
      sessionStorage.setItem('nombre', nombre)
      sessionStorage.setItem('idUsuario', idUsuario)

      Swal.fire({
        icon: 'success',
        title: mensaje,
        showConfirmButton: false,
        timer: 1500
      })
      window.location.href = '/VerUsuarios'
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Iniciar sesión
          </Typography>
          <Box component="form" onSubmit={login} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="No. de Teléfono"
              name="phone"
              autoComplete="phone"
              autoFocus
              onChange={(e) => setPhone(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPass(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Recuérdame"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar sesión
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}