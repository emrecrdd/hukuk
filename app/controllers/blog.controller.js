const nodemailer = require("nodemailer");
const db = require("../models");
const Subscriber = db.Subscriber;
const Blog = db.Blog;
const Op = db.Sequelize.Op;
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

exports.create = async (req, res) => {
  if (!req.body.name || !req.body.description || !req.body.content) {
    return res.status(400).send({
      message: "Başlık ve açıklama zorunludur!"
    });
  }

  const blog = {
    name: req.body.name,
    description: req.body.description,
    author: req.body.author || "Unknown",
    img: req.body.img || "default_image.jpg",
    publishedDate: req.body.publishedDate,
    content:req.body.content,
  };

  try {
    const newBlog = await Blog.create(blog);

    const subscribers = await Subscriber.findAll();

if (subscribers.length > 0) {
  subscribers.forEach(subscriber => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: subscriber.email,  // Her bir aboneye e-posta gönder
      subject: `Yeni Blog Yayınlandı: ${newBlog.name}`,
      text: `Merhaba,\n\nYeni blog yazımız yayında: ${newBlog.name}\n\n${newBlog.description}\n\nDetaylar için tıklayın: https://aliardagul.av.tr/blog/${newBlog.id}`,
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
              }
              .header {
                background-color: #2c3e50;
                color: #ffffff;
                text-align: center;
                padding: 10px;
                border-radius: 8px 8px 0 0;
              }
              .header h3 {
                margin: 0;
              }
              .content {
                padding: 20px;
                color: #333;
              }
              .footer {
                text-align: center;
                font-size: 12px;
                color: #777;
                padding: 10px;
                background-color: #ecf0f1;
                margin-top: 20px;
                border-radius: 0 0 8px 8px;
              }
              a {
                color: #2980b9;
                text-decoration: none;
              }

              /* Responsive Design */
              @media only screen and (max-width: 600px) {
                .container {
                  padding: 10px;
                  width: 100%;
                }
                .header h3 {
                  font-size: 20px;
                }
                .content {
                  padding: 10px;
                }
                .footer {
                  font-size: 10px;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h3>Merhaba!</h3>
              </div>
              <div class="content">
                <h4><strong>Yeni Blog Yayınlandı: ${newBlog.name}</strong></h4>
                <p>${newBlog.description}</p>
                <p><a href="https://aliardagul.av.tr/blog/${newBlog.id}">Detayları Görüntüle</a></p>
              </div>
              <div class="footer">
                <p>Bu e-posta, blog güncellemelerini almak için abone olduğunuzda gönderilmiştir.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    // E-posta gönderim işlemi
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(`E-posta gönderim hatası (${subscriber.email}):`, err);
      } else {
        console.log(`E-posta başarıyla gönderildi: ${subscriber.email}`);
      }
    });
  });
} else {
  console.log("Abone yok, e-posta gönderilmedi.");
}


    res.status(201).send(newBlog);
  } catch (error) {
    console.error("Blog oluşturulurken hata:", error);
    res.status(500).send({
      message: error.message || "Blog oluşturulurken bir hata oluştu."
    });
  }
};

exports.findAll = (req, res) => {
  const title = req.query.title;
  const condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  Blog.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Blog'ları getirirken bir hata oluştu."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Blog.findByPk(id)
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

exports.update = (req, res) => {
  const id = req.params.id;

  Blog.update(
    {
      name: req.body.name,
      description: req.body.description,
      author: req.body.author || "Unknown",
      img: req.body.img || "default_image.jpg",
      publishedDate: req.body.publishedDate,
      content:req.body.content,
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
      console.error("Blog güncelleme hatası:", err); // Hata loglarını yazdırma
      res.status(500).send({
        message: "ID=" + id + " olan Blog güncellenirken hata oluştu.",
      });
    });
    
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Blog.destroy({ where: { id: id } })
    .then(num => {
      if (num == 1) {
        res.send({ message: "Blog başarıyla silindi!" });
      } else {
        res.send({ message: `ID=${id} olan Blog silinemedi. Belki bulunamadı!` });
      }
    })
    .catch(err => {
      res.status(500).send({ message: "ID=" + id + " olan Blog silinemedi." });
    });
};

exports.deleteAll = (req, res) => {
  Blog.destroy({ where: {}, truncate: false })
    .then(nums => {
      res.send({ message: `${nums} adet Blog başarıyla silindi!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Tüm Blog'ları silerken bir hata oluştu."
      });
    });
};
