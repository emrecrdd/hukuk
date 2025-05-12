const nodemailer = require("nodemailer");
const db = require("../models");
require('dotenv').config();
const Subscriber = db.Subscriber;
const axios = require("axios");

// Nodemailer ayarları
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  // Çevre değişkeni ile kullanıcı
    pass: process.env.EMAIL_PASS,  // Çevre değişkeni ile şifre
  },
  tls: {
    rejectUnauthorized: false,  // SSL/TLS hata olasılıklarını engeller
  },
});

// Geçerli e-posta formatı kontrolü
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// E-posta gönderim işlemi
const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log("E-posta başarıyla gönderildi.");
  } catch (err) {
    console.error("E-posta gönderim hatası:", err);
    throw new Error("E-posta gönderim hatası.");
  }
};

// Tüm aboneleri getirme
exports.findAll = async (req, res) => {
    try {
        const subscribers = await Subscriber.findAll();
        res.json(subscribers);
    } catch (error) {
        console.error("Aboneleri alırken hata:", error);
        res.status(500).json({ message: "Aboneler alınırken hata oluştu." });
    }
};


// Abone oluşturma
exports.create = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "E-posta adresi gerekli." });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Geçersiz e-posta adresi." });
  }

  try {
    const existingSubscriber = await Subscriber.findOne({ where: { email } });

    if (existingSubscriber) {
      return res.status(400).json({ message: "Bu e-posta zaten kayıtlı." });
    }

    await Subscriber.create({ email });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Ali Arda Gül Hukuk Bürosu Bülteni',
      text: 'Ali Arda Gül Hukuk Bürosu bültenine abone olduğunuz için teşekkür ederiz!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Ali Arda Gül Hukuk Bürosu'na Hoş Geldiniz!</h2>
          <p>Aboneliğiniz için teşekkür ederiz. Hukuk dünyasındaki en son gelişmelerden haberdar olacaksınız.</p>
          <img src="https://aliardagul.av.tr/assets/aarda.png" alt="Ali Arda Gül" style="max-width: 100%; height: auto;" />
          <p style="margin-top: 20px;">Bizi sosyal medya hesaplarımızdan da takip etmeyi unutmayın.</p>
        </div>
      `,
    };

    await sendEmail(mailOptions);

    res.status(201).json({ message: "Başarıyla abone oldunuz! Hoş geldiniz!" });

  } catch (error) {
    console.error("Abonelik işlemi sırasında hata:", error);
    res.status(500).json({ message: `Abonelik işlemi sırasında bir hata oluştu: ${error.message}` });
  }
};

exports.delete = async (req, res) => {
    const { email } = req.params;
    try {
        const deletedRows = await Subscriber.destroy({ where: { email } });

        if (deletedRows === 0) {
            return res.status(404).json({ message: "Abone bulunamadı." });
        }

        // İstatistikleri güncelleme için API çağrısı yapıyoruz
        try {
            await axios.post(`${process.env.BACKEND_URL}/api/statistics/update-after-delete`);
            console.log("İstatistikler güncellendi.");
        } catch (statError) {
            console.error("İstatistik güncellenemedi:", statError);
            return res.status(500).json({ message: "İstatistik güncellenirken bir hata oluştu." });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Abone silinirken hata:", error);
        res.status(500).json({ message: "Abone silinirken hata oluştu." });
    }
};
