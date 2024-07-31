import { useEffect, useState } from 'react';
import socket from './socket'; // Import the socket instance

const Lobby = () => {
    const [room, setRoom] = useState('testroom');
    const [lobbies, setLobbies] = useState([]);

    const handleJoinLobby = () => {
        socket.emit('joinlobby', { room: room, socketId: socket.id }); // Send socket ID
    }
    useEffect(() => {
        socket.emit('lobbies', () => {
        });

        // Listen for lobby updates
        const handleLobbyUpdate = (data) => {
            setLobbies(data); // Update lobbies with new data
        };

        socket.on('lobbies', handleLobbyUpdate);

        // Cleanup on unmount
        return () => {
            socket.off('lobbies', handleLobbyUpdate); // Remove the listener
        };
    }, []); // Ensure this runs only once on mount

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mt-20">Join Lobby</h1>
            <input className="text-white bg-gray-800 px-4 py-2 rounded-md" type="text" value={room} onChange={(e) => setRoom(e.target.value)} />
            <button className="text-white bg-blue-500 px-4 py-2 rounded-md" onClick={handleJoinLobby}>Join</button>
            {/* get list of current emitted lobbies */}
            <h1 className="text-2xl font-bold text-white mt-20">Lobbies</h1>
            {Object.values(lobbies).map((lobby) => {
                console.log('Lobby:', lobby);
                return (
                    <div className='text-white bg-gray-800 px-4 py-2 rounded-md' key={lobby.id}>
                        {lobby.id} - Users: {lobby.users.join(', ')}
                    </div>
                )
            })}
        </div >
    )
}

export default Lobby;
