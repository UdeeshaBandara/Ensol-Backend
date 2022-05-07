module.exports = (sequelize, Sequelize,DataTypes) => {



    const OrderMachines = sequelize.define('OrderMachines', {
        machineId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'machine', // 'Movies' would also work
                key: 'id'
            }
        },
        orderId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'order', // 'Actors' would also work
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""

        },
        contractEndDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW


        },
        qty: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0

        },

    });
    return OrderMachines;

}
