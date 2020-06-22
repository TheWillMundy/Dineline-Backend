var express = require("express");
var router = express.Router();

var SquareConnect =  require("square-connect");

var ordersAPI = new SquareConnect.OrdersApi();

const generateHexString = len => {
  let output = ""
  for (let i = 0; i < len; ++i) {
    output += Math.floor(Math.random() * 16).toString(16)
  }
  return output
}

router.get("/retrieveOrder", async (req, res, next) => {
  console.log(req.query)

  const body = new SquareConnect.BatchRetrieveOrdersRequest();
  body.order_ids = [req.query['order_id']];

  ordersAPI.batchRetrieveOrders(req.query['location_id'], body).then(response => {
    res.json(response.orders);
  }).catch(err => console.log(err));
})

router.post("/startOrder", async (req, res, next) => {
  console.log(req.body);

  const body = new SquareConnect.CreateOrderRequest();

  body.idempotency_key = generateHexString(45);
  body.order = {
    customer_id: req.body.customer_id,
    location_id: req.body.location_id,
  };

  ordersAPI.createOrder(req.body.location_id, body).then(data => {
    res.json({
      id: data.order.id,
      version: data.order.version
    });
  }).catch(err => console.log(err));
});

router.post("/updateOrder", async (req, res, next) => {
  console.log(req.body);

  // Create new line item from req.body
  const lineItem = new SquareConnect.OrderLineItem();
  lineItem.quantity = String(req.body.quantity);
  lineItem.catalog_object_id = req.body.catalog_object_id;
  lineItem.note = req.body.note;

  const modifiers = [];
  for (let modifier of req.body.modifiers) {
    let lineItemModifier = new SquareConnect.OrderLineItemModifier();
    lineItemModifier.catalog_object_id = modifier;
    modifiers.push(lineItemModifier);
  }

  lineItem.modifiers = modifiers;

  const body = new SquareConnect.UpdateOrderRequest();

  body.idempotency_key = generateHexString(45);
  body.order = {
    location_id: req.body.location_id,
    line_items: [lineItem],
    id: req.body.order_id,
    version: parseInt(req.body.current_version),
  };

  ordersAPI.updateOrder(req.body.location_id, req.body.order_id, body).then(data => {
    res.json({
      id: data.order.id,
      version: data.order.version,
      success: true
    });
  }).catch(err => {
    console.log(err);
    res.json({
      success: false
    });
  });
});

module.exports = router;
