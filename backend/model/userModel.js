const mongoose = require('mongoose');

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name: {
        required: [true, 'name is required'],
        type: String
    },
    email: {
        required: [true, 'name is required'],
        type: String,
        unique: [true, 'user email must unique'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    password: {
        required: [true, 'name is required'],
        type: String,
        select: false,
        minlength: 6
    },
    isAdmin: {
        required: [true, 'name is required'],
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/amosmoyo/image/upload/v1642018657/cld-sample.jpg"
    }
}, 
{
    timestamps: true
});

// userSchema.pre('save', async function(next){
//     if(!this.isModified('password')) {
//      next()
//     }

//     const salt = await bcrypt.genSalt(10);

//     this.password = await bcrypt.hash(this.password, salt);
// })

userSchema.methods.getJWT = function() {
    return jwt.sign({id:this._id}, process.env.JWT_SECRETE, {expiresIn: process.env.JWT_EXPIRE})
}

// is password matching
userSchema.methods.comparePasswords = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', userSchema);