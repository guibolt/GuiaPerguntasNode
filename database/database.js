const sequelize = require('sequelize')

const user = 'root'
const password = 'root'

const connection = new sequelize('guiaperguntas', user, password ,{
    host:'localhost',
    dialect:'mysql'
})


module.exports = connection;