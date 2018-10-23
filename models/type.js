/**
* File : ./models/Type.js
* Tanggal Dibuat : 2018-10-23 18:14:54
* Penulis : LabPC2
*/

export default (sequelize, DataTypes) => {

    const Type = sequelize.define("type", {
        name: {
            type: DataTypes.STRING(191),
            allowNull: false
        }
    }, {
            underscored: true
        });

    Type.associate = (models) => {
        const { Account } = models;
        Type.hasMany(Account, { onDelete: 'cascade' });
    }

    return Type;

}