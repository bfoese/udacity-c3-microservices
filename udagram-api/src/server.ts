import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { config } from './config/config';
const { createProxyMiddleware } = require('http-proxy-middleware');

(async () => {

  const app = express();
  const port = config.port || 8080;

  // API gateway centralizes the CORS and auth header logic
  app.use(cors({
    allowedHeaders: [
      'Origin', 'X-Requested-With',
      'Content-Type', 'Accept',
      'X-Access-Token', 'Authorization',
    ],
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: config.frontendUrl,
  }));

  // configure proxy for the different APIs
  const apiPathToEndpoint = new Map([['feed', config.feedApiUrl], ['users', config.userApiUrl]]);
  for (const path of Array.from(apiPathToEndpoint.keys())) {
    app.use(`/api/v*/${path}`, createProxyMiddleware({
      target: apiPathToEndpoint.get(path),
      changeOrigin: false,
    }));
  }

  app.use(bodyParser.json());

  // Root URI call
  app.get('/', async (req, res) => {
    console.log('request', req.path)
    res.send('/api/v0/');
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running on Port: ${config.port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
