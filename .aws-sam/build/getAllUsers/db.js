const Sequelize = require('sequelize')
const UserModel = require('./User')
const WorkoutModel = require('./Workout')
const config = require('./config');
var sequelize = new Sequelize(config.DATABASE, {
    timestamps: true,
    dialect: 'mysql'
})
const User = UserModel(sequelize, Sequelize)
const Workout = WorkoutModel(sequelize, Sequelize)
const Models = { User, Workout }
const connection = {}
module.exports = async () => {
    if (connection.isConnected) {
        console.log('=> Using existing connection.')
        return Models
    }
    await sequelize.sync()
    await sequelize.authenticate()
    connection.isConnected = true
    console.log('=> Created a new connection.')
    return Models
}
