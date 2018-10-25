/**
* File : ./routes/sales.js 
* Tanggal Dibuat : 2018-10-23 22:44:30
* Penulis : LabPC2
*/

import { a } from '../middlewares/wrapper/request_wrapper';
import { requiredPost, requiredGet } from '../middlewares/validator/request_fields';
import { onlyAuth } from '../middlewares/validator/auth';
import { parser } from '../middlewares/query/parser';

function sales(app, models, socketListener) {
    let router = app.get("express").Router();

    /**
    * Daftar Sale
    */
    router.get('/', parser('Sale'), a(async (req, res) => {
        // Ambil model
        const { Sale, User, Item } = models;

        // Data Sale
        let data = await Sale.findAndCountAll({
            distinct: true,
            attributes: req.parsed.attributes,
            where: { ...req.parsed.filter },
            order: req.parsed.order,
            limit: req.parsed.limit,
            offset: req.parsed.offset,
            include: [{
                model: User
            }, {
                model: Item
            }]
        });

        // Response
        res.setStatus(res.OK);
        res.setData(data);
        res.go();
    }));

    /**
     * Satu Sale
     */
    router.get('/:id', parser('Sale'), a(async (req, res) => {
        // Ambil model
        const { Sale, User, Item } = models;

        // Variabel
        let { id } = req.params;

        // Data Sale
        let data = await Sale.findOne({
            attributes: req.parsed.attributes,
            where: { id },
            include: [{
                model: User
            }, {
                model: Item
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
            res.setMessage('Sale tidak ditemukan');
            res.go();
        }
    }));

    /**
     * Buat Sale
     */
    router.post('/', requiredPost(["quantity", "item_id"]), a(async (req, res) => {
        // Ambil model
        const { Sale, Item } = models;

        // Variabel
        let { quantity, item_id, description } = req.body;

        let item = await Item.findOne({ where: { id: item_id } });

        if (item) {
            if (item.quantity - quantity >= 0) {
                let price_per_unit = item.price;
                let exact_total_price = item.price * quantity;
                let total_price = Math.ceil(exact_total_price);

                // Buat Sale
                let data = await Sale.create({ quantity, item_id, description, price_per_unit, total_price, exact_total_price });
                // Kurangi
                item.quantity = item.quantity - quantity;
                item.save();
                // Response
                res.setStatus(res.OK);
                res.setData(data);
                res.go();
            } else {
                // Gagal
                res.status(400);
                res.setStatus(res.GAGAL);
                res.setMessage('Quantity melebihi kuota item');
                res.go();
            }
        } else {
            // Gagal
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Item tidak ditemukan');
            res.go();
        }

    }));

    /**
     * Update Sale
     */
    router.put('/:id', requiredPost(["quantity", "price_per_unit", "total_price", "exact_total_price"]), a(async (req, res) => {
        // Ambil model
        const { Sale } = models;

        // Variabel
        let { id } = req.params;
        let { quantity, price_per_unit, total_price, exact_total_price, description } = req.body;

        // Ambil Sale
        let data = await Sale.findOne({ where: { id } });

        if (data) {
            // Update Sale
            data = await data.update({ quantity, price_per_unit, total_price, exact_total_price, description });
            // Response
            res.setStatus(res.OK);
            res.setData(data);
            res.go();
        } else {
            // Gagal
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Sale tidak ditemukan');
            res.go();
        }
    }));

    /**
     * Hapus Sale
     */
    router.delete('/:id', a(async (req, res) => {
        // Ambil model
        const { Sale } = models;

        // Variabel
        let { id } = req.params;

        // Ambil Sale
        let data = await Sale.findOne({ where: { id } });

        if (data) {
            // Hapus Sale
            data.destroy();
            // Response
            res.setStatus(res.OK);
            res.setData(data);
            res.go();
        } else {
            // Gagal
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Sale tidak ditemukan');
            res.go();
        }
    }));

    return router;
}

module.exports = sales;