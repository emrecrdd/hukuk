module.exports = {
  HOST: process.env.DB_HOST,       // Veritabanı host adresi
  USER: process.env.DB_USER,       // Veritabanı kullanıcı adı
  PASSWORD: process.env.DB_PASS,   // Veritabanı şifresi
  DB: process.env.DB_NAME,         // Veritabanı adı
  PORT: process.env.DB_PORT || 5432, // PostgreSQL varsayılan portu
  dialect: "postgres",             // Veritabanı türü
  dialectOptions: {
    ssl: {
      require: true, // SSL bağlantısını zorunlu hale getiriyoruz
      rejectUnauthorized: false // Kendinden imzalı sertifikalar için false yapıyoruz
    }
  },
  pool: {
    max: 5,                        // Maksimum bağlantı sayısı
    min: 0,                        // Minimum bağlantı sayısı
    acquire: 30000,                // Bağlantı almak için bekleme süresi (ms)
    idle: 10000                    // Bağlantı boşta kalma süresi (ms)
  }
};
