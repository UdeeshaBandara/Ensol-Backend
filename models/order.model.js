module.exports = (sequelize, Sequelize, DataTypes) => {

    const order = sequelize.define("order", {
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0.0
        },
         // 0 - Cancelled
         // 1 - Completed
         // 2 - ongoing
         // 3 - pending
        orderStatus: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 3

        },
        orderDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW


        }

    });

    return order;


}
