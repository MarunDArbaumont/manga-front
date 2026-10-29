import dotenv from 'dotenv';

dotenv.config();

export default {
    APIUrl: process.env.API_BASE_URL ?? '',
}