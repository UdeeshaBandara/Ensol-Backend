module.exports = (sequelize, Sequelize,DataTypes) => {



    const OrderMachines = sequelize.define('OrderMachines', {
        machineId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'machine',
                key: 'id'
            }
        },
        orderId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'order',
                key: 'id'
            }
        },

        contractStartDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW


        },
        contractEndDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW


        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1

        },

    });
    return OrderMachines;

}
