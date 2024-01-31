import initApp from "./app";
const express = require('express');
initApp().then((app) => {
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});