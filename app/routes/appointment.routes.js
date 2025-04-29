module.exports = app => {
    const appointments = require("../controllers/appointment.controller.js");
  
    var router = require("express").Router();
  
    // Yeni bir randevu oluştur
    router.post("/", appointments.create);
  
    // Tüm randevuları getir
    router.get("/", appointments.findAll);
  
    // Belirtilen ID'ye sahip randevuyu getir
    router.get("/:id", appointments.findOne);
  
    // Belirtilen ID'ye sahip randevuyu güncelle (status güncelleme)
    router.put("/:id", appointments.update);
  
    // Belirtilen ID'ye sahip randevuyu sil
    router.delete("/:id", appointments.delete);
  
    // Tüm randevuları sil
    router.delete("/", appointments.deleteAll);
  
    app.use("/api/appointments", router);
  };
  
