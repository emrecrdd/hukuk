const nodemailer = require("nodemailer");
const db = require("../models");
const Subscriber = db.Subscriber;  // Abone modelini çağırıyoruz
const Blog = db.Blog;  // Blog modelini çağırıyoruz
const Op = db.Sequelize.Op;
require('dotenv').config();

// Nodemailer ayarları
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  // Çevre değişkeni ile kullanıcı
    pass: process.env.EMAIL_PASS,  // Çevre değişkeni ile şifre
  },
  tls: {
    rejectUnauthorized: false  // SSL/TLS hata olasılıklarını engeller
  }
});

// Yeni bir Blog oluştur
exports.create = async (req, res) => {
  if (!req.body.name || !req.body.description) {
    return res.status(400).send({
      message: "Başlık ve açıklama zorunludur!"
    });
  }

  const blog = {
    name: req.body.name,
    description: req.body.description,
    author: req.body.author || "Unknown",
    img: req.body.img || "default_image.jpg",
    categoryId: req.body.categoryId,  // Veritabanına eklenen kategori ID'si
    publishedDate: req.body.publishedDate,
  };

  try {
    // Yeni blogu oluştur ve veritabanına ekle
    const newBlog = await Blog.create(blog);

    // Tüm aboneleri getir
    const subscribers = await Subscriber.findAll();

    // Abonelere e-posta gönder
    if (subscribers.length > 0) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        subject: `Yeni Blog Yayınlandı: ${newBlog.name}`,
        text: `Merhaba, yeni blog yazımız yayında: ${newBlog.name}\n\n${newBlog.description}\n\nDetaylar için tıklayın: http://localhost:3000/blog/${newBlog.id}`,
        html: `<h3>Yeni Blog Yayınlandı: ${newBlog.name}</h3>
               <p>${newBlog.description}</p>
               <a href="https://aliardagul-av-tr.netlify.app">Detayları Görüntüle</a>`,
      }; /* http://localhost:3000/blog/${newBlog.id} */

      // Abonelere e-posta gönder
      subscribers.forEach(subscriber => {
        transporter.sendMail({ ...mailOptions, to: subscriber.email }, (err, info) => {
          if (err) {
            console.error(`E-posta gönderim hatası (${subscriber.email}):`, err);
          } else {
            console.log(`E-posta başarıyla gönderildi: ${subscriber.email}`);
          }
        });
      });
    }

    res.status(201).send(newBlog); // Blog başarıyla oluşturulursa
  } catch (error) {
    console.error("Blog oluşturulurken hata:", error);
    res.status(500).send({
      message: error.message || "Blog oluşturulurken bir hata oluştu."
    });
  }
};

// Diğer CRUD işlemleri için mevcut fonksiyonlar (findAll, findOne, update, delete) değişmeden kalabilir.


// Tüm blogları getir
exports.findAll = (req, res) => {
  const title = req.query.title;
  const condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  Blog.findAll({
    where: condition,
    include: [{ model: db.Category, as: "category" }]  // Kategori bilgisini de ekliyoruz
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Blog'ları getirirken bir hata oluştu."
      });
    });
};

// Belirtilen id'ye sahip Blog'u getir
exports.findOne = (req, res) => {
  const id = req.params.id;

  Blog.findByPk(id, {
    include: [{ model: db.Category, as: "category" }]  // Kategori bilgisini de ekliyoruz
  })
    .then(data => {
      if (!data) {
        return res.status(404).send({
          message: `ID=${id} olan Blog bulunamadı!`
        });
      }
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "ID=" + id + " olan Blog getirilirken hata oluştu."
      });
    });
};

// Backend - Blog güncelleme işlemi
exports.update = (req, res) => {
  const id = req.params.id;

  // req.body içerisine categoryId de dahil olacak şekilde güncelleme yapılır
  Blog.update(
    {
      name: req.body.name,
      description: req.body.description,
      author: req.body.author || "Unknown",
      img: req.body.img || "default_image.jpg",
      categoryId: req.body.categoryId, // Frontend'den gelen kategori ID'sini alıyoruz
      publishedDate: req.body.publishedDate,
    },
    { where: { id: id } }
  )
    .then(num => {
      if (num == 1) {
        res.send({ message: "Blog başarıyla güncellendi." });
      } else {
        res.send({
          message: `ID=${id} olan Blog güncellenemedi. Belki bulunamadı veya veri boş olabilir!`,
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "ID=" + id + " olan Blog güncellenirken hata oluştu.",
      });
    });
};

// Belirtilen id'ye sahip Blog'u sil
exports.delete = (req, res) => {
  const id = req.params.id;

  Blog.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Blog başarıyla silindi!"
        });
      } else {
        res.send({
          message: `ID=${id} olan Blog silinemedi. Belki bulunamadı!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "ID=" + id + " olan Blog silinemedi."
      });
    });
};

// Tüm Blog'ları sil
exports.deleteAll = (req, res) => {
  Blog.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} adet Blog başarıyla silindi!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Tüm Blog'ları silerken bir hata oluştu."
      });
    });
};
