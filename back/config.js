const config = {
  hostname: 'localhost',
  db: {
    port: 27017,
    name: 'auto-service',
  },
  app: {
    port: 3000,
  },
};


config.db.url = `mongodb://${config.hostname}:${config.db.port}/${config.db.name}`;

Object.freeze(config);

module.exports = config;
