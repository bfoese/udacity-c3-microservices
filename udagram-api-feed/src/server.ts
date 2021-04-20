import bodyParser from 'body-parser';
import express from 'express';
import { config } from './config/config';
import { IndexRouter } from './controllers/v0/index.router';
import { V0_FEED_MODELS } from './controllers/v0/model.index';
import { sequelize } from './sequelize';

(async () => {
  await sequelize.addModels(V0_FEED_MODELS);
  await sequelize.sync();

  const app = express();
  const port = config.port || 8080;

  app.use(bodyParser.json());

  app.use('/api/v0/', IndexRouter);

  // Root URI call
  app.get( '/', async ( req, res ) => {
    res.send( '/api/v0/' );
  } );

  // Start the Server
  app.listen( port, () => {
    console.log( `server running on Port: ${config.port}` );
    console.log( `press CTRL+C to stop server` );
  } );
})();
