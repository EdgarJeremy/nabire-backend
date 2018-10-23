/**
* File : ./models/Sale.js
* Tanggal Dibuat : 2018-10-23 18:29:29
* Penulis : LabPC2
*/

export default (sequelize, DataTypes) => {

    const Sale = sequelize.define("sale", {
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
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
            underscored: true
        });

    Sale.associate = (models) => {
        const { Item, User } = models;
        Sale.belongsTo(User, { onDelete: 'cascade' });
        Sale.belongsTo(Item, { onDelete: 'cascade' });
    }

    return Sale;

}