module.exports = (sequelize, Sequelize,DataTypes) => {

    const order = sequelize.define("order", {
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0.0
        },
        orderStatus: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1

        },
      orderDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW


        }

    });

    return order;


}
