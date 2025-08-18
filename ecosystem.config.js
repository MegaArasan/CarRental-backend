module.exports = {
  apps: [
    {
      name: 'Car-rental',
      script: './index.js',
      instances: 1,
      exec_mode: 'fork',
      watch: true,
      ignore_watch: ['node_modules', './src/logs'],
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
// module.exports = {
//   apps: [
//     {
//       name: 'Car-rental-8000',
//       script: './index.js',
//       env: {
//         PORT: 8000
//       },
//       instances: 4,
//       exec_mode: 'cluster',
//       watch: true
//     },
//     {
//       name: 'Car-rental-8001',
//       script: './index.js',
//       env: {
//         PORT: 8001
//       },
//       instances: 4,
//       exec_mode: 'cluster',
//       watch: true
//     },
//     {
//       name: 'Car-rental-8002',
//       script: './index.js',
//       env: {
//         PORT: 8002
//       },
//       instances: 4,
//       exec_mode: 'cluster',
//       watch: true
//     },
//     {
//       name: 'Car-rental-8003',
//       script: './index.js',
//       env: {
//         PORT: 8003
//       },
//       instances: 4,
//       exec_mode: 'cluster',
//       watch: true
//     }
//   ]
// };
