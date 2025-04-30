const http = require("http");
const app = require("./index.js");
const connectDB = require("./db/db.js");

const port = process.env.PORT || 3000;

const server = http.createServer(app);

connectDB();

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
