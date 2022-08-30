// Creates an export for the UUID() used to set notes with ids

module.exports = () => 
    Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);