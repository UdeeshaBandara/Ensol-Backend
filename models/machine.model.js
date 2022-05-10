module.exports = (sequelize, Sequelize,DataTypes) => {

    const Machine = sequelize.define("machine", {
        serialNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        },
        machineType: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""

        },
        rentPrice: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0.0


        },
        availableQty: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0

        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""

        },
        images: {
            type: Sequelize.TEXT,
            allowNull: false,
            defaultValue: ""

        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1

        }
    });

    return Machine;


}
