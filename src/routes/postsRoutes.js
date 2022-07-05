import { Router } from 'express';
import requestData from '../middlewares/requestData';

const posts = new Router();

posts.route('/posts')
  .all(requestData)
  .get((req, res) => {
    console.log(req.params);
    res.send(JSON.stringify([]));
    res.status(200);
    res.end();
  })
  .post((req, res) => {
    console.log(JSON.stringify(req.body));
    res.status(201);
    res.end();
  });

posts
  .param('id', requestData)
  .route('/posts/:id')
  .get((req, res) => {
    console.log(req.params);
    res.send(JSON.stringify({}));
    res.status(200);
    res.end();
  })
  .put((req, res) => {
    console.log(req.body);
    res.status(203);
    res.end();
  })
  .delete((req, res) => {
    res.status(203);
    res.end();
  });

export default posts;
