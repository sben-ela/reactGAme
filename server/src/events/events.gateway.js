var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Room } from './Room';
let EventsGateway = (() => {
    let _classDecorators = [WebSocketGateway({ cors: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _server_decorators;
    let _server_initializers = [];
    let _JoinRoom_decorators;
    let _handleData_decorators;
    let _playerMoves_decorators;
    let _handlePlayer2Moves_decorators;
    let _handlePlayerMoveZ_decorators;
    var EventsGateway = _classThis = class {
        constructor() {
            this.server = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _server_initializers, void 0));
            this.rooms = new Map();
        }
        JoinRoom(client, roomName) {
            if (this.rooms.has(roomName)) {
                let room = this.rooms.get(roomName);
                if (room.player2Id != undefined) {
                    console.log("room has no palce !");
                    return;
                }
                if (room.player1Id != client.id) {
                    room.player2Id = client.id;
                    room.client2 = client;
                }
                client.join(roomName);
                client.emit('index', 1);
                this.rooms.set(roomName, room);
                console.log("THe client Joined Successful To ", roomName);
            }
            else {
                let room = new Room();
                room.name = roomName;
                room.client1 = client;
                room.player1Id = client.id;
                client.emit('index', 0);
                client.join(roomName);
                this.rooms.set(roomName, room);
                console.log(roomName, " Created Successful !!");
            }
        }
        handleData(data) {
            // console.log(data);
            this.server.to(data[1]).emit('data', data);
        }
        playerMoves(data) {
            let room = this.rooms.get(data[2]);
            if (data[3] == 0)
                room.client2.emit('PlayerMoves', data[0], data[1]);
            else if (data[3] == 1)
                room.client1.emit('PlayerMoves', data[0], data[1]);
            else
                console.log("invalid Index !!!!!!! ");
        }
        handlePlayer2Moves(data) {
            this.rooms.get(data[0]).client1.emit('moveX', data[1]);
        }
        handlePlayerMoveZ(data) {
            this.rooms.get(data[0]).client1.emit('moveZ', data[1]);
        }
    };
    __setFunctionName(_classThis, "EventsGateway");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _server_decorators = [WebSocketServer()];
        _JoinRoom_decorators = [SubscribeMessage('JoinRoom')];
        _handleData_decorators = [SubscribeMessage('data')];
        _playerMoves_decorators = [SubscribeMessage('PlayerMoves')];
        _handlePlayer2Moves_decorators = [SubscribeMessage('moveX')];
        _handlePlayerMoveZ_decorators = [SubscribeMessage('moveX')];
        __esDecorate(_classThis, null, _JoinRoom_decorators, { kind: "method", name: "JoinRoom", static: false, private: false, access: { has: obj => "JoinRoom" in obj, get: obj => obj.JoinRoom }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleData_decorators, { kind: "method", name: "handleData", static: false, private: false, access: { has: obj => "handleData" in obj, get: obj => obj.handleData }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _playerMoves_decorators, { kind: "method", name: "playerMoves", static: false, private: false, access: { has: obj => "playerMoves" in obj, get: obj => obj.playerMoves }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handlePlayer2Moves_decorators, { kind: "method", name: "handlePlayer2Moves", static: false, private: false, access: { has: obj => "handlePlayer2Moves" in obj, get: obj => obj.handlePlayer2Moves }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handlePlayerMoveZ_decorators, { kind: "method", name: "handlePlayerMoveZ", static: false, private: false, access: { has: obj => "handlePlayerMoveZ" in obj, get: obj => obj.handlePlayerMoveZ }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, null, _server_decorators, { kind: "field", name: "server", static: false, private: false, access: { has: obj => "server" in obj, get: obj => obj.server, set: (obj, value) => { obj.server = value; } }, metadata: _metadata }, _server_initializers, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EventsGateway = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EventsGateway = _classThis;
})();
export { EventsGateway };
