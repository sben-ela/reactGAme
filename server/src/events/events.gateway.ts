import { SubscribeMessage, WebSocketGateway, MessageBody,WebSocketServer } from '@nestjs/websockets';
import { Server , Socket} from 'socket.io';
import { SocketReadyState } from 'net';
import { Room } from './Room';
import { RouterModule } from '@nestjs/core';
import { Settings } from 'http2';
import { subscribe } from 'diagnostics_channel';
import { copyFileSync } from 'fs';
import { Game } from '../game/Game'
import { Ball } from 'src/ball/ball';
import { RouteInfoPathExtractor } from '@nestjs/core/middleware/route-info-path-extractor';

let gamesList= [];

function removeGameList(value  : string)  {
  const index = gamesList.indexOf(value);
  if (index !== -1) {
      gamesList.splice(index, 1);
  }
};


@WebSocketGateway({ cors: true })
export class EventsGateway {
  @WebSocketServer() server: Server;
  rooms = new Map();


  @SubscribeMessage('CREATEROOM')
    createRoom(client: Socket, roomName : string) {

      if (!this.rooms.has(roomName)){
        console.log(roomName, " Created");
        const newRoom = new Room(roomName);
        newRoom.client1 = client;
        this.rooms.set(roomName, newRoom);
        gamesList.push(roomName);
        console.log(gamesList);
        this.server.emit('GamesList', gamesList);
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
        removeGameList(roomName);
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
    // if (this.rooms.has(roomName))
    // {
    //   let room = this.rooms.get(roomName);
    //   if (room.player2Id != undefined){
    //     console.log("room has no palce !");
    //     return ;
    //   }
    //   if (room.player1Id != client.id)
    //   {
    //     room.player2Id = client.id;
    //     room.client2 = client;
    //   }
    //   else{
    //     console.log("client already in  :", roomName);
    //   }
    //   client.join(roomName);

    //   client.emit('index', 1);
    //   this.rooms.set(roomName, room);
    //   console.log("THe client Joined Successful To ", roomName);
    // }
    // else{
    //   let room = new Room();
    //   room.name = roomName;
    //   room.client1 = client;
    //   room.player1Id = client.id;
    //   client.emit('index', 0);
    //   client.join(roomName);
    //   this.rooms.set(roomName, room);
    //   gamesList.push(roomName);
    //   console.log(gamesList);
    //   // client.emit('GamesList', ["salah", "mohamed", "Tom"]/);
    //   console.log(roomName , " Created Successful !!");
    // }

  // }
  @SubscribeMessage('data')
  handleData(@MessageBody() data : [Ball, string]) {
      this.server.to(data[1]).emit('data', data);
  }

  // @SubscribeMessage('GamesList')
  // listGames(client : Socket){
  //   client.emit('GamesList', gamesList);

  // }

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

}
