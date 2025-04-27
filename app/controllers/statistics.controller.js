const { Statistics } = require('../models');  // Statistics modelini doğru import ettiğinizden emin olun!

exports.subscribe = async (req, res) => {
  try {
    let stats = await Statistics.findOne();
    if (!stats) {
      // Eğer istatistik bulunamazsa, yeni bir kayıt oluşturuluyor
      stats = await Statistics.create({ totalSubscribers: 1 });
    } else {
      // Kayıt varsa, totalSubscribers sayısını arttırıyoruz
      stats.totalSubscribers += 1;
      await stats.save(); // Veritabanına kaydediyoruz
    }
    res.status(200).json({ message: "Abone sayısı güncellendi." });
  } catch (error) {
    console.error('Abone istatistiği güncelleme hatası:', error);
    res.status(500).json({ message: 'Abone istatistiğini güncelleme sırasında bir hata oluştu.' });
  }
};

exports.emailSent = async (req, res) => {
  try {
    let stats = await Statistics.findOne();
    if (!stats) {
      stats = await Statistics.create({ totalEmailsSent: 1 });
    } else {
      stats.totalEmailsSent += 1;
      await stats.save();
    }
    res.status(200).json({ message: 'Gönderim sayısı güncellendi.' });
  } catch (error) {
    console.error('E-posta gönderim hatası:', error);
    res.status(500).json({ message: 'E-posta gönderim istatistiğini güncelleme sırasında bir hata oluştu.' });
  }
};

exports.emailOpened = async (req, res) => {
  try {
    let stats = await Statistics.findOne();
    if (!stats) {
      stats = await Statistics.create({ totalEmailsOpened: 1 });
    } else {
      stats.totalEmailsOpened += 1;
      await stats.save();
    }
    res.status(200).send();
  } catch (error) {
    console.error('E-posta açılma hatası:', error);
    res.status(500).json({ message: 'E-posta açılma istatistiğini güncelleme sırasında bir hata oluştu.' });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const stats = await Statistics.findOne();
    if (!stats) {
      return res.status(404).json({ message: 'İstatistik bulunamadı.' });
    }
    res.json(stats);
  } catch (error) {
    console.error('İstatistik alma hatası:', error);
    res.status(500).json({ message: 'İstatistikleri alma sırasında bir hata oluştu.' });
  }
};
