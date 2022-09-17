var jsforce = require("jsforce");
require("dotenv").config();
var conn = new jsforce.Connection();
const sfdcQuery = (req, res) => {
  conn.login(
    process.env.sfdc_username,
    process.env.sfdc_password,
    function (err, conRes) {
      if (err) {
        return console.error(err);
      }
      conn.query(
        `SELECT Id, ${req.body.query.fields} FROM ${req.body.query.object} ${req.body.query.filters}`,
        function (err, response) {
          if (err) {
            return console.error(err);
          }
          res.json({ data: response });
        }
      );
    }
  );
};

module.exports = {
  sfdcQuery,
};
