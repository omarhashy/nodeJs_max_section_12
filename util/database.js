const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const PASSWORD = process.env.PASSWORD;
let _db;

const mongoConnect = (callback) => {

  MongoClient.connect(
    `mongodb+srv://omarhashy:${PASSWORD}@cluster0.qzjhm.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0`
  )
    .then((client) => {
      _db = client.db();
      callback(client);
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) return _db;
  throw "No db found";
};
module.exports.mongoConnect = mongoConnect;
module.exports.getDb = getDb;
