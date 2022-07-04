import { Router } from 'express';
import requestData from '../middlewares/requestData';

import PostController from '../controllers/PostController';

const routes = new Router();

routes.get('/posts', requestData, PostController.getList);
routes.post('/posts', requestData, PostController.insert);
routes.get('/posts/:id', requestData, PostController.get);
routes.put('/posts/:id', requestData, PostController.update);
routes.delete('/posts/:id', requestData, PostController.delete);

export default routes;
