var express = require("express");
var router = express.Router();

var SquareConnect =  require("square-connect");

var customersAPI = new SquareConnect.CustomersApi();

/* GET home page. */
router.get("/getCustomer", function (req, res, next) {
	let table = req.params["table"];
	res.send(table);
});

router.post("/newCustomer", async (req, res, next) => {
  console.log(req.body);

  const body = new SquareConnect.CreateCustomerRequest();

  body.given_name = req.body.given_name;
  body.family_name = req.body.family_name;
  body.phone_number = req.body.phone_number;
  
  customersAPI.createCustomer(body).then(data => {
    res.json({
      id: data.customer.id
    });
  });
});

module.exports = router;
