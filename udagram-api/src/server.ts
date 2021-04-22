import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import * as path from 'path';
import { config } from './config/config';
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
import fs = require('fs');
const FileStreamRotator = require('file-stream-rotator');

(async () => {

  const app = express();

  const logDirectory = path.join(__dirname, 'log')

  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

  // log file rotation
  const accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(logDirectory, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
  })

  // setup the logger
  app.use(morgan('combined', { stream: accessLogStream }));
  app.use(morgan("dev"));

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
  app.listen(config.port, () => {
    console.log(`server running on Port: ${config.port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
