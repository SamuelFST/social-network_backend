/* eslint-disable no-unused-expressions */
async function requestData(req, res, next) {
  console.log(`Request from : ${req.originalUrl}`);
  console.log(`Request type : ${req.method}`);
  console.log(`Request params : ${req.params}`);
  req.params.id ? console.log(`Request id : ${req.params.id}`) : 0;
  next();
}

export default requestData;
