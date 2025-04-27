module.exports = (sequelize, Sequelize) => {
  const Blog = sequelize.define("blog", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    img: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    publishedDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });

  // Blog ile Category arasında ilişki kurma
  Blog.associate = (models) => {
    Blog.belongsTo(models.Category, {  // category ile ilişki kuruyoruz
      foreignKey: "categoryId",
      as: "category", // kategoriye "category" adıyla erişebileceğiz
    });
  };

  return Blog;
};
