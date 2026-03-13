module.exports = {
  apps: [
    {
      name: 'Car-rental',
      script: './index.js',

      // Process mode
      instances: 1,
      exec_mode: 'fork',

      // 🔥 WATCH SETTINGS
      watch: ['index.js', 'src'],
      ignore_watch: ['node_modules', 'src/logs', '.git', '.env'],

      watch_delay: 1000,
      watch_options: {
        followSymlinks: false
      },

      // ENV
      env: {
        NODE_ENV: 'development',
        PORT: 8000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8000
      },

      // LOGS
      error_file: './src/logs/pm2-error.log',
      out_file: './src/logs/pm2-out.log',
      merge_logs: true,

      // SAFETY
      max_memory_restart: '512M',
      autorestart: true
    }
  ]
};
