import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT,
  frontendUrl: process.env.FRONTEND_URL,
  userApiUrl: process.env.USER_API_URL,
  feedApiUrl: process.env.FEED_API_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};
