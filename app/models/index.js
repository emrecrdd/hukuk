const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

// Sequelize nesnesini ekliyoruz
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modelleri içe aktarıyoruz

db.Category = require("./category.model.js")(sequelize, Sequelize);
db.Blog = require("./blog.model.js")(sequelize, Sequelize);
db.Subscriber = require("./subscriber.model.js")(sequelize, Sequelize);
db.Statistics = require("./statistics.model.js")(sequelize, Sequelize); // Statistics modelini ekledik



// İlişkileri tanımlıyoruz
db.Category.hasMany(db.Blog, {
  foreignKey: "categoryId",
  as: "blogs",
});

db.Blog.belongsTo(db.Category, {
  foreignKey: "categoryId",
  as: "category",
});

// İlişkileri çağırıyoruz
module.exports = db;
