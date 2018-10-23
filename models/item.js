/**
* File : ./models/Item.js
* Tanggal Dibuat : 2018-10-23 18:41:24
* Penulis : LabPC2
*/

export default (sequelize, DataTypes) => {

    const Item = sequelize.define("item", {
        name: {
            type: DataTypes.STRING(191),
            allowNull: false
        },
        quantity: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
            underscored: true
        });

    Item.associate = (models) => {
        const { Purchase, Sale, Unit } = models;
        Item.hasMany(Purchase, { onDelete: 'cascade' });
        Item.hasMany(Sale, { onDelete: 'cascade' });
        Item.belongsTo(Unit, { onDelete: 'cascade' });
    }

    return Item;

}