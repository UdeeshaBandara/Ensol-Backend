module.exports = (sequelize, Sequelize,DataTypes) => {

    const User = sequelize.define("users", {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""

        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
            unique: true,
            isEmail: true,

        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""

        },
        fcm: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""

        }
    });

    return User;


}
