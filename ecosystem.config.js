module.exports = {
  apps: [
    {
      name:             'engishield-api',
      script:           './server.js',
      instances:        'max',
      exec_mode:        'cluster',
      max_memory_restart: '512M',
      env_production: {
        NODE_ENV:   'production',
        PORT:       3001,
      },
      error_file:  './logs/pm2-error.log',
      out_file:    './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs:  true,
      watch:       false,
      autorestart: true,
      restart_delay: 3000,
      max_restarts:  10,
    },
  ],
}
