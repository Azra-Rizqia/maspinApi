const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: [true, 'Masukan nama anda'],
        unique: true
    },
    nik: {
        type: String,
        required: false,
        unique: true,
        match: [/^.{16}$/, 'Silahkan isi nik valid!'],
        default: null,
    },
    noHP: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{9,13}$/, 'Silahkan isi nomer hp valid!']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Silahkan isi email valid!']
    },
    password: {
        type: String,
        required: [true, 'Masukan password'],
    },
    ktp: {
        type: String,
        required: [false, 'Isi foto ktp anda'],
        default: null,
    },
    statusValidate: {
        type: Boolean,
        required: false,
        default: false
    }
},
    {
        timestamps: true,
    })

module.exports = mongoose.model('users', UserSchema)