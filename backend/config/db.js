const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        require("dns").setServers(["8.8.8.8", "8.8.4.4"]);
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 8000,
        });
        console.log("✅ MongoDB Atlas connected successfully");
    } catch (error) {
        console.error("⚠️ MongoDB connection failed (check your IP/network):", error.message);
    }
};

module.exports = { connectDB };
