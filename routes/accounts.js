/**
* File : ./routes/accounts.js 
* Tanggal Dibuat : 2018-10-23 22:43:56
* Penulis : LabPC2
*/

import { a } from '../middlewares/wrapper/request_wrapper';
import { requiredPost, requiredGet } from '../middlewares/validator/request_fields';
import { onlyAuth } from '../middlewares/validator/auth';
import { parser } from '../middlewares/query/parser';

function accounts(app, models, socketListener) {
    let router = app.get("express").Router();

    /**
    * Daftar Account
    */
    router.get('/', parser('Account'), a(async (req, res) => {
        // Ambil model
        const { Account, Type } = models;

        // Data Account
        let data = await Account.findAndCountAll({
            distinct: true,
            attributes: req.parsed.attributes,
            where: { ...req.parsed.filter },
            order: req.parsed.order,
            limit: req.parsed.limit,
            offset: req.parsed.offset,
            include: [{
                    model: Type
                }]
        });

        // Response
        res.setStatus(res.OK);
        res.setData(data);
        res.go();
    }));

    /**
     * Satu Account
     */
    router.get('/:id', parser('Account'), a(async (req, res) => {
        // Ambil model
        const { Account, Type } = models;

        // Variabel
        let { id } = req.params;

        // Data Account
        let data = await Account.findOne({
            attributes: req.parsed.attributes,
            where: { id }, 
            include: [{
                    model: Type
                }] 
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
            res.setMessage('Account tidak ditemukan');
            res.go();
        }
    }));

    /**
     * Buat Account
     */
    router.post('/', requiredPost(["name","number", "type_id"]), a(async (req, res) => {
        // Ambil model
        const { Account } = models;

        // Variabel
        let { name, number, type_id } = req.body;

        // Buat Account
        let data = await Account.create({ name, number, type_id });

        // Response
        res.setStatus(res.OK);
        res.setData(data);
        res.go();
    }));

    /**
     * Update Account
     */
    router.put('/:id', requiredPost(["name","number"]), a(async (req, res) => {
        // Ambil model
        const { Account } = models;

        // Variabel
        let { id } = req.params;
        let { name, number } = req.body;

        // Ambil Account
        let data = await Account.findOne({ where: { id } });

        if (data) {
            // Update Account
            data = await data.update({ name, number });
            // Response
            res.setStatus(res.OK);
            res.setData(data);
            res.go();
        } else {
            // Gagal
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Account tidak ditemukan');
            res.go();
        }
    }));

    /**
     * Hapus Account
     */
    router.delete('/:id', a(async (req, res) => {
        // Ambil model
        const { Account } = models;

        // Variabel
        let { id } = req.params;

        // Ambil Account
        let data = await Account.findOne({ where: { id } });

        if (data) {
            // Hapus Account
            data.destroy();
            // Response
            res.setStatus(res.OK);
            res.setData(data);
            res.go();
        } else {
            // Gagal
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Account tidak ditemukan');
            res.go();
        }
    }));

    return router;
}

module.exports = accounts;