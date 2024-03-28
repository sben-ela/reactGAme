import { SubscribeMessage, WebSocketGateway, MessageBody,WebSocketServer } from '@nestjs/websockets';
import { Server , Socket} from 'socket.io';
import { Room } from './Room';
import { Ball } from 'src/ball/ball';


// function removeGameList(value  : string)  {
//   const index = gamesList.indexOf(value);
//   if (index !== -1) {
//       gamesList.splice(index, 1);
//   }
// };


@WebSocketGateway({ cors: true  , namespace: 'game' })
export class EventsGateway {
  @WebSocketServer() server: Server;
  rooms = new Map();
  gamesList = new Map<string, string>();

  getClientRoomName(clientId : string){
      for(let [roomName, room] of this.rooms){
          if (room.client1.id == clientId || room.client2.id == clientId)
            return (roomName);
      }
    }
  @SubscribeMessage('CREATEROOM')
    createRoom(client: Socket, roomName : string) {

      if (!this.rooms.has(roomName)){
        console.log(roomName, " Created");
        const newRoom = new Room(roomName);
        newRoom.client1 = client;
        this.rooms.set(roomName, newRoom);
        this.gamesList.set(client.id, roomName);
        console.log(this.gamesList);
        const valuesArray = Array.from(this.gamesList.values());
        this.server.emit('GamesList', valuesArray);
        client.join(roomName);
      }
      else
        console.log("invalid Room Name");

    }
  @SubscribeMessage('JOINROOM')
    joinRoom(client : Socket, roomName : string){

      if (this.rooms.has(roomName)){
        if (this.rooms.get(roomName).client2 != undefined)
        {
          console.log(roomName, " has No place");
          return;
        }
        this.rooms.get(roomName).client2 = client;
        client.join(roomName);
        // removeGameList(roomName);
        console.log(" Joined room : ", roomName);
      }
      else 
        console.log(roomName , " Not  Exists");
    }
    @SubscribeMessage('index')
      getIndex(client : Socket, roomName : string){
        if (this.rooms.get(roomName).client1.id == client.id)
          client.emit('index', 0);
        else if (this.rooms.get(roomName).client2.id == client.id)
          client.emit('index', 1);
      }
  @SubscribeMessage('data')
  handleData(@MessageBody() data : [Ball, string]) {
      this.server.to(data[1]).emit('data', data);
  }


  @SubscribeMessage('PlayerMoves')
  playerMoves(@MessageBody() data : [any, any, string, number]){
    let room = this.rooms.get(data[2]);
    if (data[3] == 0)
      room.client2.emit('PlayerMoves', data[0], data[1])
    else if (data[3] == 1)
      room.client1.emit('PlayerMoves', data[0], data[1]);
    else
      console.log("invalid Index !!!!!!! ");
  }
  @SubscribeMessage('moveX')
  handlePlayer2Moves(@MessageBody() data : [string, number]){
    this.rooms.get(data[0]).client1.emit('moveX', data[1]);
  }
  @SubscribeMessage('moveX')
  handlePlayerMoveZ(@MessageBody() data : [string, number]){
    this.rooms.get(data[0]).client1.emit('moveZ', data[1]);
  }

  @SubscribeMessage('setstart')
  handleStart(client : Socket, roomName : string){
    // this.server.to(roomName).emit('start');
    console.log("id1 : ", this.rooms.get(roomName).client1.id);
    console.log("id2 : ", this.rooms.get(roomName).client2.id);

    this.rooms.get(roomName).client1.emit('start');
    this.rooms.get(roomName).client2.emit('start');
  }

  @SubscribeMessage('speed')
  ballSpeed(@MessageBody() data : [string, number]){
      
    if (data[1] < -200){
      this.rooms.get(data[0])?.client1?.emit('speed', 10);
      this.rooms.get(data[0])?.client1?.emit('falligPoint', 3);

    }
    else if (data[1] < -150){
      this.rooms.get(data[0])?.client1?.emit('speed', 7);
      this.rooms.get(data[0])?.client1?.emit('falligPoint', 3);

    }
    else if (data[1] < -100){
      this.rooms.get(data[0])?.client1?.emit('speed', 6);
      this.rooms.get(data[0])?.client1?.emit('falligPoint', 3);
    }
    else{
      this.rooms.get(data[0])?.client1?.emit('speed', 3);
      this.rooms.get(data[0])?.client1?.emit('falligPoint', 4);
    }

  }
  @SubscribeMessage('score')
  scoreEvent(@MessageBody() score : any[]){
    this.server.to(score[2]).emit('score', score);
  }
  @SubscribeMessage('endGame')
  endGame(@MessageBody() playerScore : any[]){
    console.log(playerScore);
    // this.server.emit('endGame', playerScore);

    this.server.to(playerScore[2]).emit('endGame', playerScore); 
  }

  handleConnection(client : Socket){
    console.log("Connect");
    const valuesArray = Array.from(this.gamesList.values());

    client.emit('GamesList', valuesArray);
    console.log("GAMELIST : ", valuesArray);
  }

  handleDisconnect(client : Socket) {
    this.gamesList.delete(client.id);
    const valuesArray = Array.from(this.gamesList.values());
    this.server.emit('GamesList', valuesArray);
    const clientRoom = this.getClientRoomName(client.id);
    console.log("ClientRoom : ", clientRoom);
    this.server.to(clientRoom)?.emit('endGame', [5, 4]);
    console.log("Disconnect");
  }  
}
