const User = require('../models/userModel');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const fs = require('fs');
const AWS = require('../config/aws-config');

const registerUser = asyncHandler(async (req, res) => {
    const { nama, nik, noHP, email, password, confirmPassword, ktp, statusValidate } = req.body

    if (!noHP) {
        res.status(400);
        throw new Error('NoHP tidak boleh kosong');
    } else if (!/^\d+$/.test(noHP)) {
        res.status(400);
        throw new Error('Nomor HP hanya boleh di isi dengan angka');
    } else if (noHP.length < 9) {
        res.status(400);
        throw new Error('Silahkan isi nomor HP dengan benar minimal 9');
    } else if (noHP.length > 13) {
        res.status(400);
        throw new Error('Silahkan isi nomor HP dengan benar maksimal 13 angka');
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User akun sudah terserdia')
    }

    if (!nama) {
        res.status(400);
        throw new Error('Nama tidak boleh kosong');
    }

    if (!email) {
        res.status(400);
        throw new Error('Email tidak boleh kosong');
    } else if (!/^\d+$/.test(noHP)) {
        res.status(400);
        throw new Error('Email harus valid');
    }

    if (!password) {
        res.status(400);
        throw new Error('Password tidak boleh kosong');
    }

    if (password !== confirmPassword) {
        res.status(400);
        throw new Error('Password tidak sesuai');
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        nama,
        nik,
        noHP,
        email,
        password: hashedPassword,
        ktp,
        statusValidate
    })
    if (user) {
        res.status(201).json({
            success: true,
            data: {
                _id: user.id,
                nama: user.nama,
                noHP: user.noHP,
                email: user.email,
                token: generateAccessToken(user._id),
            },
            message: "Registrasi berhasil",
            status: 201,
        })
    } else {
        res.status(500)
        throw new Error('Internal server error')
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
        res.status(400);
        throw new Error('Email tidak valid');
    }

    if (user && (await bcrypt.compare(password, user.password))) {
        return res.status(200).json({
            success: true,
            data: {
                accessToken: generateAccessToken(user._id),
                refreshToken: generateRefreshToken(user._id)
            },
            message: "Login berhasil",
            status: 200,
        });
    } else {
        res.status(400)
        throw new Error('Password tidak valid')
    }
})

const getUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            _id: req.user.id,
            nama: req.user.nama,
            nik: req.user.nik,
            noHP: req.user.noHP,
            email: req.user.email,
            ktp: req.user.ktp,
            statusValidate: req.user.statusValidate,
        },
        message: "Get user success",
        status: 200
    })
})

const uploadToS3 = async (filePath, key) => {
    const fileData = fs.readFileSync(filePath);

    const s3 = new AWS.S3(); // Membuat instance baru S3

    const params = {
        Bucket: process.env.CYCLIC_BUCKET_NAME,
        Key: key,
        Body: fileData,
        ContentType: 'image/jpeg'
    };

    return s3.upload(params).promise();
};

const validateAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const { nik } = req.body;
        const ktpFileName = req.file ? req.file.filename : null;

        if (!nik || !ktpFileName) {
            return res.status(400).json({
                success: false,
                message: 'Mohon masukkan nik dan unggah foto KTP'
            });
        }

        const existingUser = await User.findOne({ nik });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'NIK sudah terdaftar'
            });
        }

        // Upload ke S3
        const s3Key = `ktp/${ktpFileName}`;
        await uploadToS3(req.file.path, s3Key);

        // Update user dengan URL S3
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                nik,
                ktp: `${process.env.CYCLIC_URL}/${s3Key}`,
                statusValidate: true
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'Pengguna tidak ditemukan'
            });
        }

        // Hapus file lokal setelah diupload ke S3
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            success: true,
            data: {
                _id: updatedUser.id,
                nama: updatedUser.nama,
                nik: updatedUser.nik,
                noHP: updatedUser.noHP,
                email: updatedUser.email,
                fotoKtp: updatedUser.ktp,
                statusValidate: updatedUser.statusValidate,
            },
            message: 'Validasi akun berhasil',
            status: 200
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// const validateAccount = async (req, res) => {
//     let updatedUser;

//     try {
//         const userId = req.user.id;
//         const { nik } = req.body;
//         const ktpFileName = req.file ? req.file.filename : null;

//         if (!nik || !ktpFileName) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Mohon masukkan nik dan unggah foto KTP'
//             });
//         }

//         const existingUser = await User.findOne({ nik });

//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'NIK sudah terdaftar'
//             });
//         }

//         updatedUser = await User.findByIdAndUpdate(
//             userId,
//             {
//                 nik,
//                 ktp: `${process.env.CYCLIC_URL}/ktp/${ktpFileName}`,
//                 statusValidate: true
//             },
//             { new: true }
//         );

//         if (!updatedUser) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Pengguna tidak ditemukan'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: {
//                 _id: updatedUser.id,
//                 nama: updatedUser.nama,
//                 nik: updatedUser.nik,
//                 noHP: updatedUser.noHP,
//                 email: updatedUser.email,
//                 fotoKtp: updatedUser.ktp,
//                 statusValidate: updatedUser.statusValidate,
//             },
//             message: 'Validasi akun berhasil',
//             status: 200
//         });
//     } catch (error) {
//         console.error(error);

//         if (!updatedUser) {
//             return res.status(500).json({
//                 success: false,
//                 message: 'Internal server error'
//             });
//         }
//     }
// };

const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    })
}

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    getUser,
    validateAccount
}