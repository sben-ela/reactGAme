import { Socket } from "socket.io";

export class Room{
    name : string;
    client1 : Socket;
    client2 : Socket;

    constructor(name : string){
        this.name = name;
    }
}