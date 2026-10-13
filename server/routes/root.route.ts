import { Request, Response } from 'express';

export function rootRoute(request: Request, response: Response) {
  response.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>BS Playground - Server</title>
  </head>
  <body>
    <h1>Server is running</h1>
  </body>
</html>
`);
}
