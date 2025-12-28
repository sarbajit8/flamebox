import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  Package,
  DollarSign,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Star,
  Clock,
  Zap,
  Crown,
  Target,
  Activity,
  Shield,
  Sparkles,
  Loader2,
  AlertCircle,
  IndianRupee,
  Upload,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import {
  fetchAllPackages,
  createPackage,
  updatePackage,
  deletePackage,
  togglePackageStatus,
  clearError,
  clearSuccess,
} from "../../store/admin/packages-slice";
import PackageFeaturesManager from "../../components/admin/PackageFeaturesManager";
import * as XLSX from "xlsx";

const AddPackages = () => {
  const dispatch = useDispatch();
  const { packages, isLoading, error, success, message } = useSelector(
    (state) => state.packages
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPackageId, setCurrentPackageId] = useState(null);
  const [isFeaturesManagerOpen, setIsFeaturesManagerOpen] = useState(false);
  const [availableFeatures, setAvailableFeatures] = useState([]);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [bulkImportFile, setBulkImportFile] = useState(null);
  const [bulkImportData, setBulkImportData] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [validationResults, setValidationResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [packagesPerPage] = useState(10);
  const [formData, setFormData] = useState({
    packageName: "",
    packageType: "Membership",
    duration: { value: "", unit: "Months" },
    originalPrice: "",
    discountedPrice: "",
    discountType: "flat",
    freezable: false,
    sessions: "Unlimited",
    sessionCount: null,
    features: [],
    status: "Active",
    isActive: true,
    description: "",
    category: "Basic",
    amenities: {
      gymAccess: true,
      lockerRoom: true,
      basicEquipment: true,
      premiumEquipment: false,
      groupClasses: false,
      personalTrainer: false,
      nutritionPlan: false,
      sauna: false,
      steamRoom: false,
      swimmingPool: false,
      spa: false,
      dietConsultation: false,
      guestPass: false,
    },
    isFeatured: false,
    badge: "",
    popularity: 0,
    displayOrder: 0,
  });

  console.log("bulkimport data", bulkImportData);

  // Helper function to get field value from Excel data - checks multiple key variations
  const getExcelFieldValue = (pkg, ...keys) => {
    if (!pkg) return "";

    // First try direct key matches
    for (const key of keys) {
      const value = pkg[key];
      if (value !== undefined && value !== null) {
        const trimmed = String(value).trim();
        if (trimmed !== "") {
          return trimmed;
        }
      }
    }

    // Try with trimmed keys (in case column names have trailing spaces)
    const pkgKeys = Object.keys(pkg);
    for (const key of keys) {
      const trimmedKey = key.trim();
      // Find a matching key in pkg
      for (const pkgKey of pkgKeys) {
        if (pkgKey.trim() === trimmedKey) {
          const value = pkg[pkgKey];
          if (value !== undefined && value !== null) {
            const trimmed = String(value).trim();
            if (trimmed !== "") {
              return trimmed;
            }
          }
        }
      }
    }

    // Try case-insensitive matching
    for (const key of keys) {
      const normalizedKey = key.trim().toLowerCase();
      for (const pkgKey of pkgKeys) {
        if (pkgKey.trim().toLowerCase() === normalizedKey) {
          const value = pkg[pkgKey];
          if (value !== undefined && value !== null) {
            const trimmed = String(value).trim();
            if (trimmed !== "") {
              return trimmed;
            }
          }
        }
      }
    }

    return "";
  };

  // Fetch available features from backend
  const fetchFeatures = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }/api/package/features`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setAvailableFeatures(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch features:", error);
    }
  };

  // Fetch packages and features on component mount
  useEffect(() => {
    dispatch(fetchAllPackages());
    fetchFeatures();
  }, [dispatch]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "durationValue" || name === "durationUnit") {
      setFormData((prev) => ({
        ...prev,
        duration: {
          ...prev.duration,
          [name === "durationValue" ? "value" : "unit"]:
            name === "durationValue" ? parseInt(value) || "" : value,
        },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity],
      },
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const resetForm = () => {
    setFormData({
      packageName: "",
      packageType: "Membership",
      duration: { value: "", unit: "Months" },
      originalPrice: "",
      discountedPrice: "",
      discountType: "flat",
      freezable: false,
      sessions: "Unlimited",
      sessionCount: null,
      features: [],
      status: "Active",
      isActive: true,
      description: "",
      category: "Basic",
      amenities: {
        gymAccess: true,
        lockerRoom: true,
        basicEquipment: true,
        premiumEquipment: false,
        groupClasses: false,
        personalTrainer: false,
        nutritionPlan: false,
        sauna: false,
        steamRoom: false,
        swimmingPool: false,
        spa: false,
        dietConsultation: false,
        guestPass: false,
      },
      isFeatured: false,
      badge: "",
      popularity: 0,
      displayOrder: 0,
    });
    setEditMode(false);
    setCurrentPackageId(null);
  };

  const handleSubmit = async () => {
    // Validation
    if (
      !formData.packageName ||
      !formData.duration.value ||
      !formData.originalPrice ||
      !formData.discountedPrice
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      if (editMode && currentPackageId) {
        // Update existing package
        await dispatch(
          updatePackage({
            id: currentPackageId,
            updateData: formData,
          })
        ).unwrap();
      } else {
        // Create new package
        await dispatch(createPackage(formData)).unwrap();
      }

      resetForm();
      setIsDrawerOpen(false);
      dispatch(fetchAllPackages()); // Refresh list
    } catch (err) {
      console.error("Error submitting package:", err);
    }
  };

  const handleEdit = (pkg) => {
    setEditMode(true);
    setCurrentPackageId(pkg._id);

    // Calculate discount value to show in form
    let discountValueForForm;
    if (pkg.discountType === "percentage") {
      // Calculate percentage from savings
      discountValueForForm = Math.round(
        (pkg.savings / pkg.originalPrice) * 100
      );
    } else {
      // Flat discount - show the savings amount
      discountValueForForm = pkg.savings;
    }

    setFormData({
      packageName: pkg.packageName,
      packageType: pkg.packageType,
      duration: pkg.duration,
      originalPrice: pkg.originalPrice,
      discountedPrice: discountValueForForm,
      discountType: pkg.discountType || "flat",
      freezable: pkg.freezable || false,
      sessions: pkg.sessions,
      sessionCount: pkg.sessionCount,
      features: pkg.features || [],
      status: pkg.status,
      isActive: pkg.isActive,
      description: pkg.description,
      category: pkg.category,
      amenities: pkg.amenities || {
        gymAccess: true,
        lockerRoom: true,
        basicEquipment: true,
        premiumEquipment: false,
        groupClasses: false,
        personalTrainer: false,
        nutritionPlan: false,
        sauna: false,
        steamRoom: false,
        swimmingPool: false,
        spa: false,
        dietConsultation: false,
        guestPass: false,
      },
      isFeatured: pkg.isFeatured || false,
      badge: pkg.badge || "",
      popularity: pkg.popularity || 0,
      displayOrder: pkg.displayOrder || 0,
    });
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await dispatch(deletePackage(id)).unwrap();
        dispatch(fetchAllPackages()); // Refresh list
      } catch (err) {
        console.error("Error deleting package:", err);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await dispatch(togglePackageStatus(id)).unwrap();
      dispatch(fetchAllPackages()); // Refresh list
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  // Bulk Import Functions
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (
      !validTypes.includes(file.type) &&
      !file.name.endsWith(".xlsx") &&
      !file.name.endsWith(".xls")
    ) {
      alert("Please select a valid Excel file (.xlsx or .xls)");
      return;
    }

    setBulkImportFile(file);

    // Read and parse Excel file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          defval: "", // Default value for empty cells
          raw: false, // Get formatted text instead of raw values
        });

        if (jsonData.length === 0) {
          alert("The Excel file is empty");
          return;
        }

        // Trim all keys and values to handle trailing spaces
        const cleanedData = jsonData.map((row, idx) => {
          const cleanRow = {};

          // Debug: Show raw keys for first row
          if (idx === 0) {
            console.log("🔍 RAW KEYS FROM EXCEL (before trimming):");
            Object.keys(row).forEach((key, i) => {
              const charCodes = [...key].map((c) => c.charCodeAt(0)).join(",");
              console.log(
                `  Raw Key ${i}: "${key}" (charCodes: ${charCodes}) = "${row[key]}"`
              );
            });
          }

          Object.keys(row).forEach((key) => {
            const cleanKey = key.trim();
            const value = row[key];
            cleanRow[cleanKey] =
              value === null || value === undefined ? "" : String(value).trim();
          });

          // Debug: Show cleaned keys for first row
          if (idx === 0) {
            console.log("✅ CLEANED KEYS (after trimming):");
            Object.keys(cleanRow).forEach((key, i) => {
              const charCodes = [...key].map((c) => c.charCodeAt(0)).join(",");
              console.log(
                `  Clean Key ${i}: "${key}" (charCodes: ${charCodes}) = "${cleanRow[key]}"`
              );
            });
          }

          return cleanRow;
        });

        console.log("📊 Parsed Excel data:", cleanedData);
        console.log("📊 First row keys:", Object.keys(cleanedData[0] || {}));
        console.log("📊 First row data:", cleanedData[0]);
        setBulkImportData(cleanedData);
        // Reset validation when new file is uploaded
        setValidationResults(null);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        alert("Error parsing Excel file. Please ensure it's a valid format.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Validate all packages before importing
  const validatePackages = () => {
    if (bulkImportData.length === 0) {
      alert("Please select a file first");
      return;
    }

    setIsValidating(true);
    const validationErrors = [];
    const validPackages = [];

    const validPackageTypes = [
      "Membership",
      "Personal Training",
      "Group Classes",
      "Classes", // Added to support your Excel format
      "Day Pass",
      "Corporate",
      "Special",
    ];
    const validCategories = ["Basic", "Premium", "VIP", "Custom"];
    const validDurationUnits = ["Days", "Weeks", "Months", "Years"];
    const validDiscountTypes = ["flat", "percentage"];
    const validStatuses = ["Active", "Inactive", "Coming Soon"];

    bulkImportData.forEach((pkg, index) => {
      const errors = [];
      const rowNumber = index + 1;

      // Debug: Log the package data for the first few rows
      if (index < 3) {
        console.log(`Row ${rowNumber} raw data:`, pkg);
        console.log(`Row ${rowNumber} keys:`, Object.keys(pkg));
      }

      // Use the component-level helper function for field extraction
      const getFieldValue = (...keys) => getExcelFieldValue(pkg, ...keys);

      // Required field validations
      const packageName = getFieldValue(
        "Package Name",
        "packageName",
        "name",
        "Name"
      );
      if (!packageName || String(packageName).trim() === "") {
        errors.push("Package Name is required");
      }

      const packageType = getFieldValue(
        "Package Type",
        "packageType",
        "type",
        "Type"
      );
      if (!packageType || String(packageType).trim() === "") {
        errors.push("Package Type is required");
      } else if (!validPackageTypes.includes(String(packageType).trim())) {
        errors.push(
          `Invalid Package Type "${packageType}". Must be one of: ${validPackageTypes.join(
            ", "
          )}`
        );
      }

      const packageCategory = getFieldValue(
        "Package Category",
        "category",
        "packageCategory",
        "Category"
      );
      if (!packageCategory || String(packageCategory).trim() === "") {
        errors.push("Package Category is required");
      } else if (!validCategories.includes(String(packageCategory).trim())) {
        errors.push(
          `Invalid Category "${packageCategory}". Must be one of: ${validCategories.join(
            ", "
          )}`
        );
      }

      // Duration value - handle multiple column name variations
      // Also check for Sessions as an alternative for class-based packages

      // Find the actual duration keys by searching all keys
      const allKeys = Object.keys(pkg);

      // Debug: Show what we're working with for first few rows
      if (index < 3) {
        console.log(`\n🔍 Row ${rowNumber} - SEARCHING FOR DURATION:`);
        console.log(`  Total keys in pkg:`, allKeys.length);
        console.log(`  All keys:`, allKeys);

        // Show duration-related keys
        const durationKeys = allKeys.filter((k) =>
          k.toLowerCase().includes("duration")
        );
        console.log(`  Duration-related keys:`, durationKeys);
        durationKeys.forEach((k) => {
          console.log(`    "${k}" = "${pkg[k]}"`);
        });
      }

      // Try to find duration value key (case-insensitive, flexible matching)
      let durationValueKey = allKeys.find((k) => {
        const normalized = k.toLowerCase().replace(/\s+/g, " ").trim();
        return (
          normalized === "duration value" ||
          normalized === "durationvalue" ||
          normalized === "duration_value"
        );
      });

      // Try to find duration unit key
      let durationUnitKey = allKeys.find((k) => {
        const normalized = k.toLowerCase().replace(/\s+/g, " ").trim();
        return (
          normalized === "duration unit" ||
          normalized === "durationunit" ||
          normalized === "duration_unit"
        );
      });

      // Debug: Show what keys we found
      if (index < 3) {
        console.log(`  ✅ Found durationValueKey: "${durationValueKey}"`);
        console.log(`  ✅ Found durationUnitKey: "${durationUnitKey}"`);
        if (durationValueKey) {
          console.log(`  📌 Duration value: "${pkg[durationValueKey]}"`);
        }
        if (durationUnitKey) {
          console.log(`  📌 Duration unit: "${pkg[durationUnitKey]}"`);
        }
      }

      let durationValueRaw = durationValueKey ? pkg[durationValueKey] : "";
      let durationUnit = durationUnitKey ? pkg[durationUnitKey] : "";

      // Debug: Log final values
      if (index < 3) {
        console.log(`  ✅ Final durationValueRaw: "${durationValueRaw}"`);
        console.log(`  ✅ Final durationUnit: "${durationUnit}"`);
      }

      const sessionsRaw = getFieldValue(
        "Sessions",
        "Session Count",
        "SessionCount",
        "sessions",
        "session_count"
      );

      const durationValue = parseInt(durationValueRaw);
      const sessionsValue = parseInt(sessionsRaw);

      // Check if duration or sessions is provided
      const hasDuration =
        durationValueRaw && !isNaN(durationValue) && durationValue > 0;
      const hasSessions =
        sessionsRaw && !isNaN(sessionsValue) && sessionsValue > 0;

      // Debug: Log hasDuration check for first few rows
      if (index < 3) {
        console.log(`Row ${rowNumber} - hasDuration check:`, {
          durationValueRaw,
          durationValue,
          isNaN: isNaN(durationValue),
          hasDuration,
        });
      }

      // If neither duration nor sessions provided, we'll use defaults (1 Month)
      // This is a WARNING, not an error - we'll apply defaults during import
      if (!hasDuration && !hasSessions) {
        // Not an error - will use default of 1 Month during import
        console.log(
          `Row ${rowNumber}: No duration/sessions specified, will use default (1 Month)`
        );
      }

      // Validate duration unit if we have a duration value
      if (!durationUnit && hasDuration) {
        // Try fallback methods if the dynamic search didn't find it
        durationUnit = getFieldValue(
          "Duration unit",
          "Duration Unit",
          "Duration_unit",
          "Durationunit",
          "durationUnit",
          "duration_unit",
          "unit",
          "Unit"
        );
      }

      // Debug: Log duration unit for first few rows
      if (index < 3) {
        console.log(`Row ${rowNumber} - Final Duration unit:`, durationUnit);
      }

      // Duration unit validation only if duration value is provided
      if (
        hasDuration &&
        (!durationUnit || String(durationUnit).trim() === "")
      ) {
        errors.push(
          "Duration unit is required when Duration value is provided"
        );
      } else if (
        durationUnit &&
        !validDurationUnits.includes(String(durationUnit).trim())
      ) {
        errors.push(
          `Invalid Duration unit "${durationUnit}". Must be one of: ${validDurationUnits.join(
            ", "
          )}`
        );
      }

      const originalPrice = parseFloat(
        String(
          getFieldValue("Original Price", "originalPrice", "price", "Price") ||
            0
        ).replace(/,/g, "")
      );
      if (!originalPrice || isNaN(originalPrice) || originalPrice <= 0) {
        errors.push("Original Price must be a positive number");
      }

      const discountType = String(
        getFieldValue(
          "Discount Type",
          "discountType",
          "discount_type",
          "type"
        ) || "flat"
      ).toLowerCase();
      if (!validDiscountTypes.includes(discountType)) {
        errors.push(
          `Invalid Discount Type. Must be one of: ${validDiscountTypes.join(
            ", "
          )}`
        );
      }

      const discountValue = parseFloat(
        String(
          getFieldValue(
            "Discount Value",
            "discountValue",
            "discount_value",
            "discount"
          ) || 0
        ).replace(/,/g, "")
      );
      if (isNaN(discountValue) || discountValue < 0) {
        errors.push("Discount Value must be a non-negative number");
      }

      // Validate discount percentage doesn't exceed 100%
      if (discountType === "percentage" && discountValue > 100) {
        errors.push("Percentage discount cannot exceed 100%");
      }

      // Validate flat discount doesn't exceed original price
      if (
        discountType === "flat" &&
        discountValue > 0 &&
        discountValue < originalPrice
      ) {
        // Check if it's meant to be a discount amount or final price
        const potentialFinalPrice = discountValue;
        const potentialDiscount = originalPrice - discountValue;
        // If discount value is very close to original price, it's likely the final price
        if (potentialFinalPrice > originalPrice * 0.5) {
          // Likely a final price - check if it makes sense
          if (potentialFinalPrice >= originalPrice) {
            errors.push(
              "Flat discount: final price cannot be >= original price"
            );
          }
        }
      }

      const packageStatus =
        getFieldValue("Package Status", "packageStatus", "status", "Status") ||
        "Active";
      if (!validStatuses.includes(packageStatus)) {
        errors.push(
          `Invalid Package Status. Must be one of: ${validStatuses.join(", ")}`
        );
      }

      const freezable = getFieldValue(
        "Freezable",
        "Freezable ",
        "freezable",
        "freeze",
        "Freeze"
      );
      if (
        freezable &&
        !["Yes", "No", "yes", "no", "true", "false", "YES", "NO"].includes(
          freezable
        )
      ) {
        errors.push("Freezable must be Yes, No, true, or false");
      }

      if (errors.length > 0) {
        validationErrors.push({
          row: rowNumber,
          packageName: packageName || "Unknown",
          errors: errors,
          data: pkg,
        });
      } else {
        validPackages.push({
          row: rowNumber,
          packageName: packageName,
          data: pkg,
        });
      }
    });

    setValidationResults({
      total: bulkImportData.length,
      valid: validPackages.length,
      invalid: validationErrors.length,
      validPackages: validPackages,
      invalidPackages: validationErrors,
    });

    setIsValidating(false);

    // Scroll to validation results
    setTimeout(() => {
      const validationSection = document.getElementById("validation-results");
      if (validationSection) {
        validationSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const handleBulkImport = async () => {
    if (bulkImportData.length === 0) {
      alert("Please select a file first");
      return;
    }

    // Check if validation has been done
    if (!validationResults) {
      alert(
        "Please validate the data first by clicking 'Validate Data' button"
      );
      return;
    }

    // Check if there are any invalid packages
    if (validationResults.invalid > 0) {
      const confirmImport = window.confirm(
        `There are ${validationResults.invalid} invalid packages. Do you want to import only the ${validationResults.valid} valid packages?`
      );
      if (!confirmImport) {
        return;
      }
    }

    setIsImporting(true);
    setImportResults(null);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }/api/packages/import/bulk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ packages: bulkImportData }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setImportResults(result);
        dispatch(fetchAllPackages()); // Refresh packages list

        // Show success message
        setTimeout(() => {
          if (result.summary.failed === 0) {
            alert(
              `Successfully imported all ${result.summary.successful} packages!`
            );
            setIsBulkImportOpen(false);
            setBulkImportFile(null);
            setBulkImportData([]);
            setImportResults(null);
          }
        }, 500);
      } else {
        alert("Import failed: " + result.message);
      }
    } catch (error) {
      console.error("Error importing packages:", error);
      alert("Error importing packages. Please try again.");
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }/api/packages/import/template`,
        {
          credentials: "include",
        }
      );
      const result = await response.json();

      if (result.success) {
        // Create Excel from template
        const worksheet = XLSX.utils.json_to_sheet(result.template);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Packages");

        // Add instructions sheet
        const instructionsData = Object.entries(result.instructions).map(
          ([field, instruction]) => ({
            Field: field,
            Instruction: instruction,
          })
        );
        const instructionsSheet = XLSX.utils.json_to_sheet(instructionsData);
        XLSX.utils.book_append_sheet(
          workbook,
          instructionsSheet,
          "Instructions"
        );

        // Download file
        XLSX.writeFile(workbook, "Package_Import_Template.xlsx");
      }
    } catch (error) {
      console.error("Error downloading template:", error);
      alert("Error downloading template. Please try again.");
    }
  };

  const downloadDemoTemplate = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    const demoUrl = `${apiUrl}/public/Package_Import_Demo_Template.xlsx`;

    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = demoUrl;
    link.download = "Package_Import_Demo_Template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "VIP":
        return "bg-gradient-to-r from-purple-600 to-pink-600";
      case "Premium":
        return "bg-gradient-to-r from-red-600 to-red-700";
      case "Training":
        return "bg-gradient-to-r from-blue-600 to-blue-700";
      case "Class":
        return "bg-gradient-to-r from-green-600 to-green-700";
      case "Group":
        return "bg-gradient-to-r from-orange-600 to-orange-700";
      default:
        return "bg-gradient-to-r from-gray-600 to-gray-700";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "VIP":
        return <Crown className="w-4 h-4" />;
      case "Premium":
        return <Sparkles className="w-4 h-4" />;
      case "Training":
        return <Target className="w-4 h-4" />;
      case "Class":
        return <Users className="w-4 h-4" />;
      case "Group":
        return <Activity className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Membership":
        return "bg-blue-600/20 text-blue-400 border-blue-500/30";
      case "Personal Training":
        return "bg-green-600/20 text-green-400 border-green-500/30";
      case "Group Classes":
        return "bg-purple-600/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-gray-600/20 text-gray-400 border-gray-500/30";
    }
  };

  // Calculate stats
  const stats = {
    total: packages.length,
    active: packages.filter((p) => p.isActive && p.status === "Active").length,
    membership: packages.filter((p) => p.packageType === "Membership").length,
    training: packages.filter((p) => p.packageType === "Personal Training")
      .length,
  };

  // Filter and search packages
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || pkg.category === filterCategory;
    const matchesType = filterType === "All" || pkg.packageType === filterType;
    const matchesStatus = filterStatus === "All" || pkg.status === filterStatus;
    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  // Pagination
  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentPackages = filteredPackages.slice(
    indexOfFirstPackage,
    indexOfLastPackage
  );
  const totalPages = Math.ceil(filteredPackages.length / packagesPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory, filterType, filterStatus]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading && packages.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading Packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2 sm:p-2 lg:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Gym Packages
            </h1>
            <p className="text-gray-400 text-sm">
              Manage membership plans and service packages
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsFeaturesManagerOpen(true)}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
            >
              <Package className="w-4 h-4" />
              Package Features
            </button>
            <button
              onClick={() => setIsBulkImportOpen(true)}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Bulk Import
            </button>
            <button
              onClick={() => {
                resetForm();
                setIsDrawerOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              Add Package
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && message && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-500 font-semibold">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-500 font-semibold">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Packages</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Active Packages</p>
                <p className="text-3xl font-bold text-white">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Membership Plans</p>
                <p className="text-3xl font-bold text-white">
                  {stats.membership}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Training Packages</p>
                <p className="text-3xl font-bold text-white">
                  {stats.training}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        {packages.length > 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Search Packages
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or description..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="All">All Categories</option>
                  <option value="Basic">Basic</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="All">All Types</option>
                  <option value="Membership">Membership</option>
                  <option value="Personal Training">Personal Training</option>
                  <option value="Group Classes">Group Classes</option>
                  <option value="Day Pass">Day Pass</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Special">Special</option>
                </select>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <p className="text-gray-400">
                Showing {currentPackages.length} of {filteredPackages.length}{" "}
                packages
                {searchQuery && ` (filtered from ${packages.length} total)`}
              </p>
              {(searchQuery ||
                filterCategory !== "All" ||
                filterType !== "All") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterCategory("All");
                    setFilterType("All");
                    setFilterStatus("All");
                  }}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Packages Grid */}
        {packages.length > 0 ? (
          <>
            {currentPackages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
                {currentPackages.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
                  >
                    {/* Package Header */}
                    <div
                      className={`p-3 text-white ${getCategoryColor(
                        pkg.category
                      )}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                          {getCategoryIcon(pkg.category)}
                          <span className="text-xs font-semibold uppercase tracking-wide">
                            {pkg.category}
                          </span>
                        </div>
                        <button
                          onClick={() => handleToggleStatus(pkg._id)}
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                            pkg.isActive && pkg.status === "Active"
                              ? "bg-green-500/20 text-green-200 hover:bg-green-500/30"
                              : "bg-gray-500/20 text-gray-200 hover:bg-gray-500/30"
                          }`}
                        >
                          {pkg.status}
                        </button>
                      </div>
                      <h3 className="text-sm font-bold mb-0.5 truncate">
                        {pkg.packageName}
                      </h3>
                      <p className="text-white/80 text-xs line-clamp-2">
                        {pkg.description}
                      </p>
                    </div>

                    {/* Package Body */}
                    <div className="p-3">
                      {/* Price */}
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        <div className="text-lg font-bold text-white">
                          ₹{pkg.originalPrice}
                        </div>
                        {pkg.savings > 0 && (
                          <div className="px-1.5 py-0.5 bg-green-600/20 text-green-400 rounded text-[10px] font-semibold">
                            Max Discount:{" "}
                            {pkg.discountType === "percentage"
                              ? `${Math.round(
                                  (pkg.savings / pkg.originalPrice) * 100
                                )}%`
                              : `₹${pkg.savings}`}
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Duration
                          </span>
                          <span className="text-white font-medium text-[11px]">
                            {pkg.duration.value} {pkg.duration.unit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Sessions
                          </span>
                          <span className="text-white font-medium text-[11px]">
                            {pkg.sessions}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Type</span>
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${getTypeColor(
                              pkg.packageType
                            )}`}
                          >
                            {pkg.packageType}
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      {pkg.features && pkg.features.length > 0 && (
                        <div className="mb-2">
                          <h4 className="text-xs font-semibold text-gray-300 mb-1">
                            Features:
                          </h4>
                          <div className="space-y-0.5">
                            {pkg.features.slice(0, 2).map((feature, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-1 text-[11px] text-gray-300"
                              >
                                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                <span className="truncate">{feature}</span>
                              </div>
                            ))}
                            {pkg.features.length > 2 && (
                              <div className="text-[10px] text-gray-500">
                                +{pkg.features.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 pt-2 border-t border-gray-700">
                        <button
                          onClick={() => handleEdit(pkg)}
                          className="flex-1 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(pkg._id)}
                          className="px-2 py-1.5 bg-gray-700 hover:bg-red-600 text-white rounded text-xs font-semibold transition-colors"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* No Results */
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center mb-8">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No packages found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterCategory("All");
                    setFilterType("All");
                    setFilterStatus("All");
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mb-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            currentPage === pageNumber
                              ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white"
                              : "bg-gray-800 border border-gray-700 text-white hover:bg-gray-700"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return (
                        <span key={pageNumber} className="text-gray-500 px-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No Packages Yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first gym package to get started
            </p>
            <button
              onClick={() => {
                resetForm();
                setIsDrawerOpen(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              Create Package
            </button>
          </div>
        )}
      </div>

      {/* Slide-out Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setIsDrawerOpen(false);
            resetForm();
          }}
        />

        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-full sm:w-[600px] bg-gray-800 border-l border-gray-700 shadow-2xl transition-transform duration-300 ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-red-600 to-red-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editMode ? "Edit Package" : "Create New Package"}
                </h2>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Package Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Package className="w-4 h-4 inline mr-2" />
                  Package Name *
                </label>
                <input
                  type="text"
                  name="packageName"
                  value={formData.packageName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Premium Membership, Personal Training"
                />
              </div>

              {/* Package Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Package Type *
                </label>
                <select
                  name="packageType"
                  value={formData.packageType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Membership">Membership</option>
                  <option value="Personal Training">Personal Training</option>
                  <option value="Group Classes">Group Classes</option>
                  <option value="Day Pass">Day Pass</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Special">Special Offer</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Star className="w-4 h-4 inline mr-2" />
                  Package Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Basic">Basic</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe the package benefits and features..."
                />
              </div>

              {/* Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Duration *
                  </label>
                  <input
                    type="number"
                    name="durationValue"
                    value={formData.duration.value}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 6, 12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-7"></label>
                  <select
                    name="durationUnit"
                    value={formData.duration.unit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                    <option value="Months">Months</option>
                    <option value="Years">Years</option>
                  </select>
                </div>
              </div>

              {/* Sessions */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Zap className="w-4 h-4 inline mr-2" />
                  Sessions
                </label>
                <input
                  type="text"
                  name="sessions"
                  value={formData.sessions}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Unlimited, 12 Sessions"
                />
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <IndianRupee className="w-4 h-4 inline mr-2" />
                    Original Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="1440"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Discount Value{" "}
                    {formData.discountType === "percentage" ? "(%)" : "(₹)"} *
                  </label>
                  <input
                    type="number"
                    name="discountedPrice"
                    value={formData.discountedPrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={
                      formData.discountType === "percentage" ? "20" : "1200"
                    }
                  />
                </div>
              </div>

              {/* Discount Type & Freezable */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Discount Type *
                  </label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="flat">Flat Amount</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Freezable *
                  </label>
                  <select
                    name="freezable"
                    value={formData.freezable}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        freezable: e.target.value === "true",
                      }))
                    }
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Package Features
                </label>
                <div className="space-y-3">
                  <select
                    onChange={(e) => {
                      const selectedFeature = e.target.value;
                      if (
                        selectedFeature &&
                        !formData.features.includes(selectedFeature)
                      ) {
                        setFormData((prev) => ({
                          ...prev,
                          features: [...prev.features, selectedFeature],
                        }));
                      }
                      e.target.value = ""; // Reset selection
                    }}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                        '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 10L12 15L17 10H7Z" fill="white"/></svg>'
                      )}")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      backgroundSize: "16px",
                      paddingRight: "40px",
                    }}
                  >
                    <option value="">Select a feature to add...</option>
                    {availableFeatures
                      .filter(
                        (feature) => !formData.features.includes(feature.name)
                      )
                      .map((feature) => (
                        <option key={feature._id} value={feature.name}>
                          {feature.name}
                        </option>
                      ))}
                  </select>

                  {/* Selected Features */}
                  {formData.features.length > 0 && (
                    <div className="bg-gray-700/50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-2">
                        Selected Features:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.features.map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600/20 text-purple-300 text-sm rounded-full border border-purple-500/30"
                          >
                            {feature}
                            <button
                              type="button"
                              onClick={() => handleFeatureToggle(feature)}
                              className="ml-1 text-purple-400 hover:text-red-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Featured */}
              <div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Package Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Coming Soon">Coming Soon</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {editMode ? "Updating..." : "Creating..."}
                    </>
                  ) : editMode ? (
                    "Update Package"
                  ) : (
                    "Create Package"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Package Features Manager Modal */}
      <PackageFeaturesManager
        isOpen={isFeaturesManagerOpen}
        onClose={() => {
          setIsFeaturesManagerOpen(false);
          fetchFeatures(); // Refresh features when closing
        }}
      />

      {/* Bulk Import Modal */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isBulkImportOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => {
            if (!isImporting) {
              setIsBulkImportOpen(false);
              setBulkImportFile(null);
              setBulkImportData([]);
              setImportResults(null);
            }
          }}
        />

        {/* Modal */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-gray-800 border border-gray-700 shadow-2xl rounded-xl">
          <div className="flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-green-600 to-green-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-white" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Bulk Import Packages
                    </h2>
                    <p className="text-green-100 text-sm">
                      Import multiple packages from Excel file
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!isImporting) {
                      setIsBulkImportOpen(false);
                      setBulkImportFile(null);
                      setBulkImportData([]);
                      setImportResults(null);
                    }
                  }}
                  disabled={isImporting}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Instructions */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Instructions
                </h3>
                <ul className="text-blue-300 text-sm space-y-1 ml-7">
                  <li>
                    • Download the <strong>Demo Template</strong> to see real
                    examples with 16 sample packages
                  </li>
                  <li>
                    • Or download the <strong>Blank Template</strong> to start
                    fresh
                  </li>
                  <li>• Fill in the package details following the format</li>
                  <li>
                    • Both templates include an Instructions sheet with field
                    descriptions
                  </li>
                  <li>
                    • Maximum file size: 60MB (for images, uploaded separately)
                  </li>
                  <li>• Upload your completed Excel file</li>
                  <li>• Click "Import Packages" to start the import</li>
                </ul>
              </div>

              {/* Download Template Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={downloadDemoTemplate}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FileSpreadsheet className="w-5 h-5" />
                  Download Demo with Samples
                </button>
                <button
                  onClick={downloadTemplate}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Blank Template
                </button>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="bulk-import-file"
                  disabled={isImporting}
                />
                <label
                  htmlFor="bulk-import-file"
                  className="cursor-pointer block"
                >
                  <Upload className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-white font-semibold mb-2">
                    {bulkImportFile
                      ? `Selected: ${bulkImportFile.name}`
                      : "Click to upload Excel file"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    or drag and drop your file here
                  </p>
                </label>
              </div>

              {/* Preview Data */}
              {bulkImportData.length > 0 && (
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-green-400" />
                    Preview: {bulkImportData.length} packages found
                  </h3>

                  {/* Show detected column names */}
                  {bulkImportData.length > 0 && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2 mb-3 text-xs">
                      <p className="text-blue-400 font-semibold mb-1">
                        Detected columns:
                      </p>
                      <p className="text-blue-300">
                        {Object.keys(bulkImportData[0]).join(", ")}
                      </p>
                    </div>
                  )}

                  <div className="max-h-60 overflow-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-800 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left text-gray-300">
                            #
                          </th>
                          <th className="px-3 py-2 text-left text-gray-300">
                            Package Name
                          </th>
                          <th className="px-3 py-2 text-left text-gray-300">
                            Type
                          </th>
                          <th className="px-3 py-2 text-left text-gray-300">
                            Price
                          </th>
                          <th className="px-3 py-2 text-left text-gray-300">
                            Duration
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {bulkImportData.slice(0, 10).map((pkg, index) => {
                          // Find duration keys dynamically (same logic as validation)
                          const allKeys = Object.keys(pkg);
                          const durationValueKey = allKeys.find((k) => {
                            const normalized = k
                              .toLowerCase()
                              .replace(/\s+/g, " ")
                              .trim();
                            return (
                              normalized === "duration value" ||
                              normalized === "durationvalue" ||
                              normalized === "duration_value"
                            );
                          });
                          const durationUnitKey = allKeys.find((k) => {
                            const normalized = k
                              .toLowerCase()
                              .replace(/\s+/g, " ")
                              .trim();
                            return (
                              normalized === "duration unit" ||
                              normalized === "durationunit" ||
                              normalized === "duration_unit"
                            );
                          });

                          const durationValue = durationValueKey
                            ? pkg[durationValueKey]
                            : "";
                          const durationUnit = durationUnitKey
                            ? pkg[durationUnitKey]
                            : "";

                          return (
                            <tr
                              key={index}
                              className="border-t border-gray-700"
                            >
                              <td className="px-3 py-2 text-gray-400">
                                {index + 1}
                              </td>
                              <td className="px-3 py-2 text-white">
                                {pkg["Package Name"] ||
                                  pkg.packageName ||
                                  "N/A"}
                              </td>
                              <td className="px-3 py-2 text-gray-300">
                                {pkg["Package Type"] ||
                                  pkg.packageType ||
                                  "N/A"}
                              </td>
                              <td className="px-3 py-2 text-green-400">
                                ₹
                                {pkg["Original Price"] ||
                                  pkg.originalPrice ||
                                  "N/A"}
                              </td>
                              <td className="px-3 py-2 text-gray-300">
                                {durationValue || "1"}{" "}
                                {durationUnit || "Months"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {bulkImportData.length > 10 && (
                      <p className="text-gray-400 text-xs mt-2 text-center">
                        Showing first 10 of {bulkImportData.length} packages
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Validate Button */}
              {bulkImportData.length > 0 && !importResults && (
                <div className="flex justify-center">
                  <button
                    onClick={validatePackages}
                    disabled={isValidating}
                    className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Validate Data
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Validation Results */}
              {validationResults && (
                <div
                  id="validation-results"
                  className="bg-gray-700/50 rounded-lg p-4"
                >
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-yellow-400" />
                    Validation Results
                  </h3>

                  {/* Validation Summary */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <p className="text-gray-400 text-xs mb-1">
                        Total Packages
                      </p>
                      <p className="text-white text-2xl font-bold">
                        {validationResults.total}
                      </p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                      <p className="text-green-400 text-xs mb-1">Valid</p>
                      <p className="text-green-400 text-2xl font-bold">
                        {validationResults.valid}
                      </p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                      <p className="text-red-400 text-xs mb-1">Invalid</p>
                      <p className="text-red-400 text-2xl font-bold">
                        {validationResults.invalid}
                      </p>
                    </div>
                  </div>

                  {/* Validation Message */}
                  {validationResults.invalid === 0 ? (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <p className="font-semibold">
                          All packages are valid! Ready to import.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 text-yellow-400 mb-2">
                        <AlertCircle className="w-5 h-5" />
                        <p className="font-semibold">
                          {validationResults.invalid} package(s) have errors
                        </p>
                      </div>
                      <p className="text-yellow-300 text-sm">
                        You can either fix the errors and re-upload, or import
                        only the valid packages.
                      </p>
                    </div>
                  )}

                  {/* Invalid Packages Details */}
                  {validationResults.invalid > 0 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Invalid Packages ({validationResults.invalid})
                      </h4>
                      <div className="max-h-60 overflow-auto space-y-3">
                        {validationResults.invalidPackages.map(
                          (invalid, index) => (
                            <div
                              key={index}
                              className="bg-gray-800/50 rounded-lg p-3"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="text-red-300 font-semibold">
                                    Row {invalid.row}: {invalid.packageName}
                                  </p>
                                </div>
                                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                                  {invalid.errors.length} error(s)
                                </span>
                              </div>
                              <ul className="space-y-1 ml-4">
                                {invalid.errors.map((error, errIndex) => (
                                  <li
                                    key={errIndex}
                                    className="text-red-400 text-sm flex items-start gap-2"
                                  >
                                    <span className="text-red-500 mt-1">•</span>
                                    <span>{error}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Valid Packages Summary */}
                  {validationResults.valid > 0 &&
                    validationResults.invalid > 0 && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mt-4">
                        <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Valid Packages ({validationResults.valid})
                        </h4>
                        <p className="text-green-300 text-sm">
                          These packages are ready to import:{" "}
                          {validationResults.validPackages
                            .map((v) => v.packageName)
                            .slice(0, 5)
                            .join(", ")}
                          {validationResults.valid > 5 &&
                            ` and ${validationResults.valid - 5} more...`}
                        </p>
                      </div>
                    )}
                </div>
              )}

              {/* Import Results */}
              {importResults && (
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">
                    Import Results
                  </h3>

                  {/* Summary */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <p className="text-gray-400 text-xs mb-1">Total</p>
                      <p className="text-white text-2xl font-bold">
                        {importResults.summary.total}
                      </p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                      <p className="text-green-400 text-xs mb-1">Successful</p>
                      <p className="text-green-400 text-2xl font-bold">
                        {importResults.summary.successful}
                      </p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
                      <p className="text-blue-400 text-xs mb-1">Created</p>
                      <p className="text-blue-400 text-2xl font-bold">
                        {importResults.summary.created}
                      </p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                      <p className="text-yellow-400 text-xs mb-1">Updated</p>
                      <p className="text-yellow-400 text-2xl font-bold">
                        {importResults.summary.updated}
                      </p>
                    </div>
                  </div>

                  {/* Failed Records */}
                  {importResults.results.failed.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <h4 className="text-red-400 font-semibold mb-2">
                        Failed Records ({importResults.results.failed.length})
                      </h4>
                      <div className="max-h-40 overflow-auto space-y-2">
                        {importResults.results.failed.map((failure, index) => (
                          <div key={index} className="text-sm">
                            <p className="text-red-300">
                              Row {failure.row}: {failure.packageName}
                            </p>
                            <p className="text-red-400 text-xs ml-4">
                              Error: {failure.error}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700 bg-gray-800/50">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsBulkImportOpen(false);
                    setBulkImportFile(null);
                    setBulkImportData([]);
                    setImportResults(null);
                    setValidationResults(null);
                  }}
                  disabled={isImporting}
                  className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Close
                </button>
                <button
                  onClick={handleBulkImport}
                  disabled={
                    isImporting ||
                    bulkImportData.length === 0 ||
                    !validationResults ||
                    (validationResults && validationResults.valid === 0)
                  }
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  title={
                    !validationResults
                      ? "Please validate data first"
                      : validationResults.valid === 0
                      ? "No valid packages to import"
                      : ""
                  }
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Import Packages
                      {validationResults && validationResults.valid > 0 && (
                        <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                          ({validationResults.valid})
                        </span>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPackages;
