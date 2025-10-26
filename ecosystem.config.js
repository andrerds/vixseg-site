module.exports = {
  apps: [
    {
      name: "vixseg-site",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/home/vixseg/htdocs/vixseg.com.br",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3105,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
    },
  ],
};
