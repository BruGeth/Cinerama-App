import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    API_BASE: process.env.API_BASE || 'https://api.example.com',
    TMDB_API_KEY: process.env.TMDB_API_KEY || '',
  },
});
