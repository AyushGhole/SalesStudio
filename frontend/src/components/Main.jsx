import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar.jsx";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useNavigate } from "react-router-dom";

const CouponsList = () => {
  const [coupons, setCoupons] = useState([]); // All available coupons
  const [claimedCoupon, setClaimedCoupon] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Convert token presence to boolean
  }, []);

  // Fetch all available coupons
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get("http://localhost:5000/couponsDetails");
      if (response.data.length > 0) {
        setCoupons(response.data);
      } else {
        setCoupons([]);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  // Function to claim a coupon
  const claimCoupon = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/coupons/claim"
      );
      setClaimedCoupon(response.data.coupon);

      Swal.fire({
        title: "🎉 Coupon Claimed!",
        text: `You have successfully claimed: ${response.data.coupon.code}`,
        icon: "success",
        confirmButtonText: "Awesome!",
        confirmButtonColor: "#28a745",
      });

      fetchCoupons();
    } catch (error) {
      Swal.fire({
        title: "Oops!",
        text: "No coupons available or an error occurred.",
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#d33",
      });
    }
  };

  // Handle Edit function
  const handleEditCoupon = async (coupon) => {
    if (!isLoggedIn) {
      Swal.fire({
        title: "Unauthorized",
        text: "You must be logged in to edit coupons.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const token = localStorage.getItem("token");
    console.log("🚀 Token before sending request:", token); //  Debugging log

    if (!token) {
      Swal.fire({
        title: "Unauthorized",
        text: "You are not logged in. Please log in first.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: "Edit Coupon",
      html: `
        <input id="swal-code" class="swal2-input" placeholder="Coupon Code" value="${
          coupon.code
        }">
        <input id="swal-description" class="swal2-input" placeholder="Description" value="${
          coupon.description
        }">
        <input id="swal-valid-from" class="swal2-input" type="date" value="${
          new Date(coupon.valid_from).toISOString().split("T")[0]
        }">
        <input id="swal-valid-until" class="swal2-input" type="date" value="${
          new Date(coupon.valid_until).toISOString().split("T")[0]
        }">
        <select id="swal-status" class="swal2-select">
          <option value="true" ${
            coupon.is_active ? "selected" : ""
          }>Active</option>
          <option value="false" ${
            !coupon.is_active ? "selected" : ""
          }>Expired</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update",
      preConfirm: () => {
        return {
          code: document.getElementById("swal-code").value,
          description: document.getElementById("swal-description").value,
          valid_from: document.getElementById("swal-valid-from").value,
          valid_until: document.getElementById("swal-valid-until").value,
          is_active: document.getElementById("swal-status").value === "true",
        };
      },
    });

    if (formValues) {
      try {
        console.log("🚀 Sending PUT request with token:", token); //  Debugging log

        const response = await axios.put(
          `http://localhost:5000/api/coupons/edit/${coupon._id}`,
          formValues,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Ensure correct format
            },
          }
        );

        console.log(" Update Response:", response.data); //  Debugging log

        Swal.fire({
          title: "Updated!",
          text: "Coupon updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });

        fetchCoupons();
      } catch (error) {
        console.error("❌ Error updating coupon:", error.response?.data);
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Could not update the coupon.",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="mainBody">
      <Navbar />

      {/* Claim Coupons Section */}
      <div className="max-w-lg mx-auto p-6 shadow-md rounded-lg bg-white mt-10">
        <h2
          className="text-2xl font-semibold text-center mb-4 text-orange-600"
          style={{ color: "orange" }}>
          Claim Your Coupon
        </h2>

        <div className="text-center">
          <button
            className=" bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md"
            style={{ borderRadius: "5px" }}
            onClick={claimCoupon}>
            🎟️ Claim Now
          </button>
        </div>

        {claimedCoupon && (
          <div className="mt-6 p-4 border rounded-lg bg-green-100 text-center shadow-md">
            <h3
              className="text-lg font-bold text-orange-600"
              style={{ color: "green" }}>
              🎉 You Claimed:
            </h3>
            <p className="text-sm text-gray-700 font-medium">
              {claimedCoupon.code} - {claimedCoupon.description}
            </p>
            <p className="text-sm text-gray-600">
              Valid: {new Date(claimedCoupon.valid_from).toLocaleDateString()} -{" "}
              {new Date(claimedCoupon.valid_until).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Available Coupons Section */}
      <div className="max-w-4xl mx-auto p-6 shadow-md rounded-lg mt-10">
        <h2 className="text-2xl font-semibold text-center mb-4 text-blue-600">
          Available Coupons
        </h2>

        {coupons.length === 0 ? (
          <p className="text-center text-gray-500">No coupons available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="border p-4 rounded-lg shadow-sm bg-gray-100">
                <h3
                  className="text-lg font-bold text-orange-600"
                  style={{ color: "#fc5203" }}>
                  {coupon.code}
                </h3>
                <p className="text-sm text-gray-700">{coupon.description}</p>
                <p className="text-sm text-gray-600">
                  Valid: {new Date(coupon.valid_from).toLocaleDateString()} -{" "}
                  {new Date(coupon.valid_until).toLocaleDateString()}
                </p>
                <small
                  className={`text-sm font-semibold mt-2 block ${
                    coupon.is_active ? "text-green-500" : "text-red-500"
                  }`}>
                  {coupon.is_active ? "Active" : "Expired"}
                </small>

                {/* Show Edit Button Only for Logged-In Users */}
                {isLoggedIn && (
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md mt-3"
                    style={{ borderRadius: "5px" }}
                    onClick={() => handleEditCoupon(coupon)}>
                    ✏️ Edit
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponsList;
