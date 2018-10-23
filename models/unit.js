/**
* File : ./models/Unit.js
* Tanggal Dibuat : 2018-10-23 21:09:04
* Penulis : LabPC2
*/

export default (sequelize, DataTypes) => {

    const Unit = sequelize.define("unit", {
        name: {
            type: DataTypes.STRING(191),
            allowNull: false
        }
    }, {
            underscored: true
        });

    Unit.associate = (models) => {
        const { Item } = models;
        Unit.hasMany(Item, { onDelete: 'cascade' });
    }

    return Unit;

}