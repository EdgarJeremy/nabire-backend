/**
* File : ./models/Account.js
* Tanggal Dibuat : 2018-10-23 17:55:00
* Penulis : LabPC2
*/

export default (sequelize, DataTypes) => {

    const Account = sequelize.define("account", {
        name: {
            type: DataTypes.STRING(191),
            allowNull: false
        },
        number: {
            type: DataTypes.STRING(191),
            allowNull: false
        }
    }, {
            underscored: true
        });

    Account.associate = (models) => {
        const { Type } = models;
        Account.belongsTo(Type, { onDelete: 'cascade' });
    }

    return Account;

}