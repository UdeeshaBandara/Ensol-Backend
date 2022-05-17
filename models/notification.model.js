module.exports = (sequelize, Sequelize, DataTypes) => {

    const Notification = sequelize.define("notification", {
        content: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        },
    });

    return Notification;


}
