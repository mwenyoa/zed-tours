const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const mongoose = require('mongoose');

const DBS = process.env.DB_LOCAL;
mongoose.connect(DBS).then(() => {

}).catch((e) => {
  throw new Error(e);
})
 
const app = require('./app');
const port = process.env.PORT || 3001;
// start server
app.listen(port, () => {
    console.log(`Server waiting for requests on port ${port}`);
  });