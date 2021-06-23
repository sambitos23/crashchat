import { Avatar } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import db from './firebase';
import './SidebarChat.css';

function SidebarChat({ id, name, addNewChat }) {
    const [seed, setSeed] = useState("");
    const [messages, setMessages] = useState("");

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    }, [])

    useEffect(() => {
        if (id) {
            db
                .collection('rooms')
                .doc(id)
                .collection('messages')
                .orderBy('timestamp', 'desc')
                .onSnapshot(snapshot => (
                    setMessages(snapshot.docs.map((doc) => doc.data()))
                ));
        }
    }, [id])

const createChat = () => {
    const roomName = prompt("Please enter name of chat room");

    if (roomName) {
        // do some  database stuff.....
        db.collection('rooms').add({
            name: roomName,
        })
    }
};

return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
        <div className="sidebarChat">
            < Avatar src={`https://avatars.dicebear.com/api/avataaars/${seed}.svg/`} />
            <div className="sidebarChat_info">
                <h2>{name}</h2>
                <p>
                    {messages[0]?.message}
                </p>
            </div>
        </div>
    </Link>
) : (
        <div onClick={createChat} className="sidebarChat">
            <h2>Add New Room</h2>
        </div>
    )
}

export default SidebarChat;
