/**
* File : ./routes/units.js 
* Tanggal Dibuat : 2018-10-23 21:43:16
* Penulis : LabPC2
*/

import { a } from '../middlewares/wrapper/request_wrapper';
import { requiredPost, requiredGet } from '../middlewares/validator/request_fields';
import { onlyAuth } from '../middlewares/validator/auth';
import { parser } from '../middlewares/query/parser';

function units(app, models, socketListener) {
    let router = app.get("express").Router();

    /**
    * Daftar Unit
    */
    router.get('/', parser('Unit'), a(async (req, res) => {
        // Ambil model
        const { Unit } = models;

        // Data Unit
        let data = await Unit.findAndCountAll({
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
     * Satu Unit
     */
    router.get('/:id', parser('Unit'), a(async (req, res) => {
        // Ambil model
        const { Unit } = models;

        // Variabel
        let { id } = req.params;

        // Data Unit
        let data = await Unit.findOne({
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
            res.setMessage('Unit tidak ditemukan');
            res.go();
        }
    }));

    /**
     * Buat Unit
     */
    router.post('/', requiredPost(["name"]), a(async (req, res) => {
        // Ambil model
        const { Unit } = models;

        // Variabel
        let { name } = req.body;

        // Buat Unit
        let data = await Unit.create({ name });

        // Response
        res.setStatus(res.OK);
        res.setData(data);
        res.go();
    }));

    /**
     * Update Unit
     */
    router.put('/:id', requiredPost(["name"]), a(async (req, res) => {
        // Ambil model
        const { Unit } = models;

        // Variabel
        let { id } = req.params;
        let { name } = req.body;

        // Ambil Unit
        let data = await Unit.findOne({ where: { id } });

        if (data) {
            // Update Unit
            data = await data.update({ name });
            // Response
            res.setStatus(res.OK);
            res.setData(data);
            res.go();
        } else {
            // Gagal
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Unit tidak ditemukan');
            res.go();
        }
    }));

    /**
     * Hapus Unit
     */
    router.delete('/:id', a(async (req, res) => {
        // Ambil model
        const { Unit } = models;

        // Variabel
        let { id } = req.params;

        // Ambil Unit
        let data = await Unit.findOne({ where: { id } });

        if (data) {
            // Hapus Unit
            data.destroy();
            // Response
            res.setStatus(res.OK);
            res.setData(data);
            res.go();
        } else {
            // Gagal
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Unit tidak ditemukan');
            res.go();
        }
    }));

    return router;
}

module.exports = units;