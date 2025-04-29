module.exports = (sequelize, Sequelize) => {
    const Appointment = sequelize.define("appointment", {
      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^[0-9]{10,15}$/, // Telefon numarasının doğru formatta olmasını sağla
            msg: "Invalid phone number format",
          },
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            msg: "Invalid email format",
          },
        },
      },
      date: {
        type: Sequelize.DATEONLY, // Gün olarak kaydedilmesi gerektiği için DATEONLY kullanılabilir
        allowNull: false,
      },
      time: {
        type: Sequelize.STRING, // Saat dilimi formatı "10:30", "14:00"
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT, // Opsiyonel mesaj alanı
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending", // Varsayılan olarak 'pending' (beklemede) status
      },
    });
  
    return Appointment;
  };
  
