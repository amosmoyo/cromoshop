const bcrypt = require('bcryptjs');

const users = [
    {
        name:"Amos Moyo",
        email: "amosmoyo5300@gmail.com",
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true,
    },
    {
        name:"Monica Amaya",
        email: "monicaamaya@gmail.com",
        password: bcrypt.hashSync('123456', 10)
    },
    {
        name:"John Doe",
        email: "johndoe@gmail.com",
        password: bcrypt.hashSync('123456', 10)
    }
]

module.exports = users;