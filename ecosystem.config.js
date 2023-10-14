module.exports = {
  apps: [
    {
      name: 'next',
      cwd: '/home/toby/Documents/daw-site/daw-site',
      watch: ["server", "client", "./**/*.tsx"],
      script: 'bun',
      args: 'start',
      env: {
        NODE_ENV: 'production',

      },
    },
  ],
};