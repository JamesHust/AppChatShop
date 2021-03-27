const express = require("express");
//create router for object: customer
const router = express.Router();

router.get("/", (req, res, next) => {
    res.send("<h1>Welcome to my channel!</h1>");
});

module.exports = router;
