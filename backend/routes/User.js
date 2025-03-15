const express = require("express");
const router = express.Router();
const usercontrollers = require("../Controllers/user.js");
const couponsControllers = require("../Controllers/couponsControllers.js");
const authMiddleware = require("../middleware/authMiddleware.js");

router.route("/login").post(usercontrollers.login); //Login Route
router.route("/register").post(usercontrollers.register); //register
router.get("/claim", couponsControllers.claimCoupon); //claimCoupons
router.put("/edit/:id", authMiddleware, couponsControllers.editCoupon); //editCoupons

module.exports = router;
