/**
* File : ./routes/purchases.js 
* Tanggal Dibuat : 2018-10-23 22:44:19
* Penulis : LabPC2
*/

import { a } from '../middlewares/wrapper/request_wrapper';
import { requiredPost, requiredGet } from '../middlewares/validator/request_fields';
import { onlyAuth } from '../middlewares/validator/auth';
import { parser } from '../middlewares/query/parser';

function purchases(app, models, socketListener) {
    let router = app.get("express").Router();

    /**
    * Daftar Purchase
    */
    router.get('/', parser('Purchase'), a(async (req, res) => {
        // Ambil model
        const { Purchase, User, Item } = models;

        // Data Purchase
        let data = await Purchase.findAndCountAll({
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
     * Satu Purchase
     */
    router.get('/:id', parser('Purchase'), a(async (req, res) => {
        // Ambil model
        const { Purchase, User, Item } = models;

        // Variabel
        let { id } = req.params;

        // Data Purchase
        let data = await Purchase.findOne({
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
            res.setMessage('Purchase tidak ditemukan');
            res.go();
        }
    }));

    /**
     * Buat Purchase
     */
    router.post('/', requiredPost(["invoice_number", "quantity", "transfer", "item_id"]), a(async (req, res) => {
        // Ambil model
        const { Purchase, Item } = models;

        // Variabel
        let { invoice_number, quantity, transfer, description, item_id } = req.body;

        let item = await Item.findOne({ where: { id: item_id } });

        if (item) {
            let price_per_unit = item.price;
            let exact_total_price = item.price * quantity;
            let total_price = Math.ceil(exact_total_price);
            let difference = exact_total_price - transfer;

            // Buat Purchase
            let data = await Purchase.create({ invoice_number, quantity, price_per_unit, total_price, exact_total_price, transfer, difference, description, item_id });
            // Tambahi
            item.quantity = item.quantity + quantity;
            item.save();
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
     * Update Purchase
     */
    router.put('/:id', requiredPost(["invoice_number", "quantity", "price_per_unit", "total_price", "exact_total_price", "transfer", "difference"]), a(async (req, res) => {
        // Ambil model
        const { Purchase } = models;

        // Variabel
        let { id } = req.params;
        let { invoice_number, quantity, price_per_unit, total_price, exact_total_price, transfer, difference, description } = req.body;

        // Ambil Purchase
        let data = await Purchase.findOne({ where: { id } });

        if (data) {
            // Update Purchase
            data = await data.update({ invoice_number, quantity, price_per_unit, total_price, exact_total_price, transfer, difference, description });
            // Response
            res.setStatus(res.OK);
            res.setData(data);
            res.go();
        } else {
            // Gagal
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Purchase tidak ditemukan');
            res.go();
        }
    }));

    /**
     * Hapus Purchase
     */
    router.delete('/:id', a(async (req, res) => {
        // Ambil model
        const { Purchase } = models;

        // Variabel
        let { id } = req.params;

        // Ambil Purchase
        let data = await Purchase.findOne({ where: { id } });

        if (data) {
            // Hapus Purchase
            data.destroy();
            // Response
            res.setStatus(res.OK);
            res.setData(data);
            res.go();
        } else {
            // Gagal
            res.status(404);
            res.setStatus(res.GAGAL);
            res.setMessage('Purchase tidak ditemukan');
            res.go();
        }
    }));

    return router;
}

module.exports = purchases;