const User = require('../models/User')

const findUserByEmail = (email) => {
    return User.findOne({email: email, isActive: true})
}

const findUserById = (id) => {
    return User.findById(id)
}

const deleteUserById = (id) => {
    return User.findByIdAndUpdate({ _id: id }, { isActive: false }, { new: true })
}

const editUser = (id, hash, authorBody) => {
    return User.findByIdAndUpdate({ _id: id },{
        firstName: authorBody.firstName,
        lastName: authorBody.lastName,
        email: authorBody.email,
        password: hash
      }, { new: true })
}

module.exports = {
    findUserByEmail,
    findUserById,
    deleteUserById,
    editUser
}