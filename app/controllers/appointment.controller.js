const db = require("../models");
const Appointment = db.Appointment; // Burada doğru model ismi kullanılıyor.

// Yeni bir randevu oluştur
exports.create = (req, res) => {
  if (!req.body.fullName || !req.body.phone || !req.body.email || !req.body.date || !req.body.time) {
    res.status(400).send({
      message: "Tüm alanları doldurun!"
    });
    return;
  }

  const appointment = {
    fullName: req.body.fullName,
    phone: req.body.phone,
    email: req.body.email,
    date: req.body.date,
    time: req.body.time,
    message: req.body.message || null, // Mesaj opsiyonel
    status: req.body.status || "pending" // Varsayılan olarak "pending" durumu
  };

  Appointment.create(appointment)
    .then(data => {
      res.status(201).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Randevu oluşturulurken bir hata oluştu."
      });
    });
};

// Tüm randevuları getir
exports.findAll = (req, res) => {
  Appointment.findAll()
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Randevular getirilirken bir hata oluştu."
      });
    });
};

// ID'ye göre randevu getir
exports.findOne = (req, res) => {
  const id = req.params.id;

  Appointment.findByPk(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Randevu bulunamadı, ID: ${id}`
        });
      } else {
        res.status(200).send(data);
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `ID: ${id} ile randevu getirilirken bir hata oluştu.`
      });
    });
};

// ID'ye göre randevu güncelle (status değiştirme)
exports.update = (req, res) => {
  const id = req.params.id;

  Appointment.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num[0] === 0) {
        res.status(404).send({
          message: `Randevu bulunamadı, ID: ${id}`
        });
      } else {
        res.status(200).send({
          message: "Randevu güncellendi."
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `ID: ${id} ile randevu güncellenirken bir hata oluştu.`
      });
    });
};

// ID'ye göre randevu sil
exports.delete = (req, res) => {
  const id = req.params.id;

  Appointment.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num === 0) {
        res.status(404).send({
          message: `Randevu bulunamadı, ID: ${id}`
        });
      } else {
        res.status(200).send({
          message: "Randevu silindi."
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `ID: ${id} ile randevu silinirken bir hata oluştu.`
      });
    });
};

// Tüm randevuları sil
exports.deleteAll = (req, res) => {
  Appointment.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.status(200).send({
        message: `${nums} randevu silindi.`
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Tüm randevular silinirken bir hata oluştu."
      });
    });
};
