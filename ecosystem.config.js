module.exports = {
  apps: [
    {
      name: 'Car-rental',
      script: './index.js',
      instances: 1,
      exec_mode: 'cluster',
      watch: true,
      env: {
        NODE_ENV: 'development',
        PORT: 8000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8000
      },
      error_file: './src/logs/pm2-error.log',
      out_file: './src/logs/pm2-out.log',
      merge_logs: true,
      max_memory_restart: '512M'
    }
  ]
};
