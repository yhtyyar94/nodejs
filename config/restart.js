const request = require("request");

const restart = () => {
  const interval = setInterval(() => {
    request(
      "https://my-nodejs-backend.onrender.com",
      (error, response, body) => {
        if (error) {
          console.log(error);
        }
      }
    );
  }, 5000);
};

module.exports = restart;
