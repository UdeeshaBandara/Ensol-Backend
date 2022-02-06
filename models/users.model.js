module.exports = (sequelize, Sequelize,DataTypes) => {

    class User extends Sequelize.Model {}
    User.init({

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
            defaultValue: ""

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

        },
    }, {
        sequelize,
        modelName: 'User'
    });

}

