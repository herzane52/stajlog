// models/Ogrenci.js
const mongoose = require('mongoose');

const ogrenciSchema = new mongoose.Schema({
    tc: {
        type: String,
        required: true,// verinin zorunlu olması
       // unique: true,// verinin benzersiz olması
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
       // unique: true,
    },
    tel: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        required: true,
    },
    days: {
        type: Number,
        required: true,
    },
    photo: {
        type: Buffer,
        required: false, // zorunlu değil o yüzden  false
    }
});

const Ogrenci = mongoose.model('Ogrenci', ogrenciSchema);

module.exports = Ogrenci;
