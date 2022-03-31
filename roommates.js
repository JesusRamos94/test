const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const roommates = async () => {
    try {
        const { data } = await axios.get('https://randomuser.me/api');
        const roommates = data.results[0];
        const datos = {
            id: uuidv4().slice(0, 6),
            nombre:`${roommates.name.first} ${roommates.name.last}`,
            correo: roommates.email,
            debe: 0,
            recibe: 0,
            total: 0
        }
        return datos;
    } catch (e) {
        console.log(e)
    }
}

const guardarRoommates = (roomie) => {
    const roommatesJSON = JSON.parse(fs.readFileSync('roommates.json', 'utf8'))
    roommatesJSON.roommates.push(roomie)
    fs.writeFileSync('roommates.json', JSON.stringify(roommatesJSON));
}


module.exports = { roommates, guardarRoommates }