/**
* File : ./models/Purchase.js
* Tanggal Dibuat : 2018-10-23 18:29:16
* Penulis : LabPC2
*/

export default (sequelize, DataTypes) => {

    const Purchase = sequelize.define("purchase", {
        invoice_number: {
            type: DataTypes.STRING(191),
            allowNull: false
        },
        quantity: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        price_per_unit: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total_price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        exact_total_price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        transfer: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        difference: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
            underscored: true
        });

    Purchase.associate = (models) => {
        const { Item, User } = models;
        Purchase.belongsTo(User, { onDelete: 'cascade' });
        Purchase.belongsTo(Item, { onDelete: 'cascade' });
    }

    return Purchase;

}