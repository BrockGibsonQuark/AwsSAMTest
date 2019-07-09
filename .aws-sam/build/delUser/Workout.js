module.exports = (sequelize, type) => {
    return sequelize.define('workout', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        userID: {
            type: type.INTEGER,
            allowNull: false
        },
        type: {
            type: type.STRING,
            allowNull: false
        },
        source: {
            type: type.STRING,
            allowNull: false
        },
        startTime: {
            type: type.DATE,
            allowNull: false
        },
        endTime: {
            type: type.DATE,
            allowNull: false
        }
    })
}