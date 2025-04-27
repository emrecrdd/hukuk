module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("category", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
    },
  });

  // Category ile Blog arasında ilişki kurma
  Category.associate = (models) => {
    Category.hasMany(models.Blog, {
      foreignKey: "categoryId",  // Blog'lar Category'ye bağlı olacak
      as: "blogs",  // blogs adıyla ilişkiyi oluşturacağız
    });
  };

  return Category;
};
