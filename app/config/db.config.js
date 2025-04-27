module.exports = {
  HOST: "tramway.proxy.rlwy.net", // Railway'deki veritabanı hostname
  USER: "postgres",  // Railway'deki veritabanı kullanıcı adı
  PASSWORD: "gpQJVYfXgJbhqVugzVuKuyVgBswvZmxZ", // Railway'deki veritabanı şifresi
  DB: "railway", // Railway'deki veritabanı adı
  dialect: "postgres", // PostgreSQL kullanıyoruz
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
