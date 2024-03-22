import { useState, createContext, useContext } from "react";
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// import './index.css'
import { Socket, io } from 'socket.io-client';
import FirstPage from "./FirstPage.tsx";

const socket = io("ws://10.13.6.7:3000/game");

export const UserContext = createContext(socket);


ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <UserContext.Provider value={socket}>
    <App></App>
    </UserContext.Provider>

  // </React.StrictMode>,
)
