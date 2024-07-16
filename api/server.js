const express = require("express");

const accounstRouter = require('./accounts/accounts-router')

const server = express();

server.use(express.json());

server.use('/api/accounts', accounstRouter)

server.use('*', (req, res) => {
    res.status(404).json({
        message: 'Not Found'
    })
})

module.exports = server;
