const { DB_USER, DB_PASS, DB_HOST, DB_NAME, DB_PORT, SSL_MODE } = process.env;

module.exports = {
  dialect: "postgres",
  protocol: "postgres",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  dialectOptions: {
    ssl: {
      require: SSL_MODE === "require", // SSL bağlantısı
      rejectUnauthorized: false // Kendinden imzalı sertifikaları kabul et
    }
  }
};
