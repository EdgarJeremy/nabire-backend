export default (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        name: {
            type: DataTypes.STRING(191),
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(191),
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(191),
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM(['administrator', 'user']),
            allowNull: false
        },
        avatar: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        last_login: {
            type: DataTypes.DATE,
            defaultValue: null
        }
    }, {
        underscored: true
    });

    User.associate = (models) => {
        const { Token } = models;
        User.hasMany(Token, { onDelete: 'cascade' });
    }

    return User;
}