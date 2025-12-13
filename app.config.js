import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    API_BASE: process.env.API_BASE || 'https://cinerama-production-1190.up.railway.app',
    TMDB_API_KEY: process.env.TMDB_API_KEY || 'e5cbe4aaec7d2125bd4dc8ca643c5053',
  },
});
