import { useContext } from "react";
import { Socket } from "socket.io-client";
import { UserContext } from "./main";

interface Props{
    list : string[];
}



export function GamesList({list} : Props){
    const socket = useContext(UserContext)
    console.log("Game Socket : ", socket.id);

    return(
        <ul>
            {list.map(gameName =>
            <li key={gameName}
            onClick={()=>{socket.emit("JOINROOM", gameName);
            console.log(`emit To ${gameName}`);
            socket.emit('setstart', gameName);
            console.log("HNA");
            }}
            >{gameName}</li>)}
        </ul>
    );
}

