module.exports = (sequelize, Sequelize,DataTypes) => {

    const Repair = sequelize.define("repair", {
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        },

        //0 - cancelled
        //1 - completed
        //2 - ongoing
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 2

        }
    });

    return Repair;


}
