const users = [];

const addUsers = ({id,username,room}) => {
    username = username.toLowerCase().trim();
    room = room.trim().toLowerCase();

    if(!username || !room){
        return {
            error: 'Username and Room is required'
        }
    }
    const existingUser = users.find((user) => {
        return user.username === username && user.room === room;
    })

    if(existingUser){
        return{
            errors: 'This Username already exists'
        }
    }

    const user = {id,username,room};
    users.push(user);
    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    if(index !== -1){
        return users.splice(index,1)[0];
    }
}

const getUser = (id) => {
    return users.find((user) => {
        return user.id === id;
    })
}

const getUserInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter((user) => {
        return user.room === room
    })
}

module.exports= {
    addUsers,
    removeUser,
    getUser,
    getUserInRoom
}

