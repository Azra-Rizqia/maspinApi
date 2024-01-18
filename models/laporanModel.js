const mongoose = require('mongoose');

const LaporanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    image_laporan: {
        type: String,
        required: true,
    },
    kategori_masalah: {
        type: String,
        required: true,
    },
    detail_masalah: {
        type: String,
        required: true,
    },
    lokasi: {
        type: String,
        required: true,
        index: 'text',
    },
}, { timestamps: true });

LaporanSchema.index({ lokasi: 'text' });

module.exports = mongoose.model('laporan', LaporanSchema);