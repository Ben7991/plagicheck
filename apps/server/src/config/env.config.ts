export default () => ({
  port: process.env.PORT,
  secret: process.env.SECRET,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  admin: {
    id: process.env.ADMIN_ID,
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    phone: process.env.ADMIN_PHONE,
  },
  mailer: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT!),
    address: process.env.MAIL_ADDRESS,
    name: process.env.MAIL_NAME,
    password: process.env.MAIL_PASSWORD,
  },
});
