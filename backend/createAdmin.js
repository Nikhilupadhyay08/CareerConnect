const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log(
        "ADMIN_EMAIL and ADMIN_PASSWORD are required in .env"
      );
      process.exit(1);
    }

    const admin = await User.findOne({
      email: adminEmail,
    });

    if (!admin) {
      console.log("Admin account not found.");
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(
      adminPassword,
      10
    );

    admin.password = hashedPassword;
    admin.role = "admin";

    await admin.save();

    console.log("Admin password updated successfully.");
    console.log(`Admin email: ${admin.email}`);

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error(
      "Failed to update admin password:",
      error.message
    );

    process.exit(1);
  }
};

resetAdminPassword();