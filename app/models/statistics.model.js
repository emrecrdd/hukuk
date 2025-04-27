module.exports = (sequelize, DataTypes) => {
    const Statistics = sequelize.define("statistics", {
        totalSubscribers: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        totalEmailsSent: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        totalEmailsOpened: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    });

    return Statistics;
};
