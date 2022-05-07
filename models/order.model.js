module.exports = (sequelize, Sequelize,DataTypes) => {

    const order = sequelize.define("order", {
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0.0
        },
        orderStatus: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""

        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW


        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW

        },

    });

    return order;


}
