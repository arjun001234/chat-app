const getMessages = (text,username) => {
    return {
        username,
        text,
        time: new Date().getTime()
    }
}

const getLocationMessage = (text,username) => {
    return {
        username,
        text,
        time: new Date().getTime()
    }
}

const getImage = (text,username) => {
    return {
        username,
        text,
        time: new Date().getTime()
    }
}

module.exports={
    getMessages,
    getLocationMessage,
    getImage
}