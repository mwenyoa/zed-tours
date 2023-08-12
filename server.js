const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const mongoose = require('mongoose');

// Handle Uncaught Exceptions
  process.on('uncaughtException', (err) => {
    console.log("Uncaught Exception...Server Shutingdown", err);
    process.exit(1);
  })

const DBS = process.env.DB_LOCAL;
mongoose.connect(DBS).then(() => {
 
}).catch((e) => {
  throw new Error(e);
})
 
const app = require('./app');
const port = process.env.PORT || 3001;
// start server
const server = app.listen(port, () => {
    console.log(`Server waiting for requests on port ${port}`);
  });

  // Handling Unhandled Promise Rejections
  process.on('unhandledRejection', (err) =>{
     console.log(err.name, err.message)
    //  gracefully shudown server
     server.close(() =>{
      process.exit(1);
     })
  });
