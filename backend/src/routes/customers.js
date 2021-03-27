const express = require("express");
const customersController = require('../controllers/customers');                                                                

//create router for object: customer
const router = express.Router();

//add new customer
router.get("/add-customer", customersController.getAddProduct);
router.post("/customer", customersController.postAddProduct);
router.get("/customers", customersController.getCustomers);

module.exports = router;
