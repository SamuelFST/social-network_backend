class PostController {
  async getList(req, res) {
    console.log(req.params);
    res.send(JSON.stringify([]));
    res.status(200);
    res.end();
  }

  async insert(req, res) {
    console.log(JSON.stringify(req.body));
    res.status(201);
    res.end();
  }

  async get(req, res) {
    console.log(req.params);
    res.send(JSON.stringify({}));
    res.status(200);
    res.end();
  }

  async update(req, res) {
    console.log(req.body);
    res.status(203);
    res.end();
  }

  async delete(req, res) {
    res.status(203);
    res.end();
  }
}

export default new PostController();
