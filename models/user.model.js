module.exports = (sequelize, Sequelize,DataTypes) => {

    const user = sequelize.define("user", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        },
        address: {
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
        telephone: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            unique: true

        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""

        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1

        },
        fcm: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""

        } ,
        //11 super user
        //1 for admin
        //0 for normal user
        userType: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0

        }
    });


    return user;



}
