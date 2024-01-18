const PajakKendaraan = require('../models/pajakModel');

const pajakController = {
    tambahPajakKendaraan: async (req, res) => {
        try {
            const currentDate = new Date();
            const isoDateString = currentDate.toISOString();
            req.body.informasiKendaraan.masa_berlaku_pajak = isoDateString;
            req.body.riwayatPokok.tanggal_bayarKKB = isoDateString;
    
            const pajakKendaraan = new PajakKendaraan(req.body);
            await pajakKendaraan.save();
    
            res.status(201).json({ success: true, data: pajakKendaraan, message: 'Data pajak kendaraan berhasil ditambahkan' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Gagal menambahkan data pajak kendaraan', error: error.message });
        }
    },

    detailPajakKendaraan: async (req, res) => {
        try {
            const dataPajak = await PajakKendaraan.findOne({ 'informasiKendaraan.no_polisi': req.params.no_polisi });

            if (!dataPajak) {
                return res.status(404).json({ success: false, message: 'Data pajak kendaraan tidak ditemukan' });
            }

            const dateObject = new Date(dataPajak.informasiKendaraan.masa_berlaku_pajak);
            const formattedDate = dateObject.toISOString().split('T')[0];
            dataPajak.informasiKendaraan.masa_berlaku_pajak = formattedDate;

            res.status(200).json({
                success: true,
                data: dataPajak,
                message: 'Data pajak ditemukan',
                status: 200
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Gagal mendapatkan data pajak kendaraan', error: error.message });
        }
    },

    updatePajakKendaraan: async (req, res) => {
        try {
            await PajakKendaraan.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Data pajak kendaraan berhasil diperbarui' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Gagal memperbarui data pajak kendaraan', error: error.message });
        }
    },

    deletePajakKendaraan: async (req, res) => {
        try {
            await PajakKendaraan.findByIdAndRemove(req.params.id);
            res.status(200).json({ success: true, message: 'Data pajak kendaraan berhasil dihapus' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Gagal menghapus data pajak kendaraan', error: error.message });
        }
    }
};

module.exports = pajakController;