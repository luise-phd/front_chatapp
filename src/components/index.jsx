import React from 'react'

import Axios from 'axios'
// Axios.defaults.baseURL = 'http://192.168.20.23:4000'
// Axios.defaults.baseURL = 'http://172.17.34.5:4000'
Axios.defaults.baseURL = 'https://backchatapp-production.up.railway.app'

export default function index() {
  return (
    <div className='container'>
      <h1>Bienvenido</h1>
    </div>
  )
}