/**
* File : ./routes/types.js 
* Tanggal Dibuat : 2018-10-23 22:44:41
* Penulis : LabPC2
*/

import { a } from '../middlewares/wrapper/request_wrapper';
import { requiredPost, requiredGet } from '../middlewares/validator/request_fields';
import { onlyAuth } from '../middlewares/validator/auth';
import { parser } from '../middlewares/query/parser';

function types(app, models, socketListener) {
    let router = app.get("express").Router();

    /**
    * Daftar Type
    */
    router.get('/', parser('Type'), a(async (req, res) => {
        // Ambil model
        const { Type, Account } = models;

        // Data Type
        let data = await Type.findAndCountAll({
            distinct: true,
            attributes: req.parsed.attributes,
            where: { ...req.parsed.filter },
            order: req.parsed.order,
            limit: req.parsed.limit,
            offset: req.parsed.offset,
            include: [{
                    model: Account
                }]
        });

        // Response
        res.setStatus(res.OK);
        res.setData(data);
        res.go();
    }));

    /**
     * Satu Type
     */
    router.get('/:id', parser('Type'), a(async (req, res) => {
        // Ambil model
        const { Type, Account } = models;

        // Variabel
        let { id } = req.params;

        // Data Type
        let data = await Type.findOne({
            attributes: req.parsed.attributes,
            where: { id }, 
            include: [{
                    model: Account
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
            res.setMessage('Type tidak ditemukan');
            res.go();
        }
    }));

    /**
     * Buat Type
     */
    router.post('/', requiredPost(["name"]), a(async (req, res) => {
        // Ambil model
        const { Type } = models;

        // Variabel
        let { name } = req.body;

        // Buat Type
        let data = await Type.create({ name });

        // Response
        res.setStatus(res.OK);
        res.setData(data);
        res.go();
    }));

    /**
     * Update Type
     */
    router.put('/:id', requiredPost(["name"]), a(async (req, res) => {
        // Ambil model
        const { Type } = models;

        // Variabel
        let { id } = req.params;
        let { name } = req.body;

        // Ambil Type
        let data = await Type.findOne({ where: { id } });

        if (data) {
            // Update Type
            data = await data.update({ name });
            // Response
            res.setStatus(res.OK);
            res.setData(data);
            res.go();
        } else {
            // Gagal
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Type tidak ditemukan');
            res.go();
        }
    }));

    /**
     * Hapus Type
     */
    router.delete('/:id', a(async (req, res) => {
        // Ambil model
        const { Type } = models;

        // Variabel
        let { id } = req.params;

        // Ambil Type
        let data = await Type.findOne({ where: { id } });

        if (data) {
            // Hapus Type
            data.destroy();
            // Response
            res.setStatus(res.OK);
            res.setData(data);
            res.go();
        } else {
            // Gagal
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Type tidak ditemukan');
            res.go();
        }
    }));

    return router;
}

module.exports = types;