import { color, func } from "three/examples/jsm/nodes/Nodes.js";
import Game from "./Game"
import { useState, createContext, useContext } from "react";
import io, { Socket } from 'socket.io-client';
import './index.css'
import { GamesList } from "./GamesList";
import { UserContext } from "./main";

interface props{
  socket : Socket;
}

let flag = false;


function App() {
  const socket = useContext(UserContext);
  // const socket = io("ws://localhost:3000");
  const [gameslist, setGamesList] = useState<string[]>([]);
  const [start, setStart] = useState(false);


  console.log("App Socket : ", socket.id);
  socket.on('GamesList', (gamesList : string[]) => {
      setGamesList(gamesList);
  })

  socket.on('start', ()=>{
    if (!flag){
      console.log("Start Play");
      flag = true;
      setStart(true);
    }
  })


  return (
    <div className={start ? "game" : ""}>
      {!start && <button onClick={() => setStart(true)}> Start Game </button>}
      <div>
        <button onClick={()=>{socket.emit('CREATEROOM', "salah"); socket.emit('GamesList');}}> CREATEGame </button>
        {start &&  <Game roomName="salah"/>}
        {gameslist.length > 0 &&  <GamesList  list={gameslist}/>}
      </div>
      </div>
  )

};


export default App;