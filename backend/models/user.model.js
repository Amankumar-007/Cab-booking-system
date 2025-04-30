const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secretKey = process.env.JWT_SECRET;

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 20,
        },
        lastname: {
            type: String,
            minlength: 3,
            maxlength: 20,
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,
        minlength: 5,
        maxlength: 50,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024,
        select: false,
    },
    socketid: {
        type: String,
        default: null,
    },
});

userSchema.methods.generateAuthToken = function () {
    if (!secretKey) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    return jwt.sign({ _id: this._id }, secretKey, { expiresIn: '1h' });
};

userSchema.methods.comparePassword = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
}

userSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

const User = mongoose.model('User', userSchema);
module.exports = User;