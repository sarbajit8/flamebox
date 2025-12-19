const express = require("express");
const router = express.Router();
const packagesController = require("../../controllers/admin/packages-controller");

// Test route - add this at the very top
router.post("/test", (req, res) => {
  console.log("🧪 Test route hit!");
  console.log("Body:", req.body);
  return res.status(200).json({
    success: true,
    message: "Test route works!",
    body: req.body
  });
});

// ============================================
// PUBLIC ROUTES - No Authentication Required
// ============================================

// Get all active packages (for public viewing)
router.get("/active", packagesController.getActivePackages);

// Get featured packages
router.get("/featured", packagesController.getFeaturedPackages);

// Get packages by category (public)
router.get("/category/:category", packagesController.getPackagesByCategory);

// Get package by ID (public)
router.get("/public/:id", packagesController.getPackageById);

// ============================================
// ADMIN ROUTES - NO AUTH (TEMPORARILY)
// ============================================

// Get package statistics
router.get("/statistics", packagesController.getPackageStatistics);

// Get all packages (admin view with filters)
router.get("/", packagesController.getAllPackages);

// Get package by ID (authenticated)
router.get("/:id", packagesController.getPackageById);

// Create new package - SIMPLIFIED VERSION
router.post("/", (req, res, next) => {
  console.log("🔍 POST / route hit!");
  console.log("Request body:", req.body);
  console.log("Next exists?", typeof next);
  
  // Call the controller
  packagesController.createPackage(req, res);
});

// Duplicate package
router.post("/:id/duplicate", packagesController.duplicatePackage);

// Update package
router.put("/:id", packagesController.updatePackage);

// Toggle package status (Active/Inactive)
router.patch("/:id/toggle", packagesController.togglePackageStatus);

// Update display order for multiple packages
router.put("/display-order/update", packagesController.updateDisplayOrder);

// Delete single package
router.delete("/:id", packagesController.deletePackage);

// Bulk delete packages
router.post("/bulk-delete", packagesController.bulkDeletePackages);

module.exports = router;