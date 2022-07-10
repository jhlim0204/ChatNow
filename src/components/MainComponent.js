import React, {Component} from "react";
import {Route, Routes, Navigate} from 'react-router-dom';
import Chat from './Chat';
import Room from './Room';
import Home from './Home';
import Header from "./Header";
import { withRouter } from "../utility/withRouter";
import { io } from "socket.io-client";
import Cookies from 'js-cookie';


const socket = io(null, { transports: ["websocket"] });

class Main extends Component {
    constructor(props){
        super(props);

        this.state = {
            username: Cookies.get('username'),
            curRoom: (Cookies.get('room'))?(Cookies.get('room')):'',
            curRoomUserList: [],
            messages: []
        }
    }
    
    setRoom = (room) => {
        Cookies.set("room", room, { expires: 7 });
        this.props.navigate("/chat");
    }

    joinRoom = () => {
        const username = this.state.username;
        const room = Cookies.get("room");

        if (this.state.curRoom === Cookies.get("room")){
            socket.emit("joinRoom", username, room);
        } else if (this.state.curRoom !== ''){
            socket.emit("switchRoom", Cookies.get("room"));
            this.setState({messages: [], curRoomUserList: [], curRoom: Cookies.get('room')});
            socket.emit("joinRoom", username, room);
        } else {
            this.setState({messages: [], curRoomUserList: [], curRoom: Cookies.get('room')});
            socket.emit("joinRoom", username, room);
        }

    }

    leaveRoom = () => {
        socket.emit("leaveRoom");
        Cookies.remove("room");
        this.props.navigate('/home');
        this.setState({curRoom: '', messages: [], curRoomUserList: []});
    }

    sendMessage = (message) => {
        socket.emit("chatMessage", message);
    }

    updateStatus = () => {
        this.setState({username: Cookies.get('username'), curRoom: (Cookies.get('room'))?(Cookies.get('room')):''});
    }

    logOut = () => {
        this.leaveRoom();
        this.updateStatus();
    }

    componentDidMount() {
        if (!Cookies.get("username") && Cookies.get("room")){
            Cookies.remove("room");
        }

        socket.on("userListUpdate", (userList)=>{
            this.setState({curRoomUserList: userList})
        });

        socket.on("message", (message_obj)=>{
            this.setState({messages:this.state.messages.concat(message_obj)})
        });

        socket.on("welcomeMessage", (message_obj)=> {
            this.setState({messages:this.state.messages.concat(message_obj)})
        });

        socket.on("leaveAll", (username)=>{
            if (username === this.state.username){
                socket.emit("leaveSilent");
                Cookies.remove("room");
                this.updateStatus();
                this.props.navigate("/home");
            }
        })

        socket.on("switchAll", (username, newRoom)=>{
            if (username === this.state.username){
                socket.emit("leaveSilent");
                socket.emit("joinRoom", this.state.username, newRoom);
                Cookies.set("room", newRoom, { expires: 7 });
                this.setState({messages: [], curRoomUserList: [], curRoom: Cookies.get('room')});
                this.props.navigate("/chat");
            }
        })

    }

    render () {
        return(
            <div className="container">
                <Header username={this.state.username} room={this.state.curRoom} logOut={this.logOut} updateStatus={this.updateStatus}/>
                <Routes>
                    <Route path="/home" element={<Home />}/>
                    {this.state.username
                    ? 
                        Cookies.get("room")
                        ?                         
                        <>
                        <Route path="/chat" element={<Chat username={this.state.username} socket={socket} sendMessage={this.sendMessage} joinRoom={this.joinRoom}
                            leaveRoom={this.leaveRoom} messages={this.state.messages} curRoom={this.state.curRoom} curRoomUserList={this.state.curRoomUserList}/>} />
                        <Route path="/room" element={<Room setRoom={this.setRoom} username={this.state.username} room={this.state.curRoom}/>}/>
                        </>
                        :
                        <>
                        <Route path="/chat" element={<Room setRoom={this.setRoom} username={this.state.username} room={this.state.curRoom}/>} />
                        <Route path="/room" element={<Room setRoom={this.setRoom} username={this.state.username} room={this.state.curRoom}/>}/>
                        </>
                    : 
                        <></>
                    }
                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
            </div>
        );
    }
}



export default withRouter(Main);