import { useState, createContext, useContext } from "react";
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// import './index.css'
import { Socket, io } from 'socket.io-client';



const socket = io("ws://localhost:3000");

export const UserContext = createContext(socket);



ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <UserContext.Provider value={socket}>

    <App />
    </UserContext.Provider>

  // </React.StrictMode>,
)
