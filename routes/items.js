/**
* File : ./routes/items.js 
* Tanggal Dibuat : 2018-10-23 21:02:02
* Penulis : LabPC2
*/

import { a } from '../middlewares/wrapper/request_wrapper';
import { requiredPost, requiredGet } from '../middlewares/validator/request_fields';
import { onlyAuth } from '../middlewares/validator/auth';
import { parser } from '../middlewares/query/parser';

function items(app, models, socketListener) {
    let router = app.get("express").Router();

    /**
    * Daftar Item
    */
    router.get('/', parser('Item'), a(async (req, res) => {
        // Ambil model
        const { Item, Unit } = models;

        // Data Item
        // let data = await Item.findAndCountAll({
        //     distinct: true,
        //     attributes: req.parsed.attributes,
        //     where: { ...req.parsed.filter },
        //     order: req.parsed.order,
        //     limit: req.parsed.limit,
        //     offset: req.parsed.offset,
        //     include: [{ model: Unit }]
        // });

        // Response
        res.setStatus(res.OK);
        res.setData(req.parsed);
        res.go();
    }));

    /**
     * Satu Item
     */
    router.get('/:id', parser('Item'), a(async (req, res) => {
        // Ambil model
        const { Item, Unit } = models;

        // Variabel
        let { id } = req.params;

        // Data Item
        let data = await Item.findOne({
            attributes: req.parsed.attributes,
            where: { id },
            include: [{ model: Unit }]
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
            res.setMessage('Item tidak ditemukan');
            res.go();
        }
    }));

    /**
     * Buat Item
     */
    router.post('/', requiredPost(["name", "price", "unit_id"]), a(async (req, res) => {
        // Ambil model
        const { Item } = models;

        // Variabel
        let { name, unit_id, price } = req.body;

        // Buat Item
        let data = await Item.create({ name, unit_id, price, quantity: 0 });

        // Response
        res.setStatus(res.OK);
        res.setData(data);
        res.go();
    }));

    /**
     * Update Item
     */
    router.put('/:id', requiredPost(["name", "unit_id", "price"]), a(async (req, res) => {
        // Ambil model
        const { Item } = models;

        // Variabel
        let { id } = req.params;
        let { name, unit_id, price } = req.body;

        // Ambil Item
        let data = await Item.findOne({ where: { id } });

        if (data) {
            // Update Item
            data = await data.update({ name, unit_id, price });
            // Response
            res.setStatus(res.OK);
            res.setData(data);
            res.go();
        } else {
            // Gagal
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Item tidak ditemukan');
            res.go();
        }
    }));

    /**
     * Hapus Item
     */
    router.delete('/:id', a(async (req, res) => {
        // Ambil model
        const { Item } = models;

        // Variabel
        let { id } = req.params;

        // Ambil Item
        let data = await Item.findOne({ where: { id } });

        if (data) {
            // Hapus Item
            data.destroy();
            // Response
            res.setStatus(res.OK);
            res.setData(data);
            res.go();
        } else {
            // Gagal
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Item tidak ditemukan');
            res.go();
        }
    }));

    return router;
}

module.exports = items;