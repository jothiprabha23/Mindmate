import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://RAMPRASANNA:rockyy@project.26nbhxz.mongodb.net/?retryWrites=true&w=majority&appName=project";

async function connectDB() {
  return mongoose.connect(MONGODB_URI);
}



export default connectDB