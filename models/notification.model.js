module.exports = (sequelize, Sequelize,DataTypes) => {

    const Notification = sequelize.define("notification", {
        content: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        }  ,
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW


        },
    });

    return Notification;


}
