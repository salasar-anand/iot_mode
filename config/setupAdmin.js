import User from '../models/userModel.js';

const setupAdmin = async () => {
  const existingAdmin = await User.findOne({ email: "admin@gmail.com" });

  if (!existingAdmin) {
    const newAdmin = new User({
      firstName: "Admin",
      lastName: "Account",
      email: "admin@gmail.com",
      phone: "+199988776655",
      profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      password: "123456", // Will be hashed in pre-save
      role: "admin",
      status: "active",
      emailVerified: true,
    });

    await newAdmin.save();
    console.log("✅ Admin created: admin@gmail.com | Password: 123456");
  } else {
    console.log("ℹ️ Admin already exists");
  }
};

export default setupAdmin;
