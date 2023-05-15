/*@once*/
/* @refresh reload */
import { hydrate, render, renderToStringAsync } from 'solid-js/web';

import './index.css';
import App from './App';
import { Router } from "@solidjs/router";

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
   throw new Error(
        'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got mispelled?',
    );
}

// // render(() =>
render(() =>
  <Router>
    <App />
  </Router>
, root!);


// import express, { Request, Response } from "express";
// import url from "url";

// import { renderToString } from "solid-js/web";
// import App from "./App";

// const app = express();
// const port = 3000;

// app.use(express.static(url.fileURLToPath(new URL("../public", import.meta.url))));

// app.get("*", (req: Request, res: Response) => {
//   let html;
//   try {
//     html = renderToString(() => <App />);
//     console.log(html);
//   } catch (err) {
//     console.error(err);
//   } finally {
//     res.send(html);
//   }
// });

// app.listen(port, () => console.log(`Example app listening on port ${port}!`));






/*
import express from "express";
import { renderToString } from "solid-js/web";
function App() {
  return <h1>Hello World</h1>;
}
const app = express();
app.get("/", (req, res) => {
  const html = renderToString(() => <App />);
  res.send(html);
});
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
*/
