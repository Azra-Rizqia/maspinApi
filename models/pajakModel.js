const mongoose = require('mongoose');

const PajakKendaraanSchema = new mongoose.Schema({
    informasiKendaraan: {
        no_polisi: { type: String, required: true },
        merek_kendaraan: { type: String },
        tipe_kendaraan: { type: String },
        milik_ke: { type: String },
        tahun_pembuatan: { type: String },
        harga_jual: { type: String, default: 'Rp. 0' },
        status_kendaraan: { type: String, default: 'Tidak Diblokir' },
        masa_berlaku_pajak: { type: Date }
    },
    riwayatPokok: {
        besar_kkb: { type: String },
        tanggal_bayarKKB: { type: Date }
    },
    rincianPajak: {
        bnpb_pengesahan: { type: String, default: 'Rp. 0' },
        bnpb_plat: { type: String, default: 'Rp. 0' },
        bnpb_cetakStnk: { type: String, default: 'Rp. 0' },
        bnpb_nopil: { type: String, default: 'Rp. 0' },
        pkb_pokok: { type: String, default: 'Rp. 0' },
        pkb_denda: { type: String, default: 'Rp. 0' },
        swdkllj_pokok: { type: String, default: 'Rp. 0' },
        swdkllj_denda: { type: String, default: 'Rp. 0' },
        total_tagihan: { type: String, default: 'Rp. 0' }
    }
});

module.exports = mongoose.model('pajak', PajakKendaraanSchema)
