/**
* File : ./routes/users.js 
* Tanggal Dibuat : 10/12/2018, 2:36:02 PM
* Penulis : edgarjeremy
*/

import { a } from '../middlewares/wrapper/request_wrapper';
import { requiredPost, requiredGet } from '../middlewares/validator/request_fields';
import { onlyAuth } from '../middlewares/validator/auth';
import { parser } from '../middlewares/query/parser';

import bcrypt from 'bcrypt';

function users(app, models, socketListener, t) {
    let router = app.get("express").Router();

    /**
    * Daftar User
    */
    router.get('/', parser('User'), a(async (req, res) => {
        // Ambil model
        const { User } = models;

        // Data User
        let data = await User.findAndCountAll({
            distinct: true,
            attributes: req.parsed.attributes,
            where: { ...req.parsed.filter },
            order: req.parsed.order,
            limit: req.parsed.limit,
            offset: req.parsed.offset,
            include: []
        });

        // Response
        res.setStatus(res.OK);
        res.setData(data);
        res.go();
    }));

    /**
     * Satu User
     */
    router.get('/:id', parser('User'), a(async (req, res) => {
        // Ambil model
        const { User } = models;

        // Variabel
        let { id } = req.params;

        // Data User
        let data = await User.findOne({
            attributes: req.parsed.attributes,
            where: { id },
            include: []
        });

        if (data) {
            // Response
            res.setStatus(res.OK);
            res.setData(data);
            res.go();
        } else {
            // Gagal
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('User tidak ditemukan');
            res.go();
        }
    }));

    /**
     * Buat User
     */
    router.post('/', requiredPost(["name", "username", "password", "type", "avatar", "active", "last_login"]), a(async (req, res) => {
        // Ambil model
        const { User } = models;

        // Variabel
        let { name, username, password, type, avatar, active, last_login } = req.body;

        // Buat User
        let data = await User.create({ name, username, password, type, avatar, active, last_login });

        // Response
        res.setStatus(res.OK);
        res.setData(data);
        res.go();
    }));

    /**
     * Update User
     */
    router.put('/:id', requiredPost(["name", "username", "password", "avatar"]), a(async (req, res) => {
        // Ambil model
        const { User } = models;

        // Variabel
        let { id } = req.params;
        let { name, username, password, avatar } = req.body;

        // Ambil User
        let data = await User.findOne({ where: { id } });

        if (data) {
            let d = { name, username, avatar };
            if(password) {
                d.password = bcrypt.hashSync(password, 10);
            }
            // Update User
            data = await data.update(d);
            // Response
            res.setStatus(res.OK);
            res.setData(data);
            res.go();
        } else {
            // Gagal
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('User tidak ditemukan');
            res.go();
        }
    }));

    /**
     * Hapus User
     */
    router.delete('/:id', a(async (req, res) => {
        // Ambil model
        const { User } = models;

        // Variabel
        let { id } = req.params;

        // Ambil User
        let data = await User.findOne({ where: { id } });

        if (data) {
            // Hapus User
            data.destroy();
            // Response
            res.setStatus(res.OK);
            res.setData(data);
            res.go();
        } else {
            // Gagal
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('User tidak ditemukan');
            res.go();
        }
    }));

    return router;
}

module.exports = users;