import initApp from "./app";
import http from 'http';
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import fs from 'fs';
import https from 'https';

initApp().then((app) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Web Advanced Application development 2023 REST API",
        version: "1.0.1",
        description: "REST server including authentication using JWT and refresh token",
      },
      servers: [{ url: process.env.SERVER_URL, },],
    },
    apis: ["./src/routes/*.ts"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

  if (process.env.NODE_ENV !== 'production') {
    console.log('development');
    http.createServer(app).listen(process.env.PORT);
  } else {
    console.log('PRODUCTION');
    const options2 = {
      key: fs.readFileSync('/home/st111/cert/server.key'),
      cert: fs.readFileSync('/home/st111/cert/server.crt')
    };
    https.createServer(options2, app).listen(process.env.HTTPS_PORT);
  }
});
