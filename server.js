const express = require("express");
const cors = require("cors");



const app = express();



var corsOptions = {
  origin: ["http://localhost:3000"], // Birden fazla kaynağa izin ver
  credentials: true // Çerez ve kimlik doğrulama bilgilerini aktarmak için
};
app.use(cors(corsOptions));


// application/json içerik türü ile gelen istekleri ayrıştır
app.use(express.json());

// application/x-www-form-urlencoded içerik türü ile gelen istekleri ayrıştır
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.sequelize.sync()
  .then(() => {
    console.log("Veritabanı senkronize edildi.");
  })
  .catch((err) => {
    console.log("Veritabanı senkronizasyonu başarısız oldu: " + err.message);
  });

// // Eğer tablo zaten varsa, onu silip yeniden oluştur
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Tablo silindi ve yeniden senkronize edildi.");
// });

// basit bir rota
app.get("/", (req, res) => {
  res.json({ message: "Bezkoder uygulamasına hoş geldiniz." });
});
/* const chatRoutes = require("./app/routes/chat.routes");  
app.use("/", chatRoutes);  */


require("./app/routes/category.routes")(app);
require("./app/routes/blog.routes")(app);
require("./app/routes/subscriber.routes")(app);
require("./app/routes/statistics.routes")(app);










db.sequelize.sync({ alter: true })  // Mevcut tabloları değiştirecek şekilde senkronize eder.
  .then(() => {
    console.log("Veritabanı senkronize edildi.");
  })
  .catch((err) => {
    console.log("Veritabanı senkronizasyonu başarısız oldu: " + err.message);
  });


// portu ayarla ve istekleri dinle
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});

