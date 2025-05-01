 const express = require("express");
const http = require("http");
const cors = require("cors");
require('dotenv').config();

const app = express();
// HTTP server'ı başlatıyoruz
const server = http.createServer(app);

var corsOptions = {
  origin: ["http://localhost:3000","https://aliardagul-av-tr.netlify.app"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const db = require("./app/models");
db.sequelize.sync({ alter: true }).then(() => {
  console.log("Veritabanı senkronize edildi.");
});
require("./app/routes/blog.routes")(app);
require("./app/routes/subscriber.routes")(app);
require("./app/routes/appointment.routes")(app);
require("./app/routes/statistics.routes")(app);
app.get("/", (req, res) => {
  res.send("hukuk!");
});

// Port ayarı ve sunucu başlatma
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(Sunucu ${PORT} portunda çalışıyor.);
});
