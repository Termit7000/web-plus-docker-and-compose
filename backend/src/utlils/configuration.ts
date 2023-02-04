export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'database',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    synchronize: true,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});
