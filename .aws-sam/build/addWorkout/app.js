'use strict';
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs'); //encrypt passwords and things

var config = require('./config');
const connectToDatabase = require('./db'); // initialize connection
let auth = require('./auth');
// simple Error constructor for handling HTTP error codes
function HTTPError(statusCode, message) {
    const error = new Error(message)
    error.statusCode = statusCode
    return error
}

exports.getAll = async (event, context) => {
    let result = await auth(event.headers.Authorization);
    try {
        if (!result) throw new HTTPError(401, "error verifying auth of user")
        const { User } = await connectToDatabase()
        const users = await User.findAll()
        return {
            statusCode: 200,
            body: JSON.stringify(users)
        }
    } catch (err) {
        return {
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: err.message || 'Could not fetch the users.'
        }
    }
}

exports.getUser = async (event, context) => {
    let result = await auth(event.headers.Authorization);
    try {
        if (!result) throw Error("Error verifying auth of user");
        const { User } = await connectToDatabase()
        const user = await User.findOne({
            where: {
                id: result.id
            }
        });
        return {
            statusCode: 200,
            body: JSON.stringify(user)
        }
    } catch (err) {
        return {
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: err.message || 'Could not fetch the user.'
        }
    }
}

module.exports.addUser = async (event, context) => {
    try {
        let json = JSON.parse(event.body);
        let hashedPassword = bcrypt.hashSync(json.password, 8);
        const { User } = await connectToDatabase()
        const user = await User.create({
            name: json.name,
            email: json.email,
            password: hashedPassword
        })
        let token = jwt.sign({
            id: user.id
        }, config.SECRET, { expiresIn: '24h' });
        return {
            statusCode: 200,
            body: JSON.stringify({
                "token": token
            })
        }
    } catch (err) {
        return {
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Could not create the user.'
        }
    }
}

module.exports.delUser = async (event) => {
    let result = await auth(event.headers.Authorization);
    try {
        if (!result) throw new HTTPError(401, "error verifying auth of user")
        const { User } = await connectToDatabase()
        const user = await User.destroy({
            where: {
                id: result.id
            }
        })
        return {
            statusCode: 200,
            body: JSON.stringify({
                "data": user
            })
        }
    } catch (err) {
        return {
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: err.message || 'Could not delete user'
        }
    }
}

module.exports.updateUser = async (event) => {
    let result = await auth(event.headers.Authorization);
    try {
        if (!result) throw Error("Error verifying auth of user");
        let json = JSON.parse(event.body);
        const { User } = await connectToDatabase()
        const user = await User.findOne({
            where: {
                id: result.id
            }
        });
        if (json.email) user.email = json.email;
        if (json.name) user.email = json.name;
        if (json.password) {
            user.password = bcrypt.hashSync(json.password, 8);
        }
        await user.save();
        if (!user) throw new HTTPError(404, `User with id: ${decoded.id} was not found`)
        return {
            statusCode: 200,
            body: JSON.stringify(user)
        }
    } catch (err) {
        return {
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: err.message || 'Could not update user.'
        }
    }
}

exports.login = async (event, context) => {
    try {
        let input = JSON.parse(event.body)
        const { User } = await connectToDatabase();
        const user = await User.findOne({
            where: {
                email: input.email
            }
        });
        var passwordIsValid = bcrypt.compareSync(input.password, user.password);
        if (!passwordIsValid) throw new HTTPError(401, "invalid username / password")
        let token = jwt.sign({
            id: user.id
        }, config.SECRET, { expiresIn: '24h' });
        return {
            statusCode: 200,
            body: JSON.stringify({
                "auth": true,
                "id": user.id,
                "token": token
            })
        }
    } catch (err) {
        return {
            statusCode: 401,
            body: JSON.stringify({
                "auth": false,
                "message": err.message || 'user could not be logged in',
                "token": null
            })
        }
    }
}

exports.logout = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            "auth": false,
            "message": "user successfully logged out",
            "token": null
        })
    }
}

exports.addWorkout = async (event, context) => {
    let result = await auth(event.headers.Authorization);
    console.log(result);
    try {
        if (!result) throw Error("Error verifying auth of user");
        let json = JSON.parse(event.body);
        
        const { Workout } = await connectToDatabase()
        const workout = await Workout.create({
            userID: result.id,
            type: json.type,
            source: json.source,
            startTime: json.startTime,
            endTime: json.endTime
        })
        return {
            statusCode: 200,
            body: JSON.stringify({
                "workout": workout
            })
        }
    } catch (err) {
        return {
            statusCode: err.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Could not create the workout.'
        }
    }
} 
