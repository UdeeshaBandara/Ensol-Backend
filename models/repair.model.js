module.exports = (sequelize, Sequelize,DataTypes) => {

    const Repair = sequelize.define("repair", {
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1

        }
    });

    return Repair;


}
