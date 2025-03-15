const Coupon = require("../models/coupons");

let currentIndex = 0; // Keeps track of last assigned coupon

const getNextCoupon = async () => {
  try {
    const coupons = await Coupon.find({ is_active: true }).sort({ _id: 1 }); // Get active coupons sorted by ID
    if (coupons.length === 0) return null; // If no coupons available

    const coupon = coupons[currentIndex]; // Pick the next coupon
    currentIndex = (currentIndex + 1) % coupons.length; // Move to next, loop back when last coupon is used

    return coupon;
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return null;
  }
};

// API for Round Robin Coupon Assignment
const claimCoupon = async (req, res) => {
  try {
    const coupon = await getNextCoupon();
    if (!coupon)
      return res.status(404).json({ message: "No coupons available" });

    res.json({ message: "Coupon claimed successfully", coupon });
  } catch (error) {
    console.error("Error in claimCoupon:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const editCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, description, valid_from, valid_until, is_active } = req.body;

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { code, description, valid_from, valid_until, is_active },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res
      .status(200)
      .json({ message: "Coupon updated successfully!", updatedCoupon });
  } catch (error) {
    console.error("Edit Coupon Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { claimCoupon, editCoupon };
