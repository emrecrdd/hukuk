const { Sequelize } = require('sequelize');
const dbConfig = require("../config/db.config.js");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.PORT,  // Portu da belirtmeyi unutma
  dialectOptions: {
    ssl: dbConfig.dialectOptions.ssl
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  }
});

const db = {};

// Sequelize nesnesini ekliyoruz
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;


// Modelleri içe aktarıyoruz

db.Blog = require("./blog.model.js")(sequelize, Sequelize);
db.Subscriber = require("./subscriber.model.js")(sequelize, Sequelize);
db.Statistics = require("./statistics.model.js")(sequelize, Sequelize); 

module.exports = db;
