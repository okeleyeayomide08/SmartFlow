import dotenv from "dotenv";

dotenv.config();

const env = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY,
    senderEmail: process.env.RESEND_SENDER_EMAIL,
    senderName: process.env.RESEND_SENDER_NAME,
  },
};

export default env;
