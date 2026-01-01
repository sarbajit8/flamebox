import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  CreditCard,
  Users,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Search,
  Filter,
  Plus,
  Eye,
  MapPin,
  Heart,
  Activity,
  Clock,
  Package as PackageIcon,
  IndianRupee,
  ChevronRight,
  ChevronDown,
  Upload,
  FileSpreadsheet,
  Download,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  fetchAllMembers,
  createMember,
  updateMember,
  deleteMember,
  fetchMemberStatistics,
  fetchMemberById,
  clearError,
  clearSuccess,
} from "../../store/admin/members-slice";
import { fetchAllPackages } from "../../store/admin/packages-slice";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const Addmember = () => {
  const dispatch = useDispatch();
  const {
    members,
    isLoading,
    error,
    success,
    message,
    pagination,
    statistics,
    currentMember,
  } = useSelector((state) => state.members);
  const { packages } = useSelector((state) => state.packages);

  const [trainers, setTrainers] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [packageTypeFilter, setPackageTypeFilter] = useState("");
  const [isPaymentEditOpen, setIsPaymentEditOpen] = useState(false);
  const [isPaymentUpdating, setIsPaymentUpdating] = useState(false);
  const [paymentEditData, setPaymentEditData] = useState({
    amountPaid: 0,
    paymentStatus: "Pending",
  });
  const [originalMemberData, setOriginalMemberData] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage, setMembersPerPage] = useState(50);

  // Renew package states
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [renewPackageList, setRenewPackageList] = useState([]);
  const [selectedRenewPackage, setSelectedRenewPackage] = useState(null);
  const [isRenewFormOpen, setIsRenewFormOpen] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);
  const [renewFormData, setRenewFormData] = useState({
    startDate: "",
    endDate: "",
    amount: "",
    discount: 0,
    totalPaid: 0,
    totalPending: 0,
    paymentDate: "",
    paymentStatus: "Paid",
    paymentMethod: "Cash",
    transactionId: "",
  });

  // Upgrade package states
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedUpgradePackage, setSelectedUpgradePackage] = useState(null);
  const [selectedOldPackage, setSelectedOldPackage] = useState(null);
  const [oldPackageAction, setOldPackageAction] = useState("expire");
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeFormData, setUpgradeFormData] = useState({
    startDate: "",
    endDate: "",
    amount: "",
    discount: 0,
    totalPaid: 0,
    totalPending: 0,
    paymentDate: "",
    paymentStatus: "Paid",
    paymentMethod: "Cash",
    transactionId: "",
  });

  // Freeze package states
  const [isFreezeSelectionModalOpen, setIsFreezeSelectionModalOpen] =
    useState(false);
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
  const [selectedFreezePackage, setSelectedFreezePackage] = useState(null);
  const [freezeStartDate, setFreezeStartDate] = useState("");
  const [freezeEndDate, setFreezeEndDate] = useState("");
  const [isFreezing, setIsFreezing] = useState(false);

  // Extension package states
  const [isExtensionSelectionModalOpen, setIsExtensionSelectionModalOpen] =
    useState(false);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [selectedExtensionPackage, setSelectedExtensionPackage] =
    useState(null);
  const [extensionDays, setExtensionDays] = useState("");
  const [addExtraAmount, setAddExtraAmount] = useState(false);
  const [extensionAmount, setExtensionAmount] = useState("");
  const [extensionPaid, setExtensionPaid] = useState("");
  const [isExtending, setIsExtending] = useState(false);

  // Edit package start date states
  const [isEditStartDateModalOpen, setIsEditStartDateModalOpen] =
    useState(false);
  const [editingStartDatePackageId, setEditingStartDatePackageId] =
    useState(null);
  const [editingPackageName, setEditingPackageName] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [isUpdatingStartDate, setIsUpdatingStartDate] = useState(false);

  // Expanded packages state for collapse/expand
  const [expandedPackages, setExpandedPackages] = useState(new Set());

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // File upload states
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [documentFiles, setDocumentFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Bulk Import States
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [bulkImportFile, setBulkImportFile] = useState(null);
  const [bulkImportData, setBulkImportData] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [validationResults, setValidationResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const [formData, setFormData] = useState({
    registrationNumber: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    alternatePhone: "",
    dateOfBirth: "",
    gender: "Male",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    vaccinationStatus: "Not Vaccinated",
    bloodGroup: "Unknown",
    salesRepresentative: "",
    notes: "",
    joiningDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    packages: [],
    totalPaid: 0,
    totalPending: 0,
    paymentDate: "",
    assignedTrainer: "",
    photo: "",
    documents: [],
  });

  // Package form for adding packages to member
  const [packageFormData, setPackageFormData] = useState({
    packageId: "",
    startDate: "",
    endDate: "",
    amount: "",
    discount: 0,
    totalPaid: 0,
    totalPending: 0,
    paymentDate: "",
    paymentStatus: "Paid",
    paymentMethod: "Cash",
    transactionId: "",
    isPrimary: false,
  });

  // Fetch members and packages on component mount
  useEffect(() => {
    dispatch(fetchAllMembers({ page: currentPage, limit: membersPerPage }));
    dispatch(fetchMemberStatistics());
    dispatch(fetchAllPackages());

    // Fetch trainers from User model (not Employee)
    fetch(
      `${
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
      }/api/auth/users/all`,
      {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const trainersList = (data.users || []).filter(
            (user) => user.role === "trainer"
          );
          setTrainers(trainersList);
          console.log("Trainers fetched from Users:", trainersList);
        }
      })
      .catch((err) => console.error("Failed to fetch trainers:", err));
  }, [dispatch, currentPage, membersPerPage]);

  // Helper function to get Excel field value
  const getExcelFieldValue = (pkg, ...keys) => {
    if (!pkg) return "";
    const allKeys = Object.keys(pkg);

    // Try direct key match first
    for (const key of keys) {
      const value = pkg[key];
      if (value !== undefined && value !== null) {
        const trimmed = String(value).trim();
        if (trimmed !== "") return trimmed;
      }
    }

    // Try case-insensitive match
    const foundKey = allKeys.find((k) => {
      const normalized = k.toLowerCase().replace(/\s+/g, " ").trim();
      return keys.some(
        (searchKey) =>
          normalized === searchKey.toLowerCase().replace(/\s+/g, " ").trim()
      );
    });

    return foundKey ? pkg[foundKey] : "";
  };

  // Handle success/error messages
  useEffect(() => {
    if (success) {
      toast.success(message || "Operation successful!");
      dispatch(clearSuccess());
      setIsDrawerOpen(false);
      resetForm();
      dispatch(fetchAllMembers({ page: currentPage, limit: membersPerPage }));
      dispatch(fetchMemberStatistics());
    }
  }, [success, message, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error || "An error occurred");
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Update selectedMember when currentMember changes (for auto-refresh in details modal)
  useEffect(() => {
    if (
      currentMember &&
      selectedMember &&
      currentMember._id === selectedMember._id
    ) {
      setSelectedMember(currentMember);
    }
  }, [currentMember]);

  const resetForm = () => {
    setCurrentStep(1); // Reset to step 1
    setFormData({
      registrationNumber: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      alternatePhone: "",
      dateOfBirth: "",
      gender: "Male",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
      },
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
      vaccinationStatus: "Not Vaccinated",
      bloodGroup: "Unknown",
      salesRepresentative: "",
      notes: "",
      packages: [],
      totalPaid: 0,
      totalPending: 0,
      paymentDate: "",
      assignedTrainer: "",
      photo: "",
      documents: [],
    });
    setPackageFormData({
      packageId: "",
      startDate: "",
      endDate: "",
      amount: "",
      discount: 0,
      totalPaid: 0,
      totalPending: 0,
      paymentDate: "",
      paymentStatus: "Paid",
      paymentMethod: "Cash",
      transactionId: "",
      isPrimary: false,
    });
    setProfilePicFile(null);
    setProfilePicPreview("");
    setDocumentFiles([]);
    setEditMode(false);
    setCurrentMemberId(null);
  };

  // Helper function to format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDateForDisplay = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper function to parse display dates (DD/MM/YYYY or YYYY-MM-DD) to YYYY-MM-DD for storage
  const parseDateFromDisplay = (displayDate) => {
    if (!displayDate) return "";
    // If already in ISO-like YYYY-MM-DD, return as-is (trim time portion if present)
    const isoMatch = displayDate.match(/^\d{4}-\d{2}-\d{2}/);
    if (isoMatch) return isoMatch[0];

    // If in DD/MM/YYYY format, convert to YYYY-MM-DD
    if (displayDate.includes("/")) {
      const parts = displayDate.split("/");
      if (parts.length !== 3) return "";
      const [day, month, year] = parts;
      if (day.length !== 2 || month.length !== 2 || year.length !== 4)
        return "";
      return `${year}-${month}-${day}`;
    }

    // As a fallback, try to parse with Date and return YYYY-MM-DD
    const d = new Date(displayDate);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split("T")[0];
    }
    return "";
  };

  // Helper function to convert DD/MM/YYYY dates to ISO format for database
  const convertDatesToISO = (data) => {
    const convertedData = { ...data };

    // Convert main date fields
    if (convertedData.dateOfBirth) {
      const isoDate = parseDateFromDisplay(convertedData.dateOfBirth);
      // Convert YYYY-MM-DD to full ISO DateTime
      if (isoDate && isoDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        convertedData.dateOfBirth = new Date(isoDate).toISOString();
      } else {
        convertedData.dateOfBirth = isoDate || null;
      }
    }

    if (convertedData.joiningDate) {
      const isoDate = parseDateFromDisplay(convertedData.joiningDate);
      // Convert YYYY-MM-DD to full ISO DateTime
      if (isoDate && isoDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        convertedData.joiningDate = new Date(isoDate).toISOString();
      } else {
        convertedData.joiningDate = new Date().toISOString();
      }
    }

    if (convertedData.dueDate) {
      const isoDate = parseDateFromDisplay(convertedData.dueDate);
      // Convert YYYY-MM-DD to full ISO DateTime
      if (isoDate && isoDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        convertedData.dueDate = new Date(isoDate).toISOString();
      } else {
        convertedData.dueDate = isoDate || null;
      }
    }

    // Normalize empty dueDate to null so backend stores empty instead of empty string
    if (!convertedData.dueDate) {
      convertedData.dueDate = null;
    }

    if (convertedData.paymentDate) {
      const isoDate = parseDateFromDisplay(convertedData.paymentDate);
      // Convert YYYY-MM-DD to full ISO DateTime
      if (isoDate && isoDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        convertedData.paymentDate = new Date(isoDate).toISOString();
      } else {
        convertedData.paymentDate = isoDate || null;
      }
    }

    // Convert package dates
    if (convertedData.packages && Array.isArray(convertedData.packages)) {
      convertedData.packages = convertedData.packages.map((pkg) => ({
        ...pkg,
        startDate: pkg.startDate
          ? parseDateFromDisplay(pkg.startDate) || pkg.startDate
          : null,
        endDate: pkg.endDate
          ? parseDateFromDisplay(pkg.endDate) || pkg.endDate
          : null,
        paymentDate: pkg.paymentDate
          ? parseDateFromDisplay(pkg.paymentDate) || pkg.paymentDate
          : null,
      }));
    }

    return convertedData;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle date inputs - store YYYY-MM-DD directly (date inputs use ISO)
    if (
      name === "dateOfBirth" ||
      name === "joiningDate" ||
      name === "dueDate"
    ) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Calculate end date based on start date and package duration
  const calculateEndDate = (startDate, packageId) => {
    if (!startDate || !packageId) return "";

    const selectedPackage = packages.find((pkg) => pkg._id === packageId);
    if (!selectedPackage || !selectedPackage.duration) return "";

    // Accept either DD/MM/YYYY or YYYY-MM-DD (from date input)
    let start = null;
    if (startDate.includes("/")) {
      const dateParts = startDate.split("/");
      if (dateParts.length !== 3) return "";
      const [day, month, year] = dateParts;
      start = new Date(year, month - 1, day);
    } else if (startDate.includes("-")) {
      const parts = startDate.split("-");
      if (parts.length < 3) return "";
      const [year, month, day] = parts;
      start = new Date(year, month - 1, day);
    } else {
      const d = new Date(startDate);
      if (isNaN(d.getTime())) return "";
      start = d;
    }

    const { value, unit } = selectedPackage.duration;

    let endDate = new Date(start);

    switch (unit) {
      case "Days":
        endDate.setDate(endDate.getDate() + value);
        break;
      case "Weeks":
        endDate.setDate(endDate.getDate() + value * 7);
        break;
      case "Months":
        endDate.setMonth(endDate.getMonth() + value);
        break;
      case "Years":
        endDate.setFullYear(endDate.getFullYear() + value);
        break;
      default:
        return "";
    }

    // Return end date as YYYY-MM-DD for use in date inputs
    const endDay = String(endDate.getDate()).padStart(2, "0");
    const endMonth = String(endDate.getMonth() + 1).padStart(2, "0");
    const endYear = endDate.getFullYear();
    return `${endYear}-${endMonth}-${endDay}`;
  };

  const handlePackageInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle date inputs - store YYYY-MM-DD directly
    if (name === "startDate" || name === "paymentDate") {
      setPackageFormData((prev) => {
        const updated = {
          ...prev,
          [name]: value,
        };

        // Auto-calculate end date when start date changes
        if (name === "startDate" && updated.packageId && value) {
          updated.endDate = calculateEndDate(value, updated.packageId);
        }

        return updated;
      });
      return;
    }

    setPackageFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // Validate discount against maxDiscount for percentage type
      if (name === "discount" && value) {
        const discountValue = parseFloat(value);
        const maxDiscount = prev.maxDiscount || 0;
        const discountType = prev.discountType || "flat";

        if (discountType === "percentage" && discountValue > maxDiscount) {
          toast.error(
            `Discount cannot exceed ${maxDiscount}% for this package`
          );
          updated.discount = maxDiscount;
        } else if (discountType === "flat" && discountValue > maxDiscount) {
          toast.error(
            `Discount cannot exceed ₹${maxDiscount} for this package`
          );
          updated.discount = maxDiscount;
        }
      }

      // Auto-calculate totalPending = (amount - discount) - totalPaid
      if (name === "amount" || name === "discount" || name === "totalPaid") {
        const amount =
          parseFloat(name === "amount" ? value : updated.amount) || 0;
        const discount =
          parseFloat(name === "discount" ? value : updated.discount) || 0;
        const totalPaid =
          parseFloat(name === "totalPaid" ? value : updated.totalPaid) || 0;

        // Calculate discount amount based on type
        let discountAmount = 0;
        if (updated.discountType === "percentage") {
          discountAmount = (amount * discount) / 100;
        } else {
          discountAmount = discount;
        }

        const finalAmount = amount - discountAmount;
        updated.totalPending = Math.max(0, finalAmount - totalPaid);
      }

      return updated;
    });

    // Auto-fill package details when package is selected
    if (name === "packageId" && value) {
      const selectedPackage = packages.find((pkg) => pkg._id === value);
      if (selectedPackage) {
        const amount = selectedPackage.originalPrice;
        // Calculate maxDiscount based on discount type
        const discountType = selectedPackage.discountType || "flat";
        let maxDiscount;

        if (discountType === "percentage") {
          // For percentage, show the percentage value
          maxDiscount = Math.round(
            (selectedPackage.savings / selectedPackage.originalPrice) * 100
          );
        } else {
          // For flat, show the savings amount
          maxDiscount = selectedPackage.savings || 0;
        }

        setPackageFormData((prev) => {
          const updated = {
            ...prev,
            amount: amount,
            maxDiscount: maxDiscount,
            discountType: discountType,
            totalPending: amount - (prev.discount || 0) - (prev.totalPaid || 0),
          };

          // Auto-calculate end date when package is selected (if start date exists)
          if (prev.startDate) {
            updated.endDate = calculateEndDate(prev.startDate, value);
          }

          return updated;
        });
      }
    }
  };

  const addPackageToForm = () => {
    if (
      !packageFormData.packageId ||
      !packageFormData.startDate ||
      !packageFormData.amount
    ) {
      alert("Please fill all package fields");
      return;
    }

    const selectedPackage = packages.find(
      (pkg) => pkg._id === packageFormData.packageId
    );
    if (!selectedPackage) {
      alert("Selected package not found");
      return;
    }

    // Calculate final amount based on discount type
    const baseAmount = parseFloat(packageFormData.amount);
    const discountValue = parseFloat(packageFormData.discount) || 0;
    let discountAmount = 0;

    if (packageFormData.discountType === "percentage") {
      // Calculate discount from percentage
      discountAmount = (baseAmount * discountValue) / 100;
    } else {
      // Flat discount
      discountAmount = discountValue;
    }

    const finalAmount = baseAmount - discountAmount;
    const paid = parseFloat(packageFormData.totalPaid) || 0;
    const pending = parseFloat(packageFormData.totalPending) || 0;

    const newPackage = {
      packageId: packageFormData.packageId,
      packageName: selectedPackage.packageName,
      packageType: selectedPackage.packageType,
      startDate: packageFormData.startDate,
      endDate: packageFormData.endDate,
      amount: baseAmount,
      discount: discountValue,
      discountType: packageFormData.discountType,
      finalAmount: finalAmount,
      totalPaid: paid,
      totalPending: pending,
      paymentStatus: packageFormData.paymentStatus,
      paymentMethod: packageFormData.paymentMethod,
      transactionId: packageFormData.transactionId,
      packageStatus: "Active",
      isPrimary:
        formData.packages.length === 0 ? true : packageFormData.isPrimary,
      autoRenew: false,
      notes: "",
    };

    setFormData((prev) => ({
      ...prev,
      packages: [...prev.packages, newPackage],
      totalPaid: prev.totalPaid + paid,
      totalPending: prev.totalPending + pending,
    }));

    // Reset package form
    setPackageFormData({
      packageId: "",
      startDate: "",
      endDate: "",
      amount: "",
      discount: 0,
      totalPaid: 0,
      totalPending: 0,
      paymentStatus: "Paid",
      paymentMethod: "Cash",
      transactionId: "",
      isPrimary: false,
    });
  };

  const removePackageFromForm = (index) => {
    const removedPackage = formData.packages[index];
    const removedPaid = parseFloat(removedPackage.totalPaid || 0);
    const removedPending = parseFloat(removedPackage.totalPending || 0);

    setFormData((prev) => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== index),
      totalPaid: prev.totalPaid - removedPaid,
      totalPending: prev.totalPending - removedPending,
    }));
  };

  // Handle profile picture upload
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  // Handle document upload
  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not a valid file type`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });
    setDocumentFiles((prev) => [...prev, ...validFiles]);
  };

  // Remove document from upload list
  const removeDocument = (index) => {
    setDocumentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload file to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "FLAMEBOX");
    formData.append("cloud_name", "dchim0zcz");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dchim0zcz/auto/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    // Final validation before submit
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    if (!editMode && !validateStep2()) {
      setCurrentStep(2);
      return;
    }

    // Check if any changes were made in edit mode
    if (editMode && originalMemberData) {
      const hasChanges =
        JSON.stringify(formData) !== JSON.stringify(originalMemberData);
      if (!hasChanges && !profilePicFile && documentFiles.length === 0) {
        toast.warning("No changes detected!", {
          description: "Please make changes before updating the member.",
        });
        return;
      }
    }

    try {
      setIsUploading(true);

      // Upload profile picture if selected
      let photoUrl = formData.photo;
      if (profilePicFile) {
        toast.info("Uploading profile picture...");
        photoUrl = await uploadToCloudinary(profilePicFile);
      }

      // Upload documents if selected
      let documentsArray = [...formData.documents];
      if (documentFiles.length > 0) {
        toast.info(`Uploading ${documentFiles.length} document(s)...`);
        const uploadedDocs = await Promise.all(
          documentFiles.map(async (file) => ({
            name: file.name,
            url: await uploadToCloudinary(file),
            uploadDate: new Date(),
          }))
        );
        documentsArray = [...documentsArray, ...uploadedDocs];
      }

      // Prepare data for submission
      const memberData = convertDatesToISO({
        ...formData,
        photo: photoUrl,
        documents: documentsArray,
      });

      console.log("📤 Submitting member data:", memberData);

      if (editMode && currentMemberId) {
        const result = await dispatch(
          updateMember({ id: currentMemberId, updateData: memberData })
        );
        if (result.error) {
          toast.error(result.error.message || "Failed to update member");
          return;
        }
        toast.success("Member updated successfully!");
      } else {
        const result = await dispatch(createMember(memberData));
        if (result.error) {
          toast.error(result.error.message || "Failed to create member");
          return;
        }
        toast.success("Member created successfully!");
      }

      resetForm();
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to save member. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (member) => {
    setEditMode(true);
    setCurrentMemberId(member._id);
    setFormData({
      registrationNumber: member.registrationNumber || "",
      fullName: member.fullName || "",
      email: member.email || "",
      phoneNumber: member.phoneNumber || "",
      alternatePhone: member.alternatePhone || "",
      dateOfBirth: member.dateOfBirth ? member.dateOfBirth.split("T")[0] : "",
      gender: member.gender || "Male",
      address: member.address || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
      },
      emergencyContact: member.emergencyContact || {
        name: "",
        relationship: "",
        phone: "",
      },
      vaccinationStatus: member.vaccinationStatus || "Not Vaccinated",
      bloodGroup: member.bloodGroup || "Unknown",
      salesRepresentative: member.salesRepresentative || "",
      notes: member.notes || "",
      joiningDate: member.joiningDate
        ? member.joiningDate.split("T")[0]
        : new Date().toISOString().split("T")[0],
      dueDate: member.dueDate ? member.dueDate.split("T")[0] : "",
      packages: member.packages || [],
      totalPaid: member.totalPaid || 0,
      totalPending: member.totalPending || 0,
      paymentDate: member.paymentDate ? member.paymentDate.split("T")[0] : "",
      assignedTrainer:
        member.assignedTrainer?._id || member.assignedTrainer || "",
      photo: member.photo || "",
      documents: member.documents || [],
    });
    // Store original data for comparison
    setOriginalMemberData({
      registrationNumber: member.registrationNumber || "",
      fullName: member.fullName || "",
      email: member.email || "",
      phoneNumber: member.phoneNumber || "",
      alternatePhone: member.alternatePhone || "",
      dateOfBirth: member.dateOfBirth ? member.dateOfBirth.split("T")[0] : "",
      gender: member.gender || "Male",
      address: member.address || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
      },
      emergencyContact: member.emergencyContact || {
        name: "",
        relationship: "",
        phone: "",
      },
      vaccinationStatus: member.vaccinationStatus || "Not Vaccinated",
      bloodGroup: member.bloodGroup || "Unknown",
      salesRepresentative: member.salesRepresentative || "",
      notes: member.notes || "",
      joiningDate: member.joiningDate
        ? member.joiningDate.split("T")[0]
        : new Date().toISOString().split("T")[0],
      dueDate: member.dueDate ? member.dueDate.split("T")[0] : "",
      packages: member.packages || [],
      totalPaid: member.totalPaid || 0,
      totalPending: member.totalPending || 0,
      paymentDate: member.paymentDate ? member.paymentDate.split("T")[0] : "",
      assignedTrainer:
        member.assignedTrainer?._id || member.assignedTrainer || "",
      photo: member.photo || "",
      documents: member.documents || [],
    });
    setProfilePicPreview(member.photo || "");
    setIsDrawerOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      dispatch(deleteMember(id));
    }
  };

  const handleViewDetails = async (member) => {
    setSelectedMember(member);
    setIsDetailsModalOpen(true);
    // Optionally fetch fresh data
    // dispatch(fetchMemberById(member._id));
  };

  const handleOpenEditStartDateModal = (
    packageId,
    packageName,
    currentDate
  ) => {
    setEditingStartDatePackageId(packageId);
    setEditingPackageName(packageName);
    setNewStartDate(new Date(currentDate).toISOString().split("T")[0]);
    setIsEditStartDateModalOpen(true);
  };

  const handleCloseEditStartDateModal = () => {
    setIsEditStartDateModalOpen(false);
    setEditingStartDatePackageId(null);
    setEditingPackageName("");
    setNewStartDate("");
  };

  const togglePackageExpand = (packageId) => {
    const newExpanded = new Set(expandedPackages);
    if (newExpanded.has(packageId)) {
      newExpanded.delete(packageId);
    } else {
      newExpanded.add(packageId);
    }
    setExpandedPackages(newExpanded);
  };

  const handleUpdatePackageStartDate = async () => {
    if (!editingStartDatePackageId || !newStartDate) {
      toast.error("Please select a date");
      return;
    }

    setIsUpdatingStartDate(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }/api/admin/members/${
          selectedMember._id
        }/packages/${editingStartDatePackageId}/start-date`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate: newStartDate,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Package start date updated successfully!");
        handleCloseEditStartDateModal();
        // Refresh member data
        dispatch(fetchMemberById(selectedMember._id));
      } else {
        toast.error(data.error || "Failed to update start date");
      }
    } catch (error) {
      console.error("Error updating start date:", error);
      toast.error("Failed to update start date");
    } finally {
      setIsUpdatingStartDate(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(
      fetchAllMembers({
        search: value,
        status: filterStatus,
        page: 1,
        limit: 10,
      })
    );
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    dispatch(
      fetchAllMembers({
        search: searchTerm,
        status: status,
        page: 1,
        limit: 10,
      })
    );
  };

  // Bulk Import Functions
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          defval: "",
          raw: false,
        });

        if (jsonData.length === 0) {
          alert("The Excel file is empty");
          return;
        }

        const cleanedData = jsonData.map((row) => {
          const cleanRow = {};
          Object.keys(row).forEach((key) => {
            const cleanKey = key.trim();
            const value = row[key];
            cleanRow[cleanKey] =
              value === null || value === undefined ? "" : String(value).trim();
          });
          return cleanRow;
        });

        console.log("📊 Parsed Excel data:", cleanedData);
        setBulkImportData(cleanedData);
        setValidationResults(null);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        alert("Error parsing Excel file. Please ensure it's a valid format.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const validateMembers = async () => {
    if (bulkImportData.length === 0) {
      alert("Please select a file first");
      return;
    }

    setIsValidating(true);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }/api/members/import/validate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ members: bulkImportData }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setValidationResults({
          total: result.summary.total,
          valid: result.summary.valid,
          invalid: result.summary.invalid,
          validMembers: result.validMembers,
          invalidMembers: result.invalidMembers,
        });

        if (result.summary.invalid === 0) {
          toast.success(
            `All ${result.summary.valid} records are valid! Ready to import.`
          );
        } else {
          toast.warning(
            `${result.summary.valid} valid, ${result.summary.invalid} invalid records found`
          );
        }
      } else {
        toast.error("Validation failed: " + result.message);
      }
    } catch (error) {
      console.error("Error validating members:", error);
      toast.error("Error validating members. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleBulkImport = async () => {
    if (bulkImportData.length === 0) {
      alert("Please select a file first");
      return;
    }

    if (!validationResults) {
      alert(
        "Please validate the data first by clicking 'Validate Data' button"
      );
      return;
    }

    if (validationResults.invalid > 0) {
      const confirmImport = window.confirm(
        `There are ${validationResults.invalid} invalid members. Do you want to import only the ${validationResults.valid} valid members?`
      );
      if (!confirmImport) return;
    }

    setIsImporting(true);
    setImportResults(null);

    try {
      // Filter only valid members for import
      const validMemberData = validationResults.validMembers.map(
        (vm) => vm.data
      );

      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }/api/members/import/bulk`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ members: validMemberData }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setImportResults(result);
        dispatch(fetchAllMembers({ page: currentPage, limit: membersPerPage }));
        dispatch(fetchMemberStatistics());

        toast.success(
          `Successfully imported ${result.summary.successful} members!`
        );

        setTimeout(() => {
          if (result.summary.failed === 0) {
            setIsBulkImportOpen(false);
            setBulkImportFile(null);
            setBulkImportData([]);
            setImportResults(null);
            setValidationResults(null);
          }
        }, 2000);
      } else {
        toast.error("Import failed: " + result.message);
      }
    } catch (error) {
      console.error("Error importing members:", error);
      toast.error("Error importing members. Please try again.");
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }/api/members/import/template`,
        { credentials: "include" }
      );
      const result = await response.json();

      if (result.success) {
        const worksheet = XLSX.utils.json_to_sheet(result.template);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

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

        XLSX.writeFile(workbook, "Member_Import_Template.xlsx");
      }
    } catch (error) {
      console.error("Error downloading template:", error);
      alert("Error downloading template. Please try again.");
    }
  };

  const downloadDemoTemplate = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    const demoUrl = `${apiUrl}/public/Member_Import_Demo_Template.xlsx`;
    const link = document.createElement("a");
    link.href = demoUrl;
    link.download = "Member_Import_Demo_Template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Step validation functions
  const validateStep1 = () => {
    const errors = [];

    if (!formData.fullName || formData.fullName.trim() === "") {
      errors.push("Full Name is required");
    }

    if (!formData.phoneNumber || formData.phoneNumber.trim() === "") {
      errors.push("Phone Number is required");
    }

    if (
      formData.email &&
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    ) {
      errors.push("Please provide a valid email address");
    }

    if (errors.length > 0) {
      toast.error(errors[0], {
        description:
          errors.length > 1
            ? `${errors.length} fields need attention`
            : undefined,
      });
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!editMode && formData.packages.length === 0) {
      toast.error("Please add at least one package", {
        description: "A package is required for new members",
      });
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    // Step 3 has no mandatory fields, all optional
    return true;
  };

  // Step navigation functions with validation
  const goToNextStep = () => {
    let isValid = false;

    // Validate current step before proceeding
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    } else if (currentStep === 3) {
      isValid = validateStep3();
    }

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      toast.success(`Step ${currentStep} completed!`);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    // Allow going back without validation
    if (step < currentStep) {
      setCurrentStep(step);
      return;
    }

    // For going forward, validate all intermediate steps
    if (step > currentStep) {
      for (let i = currentStep; i < step; i++) {
        if (i === 1 && !validateStep1()) return;
        if (i === 2 && !validateStep2()) return;
        if (i === 3 && !validateStep3()) return;
      }
      setCurrentStep(step);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Gym Members
            </h1>
            <p className="text-gray-400 text-sm">
              Manage your gym member admissions
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsBulkImportOpen(true)}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Bulk Import
            </button>
            <button
              onClick={() => {
                resetForm();
                setIsDrawerOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Add Member
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Members</p>
                <p className="text-3xl font-bold text-white">
                  {statistics?.totalMembers || members.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Pending Payments</p>
                <p className="text-3xl font-bold text-white">
                  {
                    members.filter((m) =>
                      m.packages?.some((p) => p.paymentStatus === "Pending")
                    ).length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or registration number..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange("")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filterStatus === ""
                    ? "bg-red-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                All
              </button>
            </div>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">All Members</h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
              <p className="text-gray-400 mt-4">Loading members...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No members found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Reg. No.
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Member
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Package
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {members.map((member) => (
                      <tr
                        key={member._id}
                        className="hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-mono text-red-400">
                            {member.registrationNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {member.photo ? (
                              <img
                                src={member.photo}
                                alt={member.fullName}
                                className="w-10 h-10 rounded-full object-cover border-2 border-red-500"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-semibold">
                                {member.fullName.charAt(0)}
                              </div>
                            )}
                            <div className="text-sm font-medium text-white">
                              {member.fullName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-300">
                            {member.email}
                          </div>
                          <div className="text-xs text-gray-500">
                            {member.phoneNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {member.currentPackage?.packageName ? (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-600 to-red-700 text-white">
                              {member.currentPackage.packageName}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-xs">
                              No active package
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              member.memberStatus === "Active"
                                ? "bg-green-600/20 text-green-400 border border-green-600/30"
                                : member.memberStatus === "Expired"
                                ? "bg-orange-600/20 text-orange-400 border border-orange-600/30"
                                : member.memberStatus === "Suspended"
                                ? "bg-red-600/20 text-red-400 border border-red-600/30"
                                : "bg-gray-600/20 text-gray-400 border border-gray-600/30"
                            }`}
                          >
                            {member.memberStatus || "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-300">
                            {formatDateForDisplay(member.joiningDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(member)}
                              className="p-2 hover:bg-blue-900/30 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-blue-400 hover:text-blue-300" />
                            </button>
                            <button
                              onClick={() => handleEdit(member)}
                              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-gray-400 hover:text-white" />
                            </button>
                            <button
                              onClick={() => handleDelete(member._id)}
                              className="p-2 hover:bg-red-900/30 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="bg-gray-800/50 px-6 py-4 border-t border-gray-700">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Results Info */}
                  <div className="text-sm text-gray-400">
                    Showing{" "}
                    <span className="font-semibold text-white">
                      {(pagination.currentPage - 1) * membersPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-white">
                      {Math.min(
                        pagination.currentPage * membersPerPage,
                        pagination.totalMembers
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-white">
                      {pagination.totalMembers}
                    </span>{" "}
                    members
                  </div>

                  {/* Page Size Selector */}
                  <div className="flex items-center gap-2">
                    <label htmlFor="pageSize" className="text-sm text-gray-400">
                      Per page:
                    </label>
                    <select
                      id="pageSize"
                      value={membersPerPage}
                      onChange={(e) => {
                        setMembersPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>

                  {/* Pagination Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={pagination.currentPage === 1}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        pagination.currentPage === 1
                          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                          : "bg-gray-700 text-white hover:bg-gray-600"
                      }`}
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {[...Array(pagination.totalPages)].map((_, index) => {
                        const pageNumber = index + 1;

                        // Show first page, last page, current page, and pages around current
                        if (
                          pageNumber === 1 ||
                          pageNumber === pagination.totalPages ||
                          (pageNumber >= pagination.currentPage - 1 &&
                            pageNumber <= pagination.currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                pagination.currentPage === pageNumber
                                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
                                  : "bg-gray-700 text-white hover:bg-gray-600"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          pageNumber === pagination.currentPage - 2 ||
                          pageNumber === pagination.currentPage + 2
                        ) {
                          return (
                            <span
                              key={pageNumber}
                              className="px-2 text-gray-500"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(pagination.totalPages, prev + 1)
                        )
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        pagination.currentPage === pagination.totalPages
                          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                          : "bg-gray-700 text-white hover:bg-gray-600"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {isDetailsModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {selectedMember.photo ? (
                    <img
                      src={selectedMember.photo}
                      alt={selectedMember.fullName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                      {selectedMember.fullName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedMember.fullName}
                    </h2>
                    <p className="text-red-100 text-sm">
                      Reg. No: {selectedMember.registrationNumber}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-red-400" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Email</p>
                    <p className="text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-red-400" />
                      {selectedMember.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Phone Number</p>
                    <p className="text-white flex items-center gap-2">
                      <Phone className="w-4 h-4 text-red-400" />
                      {selectedMember.phoneNumber}
                    </p>
                  </div>
                  {selectedMember.alternatePhone && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">
                        Alternate Phone
                      </p>
                      <p className="text-white">
                        {selectedMember.alternatePhone}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Gender</p>
                    <p className="text-white">{selectedMember.gender}</p>
                  </div>
                  {selectedMember.dateOfBirth && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">
                        Date of Birth
                      </p>
                      <p className="text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-red-400" />
                        {formatDateForDisplay(selectedMember.dateOfBirth)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Blood Group</p>
                    <p className="text-white flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-400" />
                      {selectedMember.bloodGroup}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">
                      Vaccination Status
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedMember.vaccinationStatus === "Vaccinated"
                          ? "bg-green-600/20 text-green-400"
                          : selectedMember.vaccinationStatus ===
                            "Partially Vaccinated"
                          ? "bg-yellow-600/20 text-yellow-400"
                          : "bg-gray-600/20 text-gray-400"
                      }`}
                    >
                      {selectedMember.vaccinationStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Member Status</p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedMember.memberStatus === "Active"
                          ? "bg-green-600/20 text-green-400 border border-green-600/30"
                          : selectedMember.memberStatus === "Expired"
                          ? "bg-orange-600/20 text-orange-400 border border-orange-600/30"
                          : selectedMember.memberStatus === "Suspended"
                          ? "bg-red-600/20 text-red-400 border border-red-600/30"
                          : "bg-gray-600/20 text-gray-400 border border-gray-600/30"
                      }`}
                    >
                      {selectedMember.memberStatus || "Inactive"}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">
                      Member Joining Date
                    </p>
                    <p className="text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-400" />
                      {formatDateForDisplay(selectedMember.joiningDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Last Updated</p>
                    <p className="text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      {selectedMember.lastUpdatedDate
                        ? formatDateForDisplay(selectedMember.lastUpdatedDate)
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              {selectedMember.address &&
                (selectedMember.address.street ||
                  selectedMember.address.city) && (
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-red-400" />
                      Address
                    </h3>
                    <p className="text-white">
                      {selectedMember.address.street &&
                        `${selectedMember.address.street}, `}
                      {selectedMember.address.city &&
                        `${selectedMember.address.city}, `}
                      {selectedMember.address.state &&
                        `${selectedMember.address.state}, `}
                      {selectedMember.address.zipCode &&
                        `${selectedMember.address.zipCode}, `}
                      {selectedMember.address.country}
                    </p>
                  </div>
                )}

              {/* Emergency Contact */}
              {selectedMember.emergencyContact?.name && (
                <div className="bg-gray-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-red-400" />
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Name</p>
                      <p className="text-white">
                        {selectedMember.emergencyContact.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Relationship</p>
                      <p className="text-white">
                        {selectedMember.emergencyContact.relationship}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Phone</p>
                      <p className="text-white">
                        {selectedMember.emergencyContact.phone}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sales Information */}
              {selectedMember.salesRepresentative && (
                <div className="bg-gray-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-red-400" />
                    Sales Information
                  </h3>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">
                      Sales Representative
                    </p>
                    <p className="text-white">
                      {selectedMember.salesRepresentative}
                    </p>
                  </div>
                </div>
              )}

              {/* Assigned Trainer */}
              {selectedMember.assignedTrainer && (
                <div className="bg-gray-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-red-400" />
                    Assigned Trainer
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Trainer Name</p>
                      <p className="text-white">
                        {selectedMember.assignedTrainer.fullName ||
                          selectedMember.assignedTrainer.userName}
                      </p>
                    </div>
                    {selectedMember.assignedTrainer.email && (
                      <div>
                        <p className="text-gray-400 text-sm mb-1">
                          Trainer Email
                        </p>
                        <p className="text-white">
                          {selectedMember.assignedTrainer.email}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              <div className="bg-gray-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-red-400" />
                    Payment Summary
                  </h3>
                  <button
                    onClick={() => {
                      setPaymentEditData({
                        amountPaid: 0,
                        paymentStatus:
                          selectedMember.packages?.[0]?.paymentStatus ||
                          "Pending",
                      });
                      setIsPaymentEditOpen(true);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Payment
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-4">
                    <p className="text-green-400 text-sm mb-1">Total Paid</p>
                    <p className="text-white text-2xl font-bold">
                      ₹{selectedMember.totalPaid || 0}
                    </p>
                  </div>
                  <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-4">
                    <p className="text-yellow-400 text-sm mb-1">
                      Total Pending
                    </p>
                    <p className="text-white text-2xl font-bold">
                      ₹{selectedMember.totalPending || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Package */}
              {selectedMember.currentPackage?.packageName && (
                <div className="bg-gray-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <PackageIcon className="w-5 h-5 text-red-400" />
                    Current Package
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Package Name</p>
                      <p className="text-white font-semibold">
                        {selectedMember.currentPackage.packageName}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Start Date</p>
                      <p className="text-white">
                        {formatDateForDisplay(
                          selectedMember.currentPackage.startDate
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">End Date</p>
                      <p className="text-white">
                        {formatDateForDisplay(
                          selectedMember.currentPackage.endDate
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* All Packages */}
              {selectedMember.packages &&
                selectedMember.packages.length > 0 && (
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <PackageIcon className="w-5 h-5 text-red-400" />
                        All Packages ({selectedMember.packages.length})
                      </h3>
                      <select
                        className="px-4 py-2 rounded-lg font-semibold bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                        value=""
                        onChange={(e) => {
                          const action = e.target.value;
                          if (action === "renew") {
                            // Open renew modal with all member packages
                            setRenewPackageList(selectedMember.packages || []);
                            setIsRenewModalOpen(true);
                          } else if (action === "upgrade") {
                            // Open upgrade modal
                            setIsUpgradeModalOpen(true);
                          } else if (action === "freeze") {
                            // Open freeze selection modal
                            setIsFreezeSelectionModalOpen(true);
                          } else if (action === "extension") {
                            // Open extension selection modal
                            setIsExtensionSelectionModalOpen(true);
                          }
                          // Reset dropdown
                          e.target.value = "";
                        }}
                      >
                        <option value="" disabled>
                          Select Action
                        </option>
                        <option value="renew">Renew</option>
                        <option value="upgrade">Upgrade</option>
                        <option value="freeze">Freeze</option>
                        <option value="extension">Extension</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      {selectedMember.packages.map((pkg, index) => (
                        <div
                          key={index}
                          className="bg-gray-700 rounded-lg overflow-hidden"
                        >
                          {/* Package Header - Always Visible */}
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => togglePackageExpand(pkg._id)}
                                    className="text-gray-400 hover:text-white transition-colors mt-1"
                                    title={
                                      expandedPackages.has(pkg._id)
                                        ? "Collapse"
                                        : "Expand"
                                    }
                                  >
                                    {expandedPackages.has(pkg._id) ? (
                                      <ChevronDown className="w-5 h-5" />
                                    ) : (
                                      <ChevronRight className="w-5 h-5" />
                                    )}
                                  </button>
                                  <div className="flex-1">
                                    <p className="text-white font-semibold">
                                      {pkg.packageName}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                      {pkg.packageType}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 flex-wrap justify-end">
                                {pkg.isPrimary && (
                                  <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-600/20 text-yellow-400 whitespace-nowrap">
                                    Primary
                                  </span>
                                )}
                                <span
                                  className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                                    pkg.paymentStatus === "Paid"
                                      ? "bg-green-600/20 text-green-400"
                                      : "bg-yellow-600/20 text-yellow-400"
                                  }`}
                                >
                                  {pkg.paymentStatus}
                                </span>
                              </div>
                            </div>

                            {/* Summary Row - Always Visible */}
                            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-600">
                              <div>
                                <p className="text-gray-400 text-xs mb-1">
                                  Final Amount
                                </p>
                                <p className="text-white font-bold text-lg">
                                  ₹{pkg.finalAmount}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs mb-1">
                                  Paid
                                </p>
                                <p className="text-green-400 font-bold text-lg">
                                  ₹{pkg.totalPaid || 0}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs mb-1">
                                  Due
                                </p>
                                <p className="text-orange-400 font-bold text-lg">
                                  ₹{pkg.totalPending || 0}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {expandedPackages.has(pkg._id) && (
                            <div className="bg-gray-600/30 border-t border-gray-600 p-4 space-y-4">
                              {/* Financial Details */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-300 mb-3">
                                  Financial Details
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  <div className="bg-gray-700/50 rounded p-3">
                                    <p className="text-gray-400 text-xs mb-1">
                                      Original Amount
                                    </p>
                                    <p className="text-white font-semibold">
                                      ₹{pkg.amount}
                                    </p>
                                  </div>
                                  <div className="bg-gray-700/50 rounded p-3">
                                    <p className="text-gray-400 text-xs mb-1">
                                      Discount{" "}
                                      {pkg.discountType === "percentage"
                                        ? "(%)"
                                        : ""}
                                    </p>
                                    <p className="text-red-400 font-semibold">
                                      {pkg.discountType === "percentage"
                                        ? `${pkg.discount.toFixed(2)}%`
                                        : `₹${pkg.discount}`}
                                    </p>
                                  </div>
                                  <div className="bg-gray-700/50 rounded p-3">
                                    <p className="text-gray-400 text-xs mb-1">
                                      Paid Amount
                                    </p>
                                    <p className="text-green-400 font-semibold">
                                      ₹{pkg.totalPaid || 0}
                                    </p>
                                  </div>
                                  <div className="bg-gray-700/50 rounded p-3">
                                    <p className="text-gray-400 text-xs mb-1">
                                      Due Amount
                                    </p>
                                    <p className="text-orange-400 font-semibold">
                                      ₹{pkg.totalPending || 0}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Dates */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-300 mb-3">
                                  Package Dates
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  <div className="bg-gray-700/50 rounded p-3">
                                    <p className="text-gray-400 text-xs mb-1">
                                      Start Date
                                    </p>
                                    <div className="flex items-center justify-between">
                                      <p className="text-white font-semibold">
                                        {formatDateForDisplay(pkg.startDate)}
                                      </p>
                                      <button
                                        onClick={() =>
                                          handleOpenEditStartDateModal(
                                            pkg._id,
                                            pkg.packageName,
                                            pkg.startDate
                                          )
                                        }
                                        className="text-blue-400 hover:text-blue-300 transition-colors ml-2"
                                        title="Edit start date"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="bg-gray-700/50 rounded p-3">
                                    <p className="text-gray-400 text-xs mb-1">
                                      End Date
                                    </p>
                                    <p className="text-white font-semibold">
                                      {formatDateForDisplay(pkg.endDate)}
                                    </p>
                                  </div>
                                  <div className="bg-gray-700/50 rounded p-3">
                                    <p className="text-gray-400 text-xs mb-1">
                                      Last Payment
                                    </p>
                                    <p className="text-white font-semibold">
                                      {pkg.paymentDate
                                        ? formatDateForDisplay(pkg.paymentDate)
                                        : "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="pt-3 border-t border-gray-600">
                                <button
                                  onClick={async () => {
                                    if (
                                      window.confirm(
                                        "Mark this package as Expired? (For testing)"
                                      )
                                    ) {
                                      try {
                                        const response = await fetch(
                                          `${
                                            import.meta.env.VITE_API_BASE_URL ||
                                            "http://localhost:3000"
                                          }/api/admin/members/${
                                            selectedMember._id
                                          }/expire-package/${pkg._id}`,
                                          {
                                            method: "PATCH",
                                            credentials: "include",
                                            headers: {
                                              "Content-Type":
                                                "application/json",
                                            },
                                          }
                                        );
                                        const data = await response.json();
                                        if (data.success) {
                                          toast.success(
                                            "Package marked as expired"
                                          );
                                          dispatch(
                                            fetchMemberById(selectedMember._id)
                                          );
                                        } else {
                                          toast.error(
                                            data.error ||
                                              "Failed to expire package"
                                          );
                                        }
                                      } catch (error) {
                                        toast.error("Failed to expire package");
                                      }
                                    }
                                  }}
                                  className="px-3 py-2 rounded text-xs font-semibold bg-orange-600/20 text-orange-400 hover:bg-orange-600/30 transition-colors"
                                >
                                  Expire (Test)
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Payment History */}
              {selectedMember.paymentHistory &&
                selectedMember.paymentHistory.length > 0 && (
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <IndianRupee className="w-5 h-5 text-red-400" />
                      Payment History ({selectedMember.paymentHistory.length})
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-600">
                            <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">
                              Date
                            </th>
                            <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">
                              Package
                            </th>
                            <th className="text-right py-3 px-4 text-gray-400 font-semibold text-sm">
                              Amount Paid
                            </th>
                            <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">
                              Payment Method
                            </th>
                            {/* Only show Transaction ID column if at least one payment has a valid transactionId */}
                            {selectedMember.paymentHistory.some(
                              (payment) =>
                                payment.transactionId &&
                                payment.transactionId !== "-" &&
                                payment.transactionId.trim() !== ""
                            ) && (
                              <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">
                                Transaction ID
                              </th>
                            )}
                            <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedMember.paymentHistory
                            .slice()
                            .reverse()
                            .map((payment, index) => (
                              <tr
                                key={index}
                                className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                              >
                                <td className="py-3 px-4 text-white text-sm">
                                  {formatDateForDisplay(payment.date)}
                                </td>
                                <td className="py-3 px-4 text-white text-sm">
                                  {payment.packageName || "N/A"}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <span className="text-green-400 font-semibold">
                                    ₹{payment.amount}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-white text-sm">
                                  {payment.paymentMethod || "N/A"}
                                </td>
                                {/* Only show Transaction ID cell if it is valid and the column is shown */}
                                {selectedMember.paymentHistory.some(
                                  (p) =>
                                    p.transactionId &&
                                    p.transactionId !== "-" &&
                                    p.transactionId.trim() !== ""
                                ) && (
                                  <td className="py-3 px-4 text-gray-400 text-sm">
                                    {payment.transactionId &&
                                    payment.transactionId !== "-" &&
                                    payment.transactionId.trim() !== ""
                                      ? payment.transactionId
                                      : ""}
                                  </td>
                                )}
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-semibold ${
                                      payment.status === "Success"
                                        ? "bg-green-600/20 text-green-400"
                                        : payment.status === "Pending"
                                        ? "bg-yellow-600/20 text-yellow-400"
                                        : payment.status === "Failed"
                                        ? "bg-red-600/20 text-red-400"
                                        : "bg-blue-600/20 text-blue-400"
                                    }`}
                                  >
                                    {payment.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* Attendance & Activity */}
              <div className="bg-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-400" />
                  Attendance & Activity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Visits</p>
                    <p className="text-white text-2xl font-bold">
                      {selectedMember.totalVisits || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Last Visit</p>
                    <p className="text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-red-400" />
                      {selectedMember.lastVisitDate
                        ? formatDateForDisplay(selectedMember.lastVisitDate)
                        : "Never"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Joined On</p>
                    <p className="text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-400" />
                      {formatDateForDisplay(selectedMember.joiningDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              {selectedMember.documents &&
                selectedMember.documents.length > 0 && (
                  <div className="bg-gray-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <PackageIcon className="w-5 h-5 text-red-400" />
                      Documents
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedMember.documents.map((doc, index) => (
                        <a
                          key={index}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium truncate">
                              {doc.name}
                            </p>
                            {doc.uploadDate && (
                              <p className="text-gray-400 text-xs">
                                {formatDateForDisplay(doc.uploadDate)}
                              </p>
                            )}
                          </div>
                          <Eye className="w-4 h-4 text-blue-400 ml-2" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              {/* Notes */}
              {selectedMember.notes && (
                <div className="bg-gray-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Notes
                  </h3>
                  <p className="text-gray-300">{selectedMember.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    handleEdit(selectedMember);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2"
                >
                  <Edit className="w-5 h-5" />
                  Edit Member
                </button>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Package Start Date Modal */}
      {isEditStartDateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-700 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Edit Start Date
                  </h3>
                  <p className="text-blue-100 text-sm mt-1">
                    {editingPackageName}
                  </p>
                </div>
                <button
                  onClick={handleCloseEditStartDateModal}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  New Start Date
                </label>
                <input
                  type="date"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdatePackageStartDate}
                  disabled={isUpdatingStartDate}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingStartDate ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Save
                    </>
                  )}
                </button>
                <button
                  onClick={handleCloseEditStartDateModal}
                  disabled={isUpdatingStartDate}
                  className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Edit Modal */}
      {isPaymentEditOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <IndianRupee className="w-6 h-6 text-red-400" />
                Edit Payment
              </h3>
              <button
                onClick={() => setIsPaymentEditOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Current Payment Summary */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Current Status</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-xs">Total Paid</p>
                    <p className="text-green-400 text-lg font-bold">
                      ₹{selectedMember.totalPaid || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Total Due</p>
                    <p className="text-yellow-400 text-lg font-bold">
                      ₹{selectedMember.totalPending || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Amount Input */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Payment Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={paymentEditData.amountPaid}
                    onChange={(e) =>
                      setPaymentEditData({
                        ...paymentEditData,
                        amountPaid: parseFloat(e.target.value) || "",
                      })
                    }
                    className="w-full pl-8 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter amount paid"
                    min="0"
                  />
                </div>
              </div>

              {/* New Totals Preview */}
              <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                <p className="text-blue-400 text-sm mb-2 font-semibold">
                  After Payment
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-xs">New Total Paid</p>
                    <p className="text-green-400 text-lg font-bold">
                      ₹
                      {(selectedMember.totalPaid || 0) +
                        (paymentEditData.amountPaid || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">New Total Due</p>
                    <p className="text-yellow-400 text-lg font-bold">
                      ₹
                      {Math.max(
                        0,
                        (selectedMember.totalPending || 0) -
                          (paymentEditData.amountPaid || 0)
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Payment Status *
                </label>
                <select
                  value={paymentEditData.paymentStatus}
                  onChange={(e) =>
                    setPaymentEditData({
                      ...paymentEditData,
                      paymentStatus: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Partial">Partial</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={async () => {
                    try {
                      setIsPaymentUpdating(true);
                      const newTotalPaid =
                        (selectedMember.totalPaid || 0) +
                        (paymentEditData.amountPaid || 0);
                      const newTotalPending = Math.max(
                        0,
                        (selectedMember.totalPending || 0) -
                          (paymentEditData.amountPaid || 0)
                      );

                      const response = await fetch(
                        `${
                          import.meta.env.VITE_API_BASE_URL ||
                          "http://localhost:3000"
                        }/api/admin/members/${selectedMember._id}/payment`,
                        {
                          method: "PUT",
                          credentials: "include",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            amountPaid: paymentEditData.amountPaid,
                            paymentStatus: paymentEditData.paymentStatus,
                            totalPaid: newTotalPaid,
                            totalPending: newTotalPending,
                          }),
                        }
                      );

                      const data = await response.json();

                      if (data.success) {
                        toast.success("Payment updated successfully!");
                        setIsPaymentEditOpen(false);
                        dispatch(
                          fetchAllMembers({
                            page: currentPage,
                            limit: membersPerPage,
                          })
                        );
                        dispatch(fetchMemberById(selectedMember._id));
                      } else {
                        toast.error(data.error || "Failed to update payment");
                      }
                    } catch (error) {
                      console.error("Error updating payment:", error);
                      toast.error("Failed to update payment");
                    } finally {
                      setIsPaymentUpdating(false);
                    }
                  }}
                  disabled={isPaymentUpdating}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPaymentUpdating ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Updating...</span>
                    </>
                  ) : (
                    "Save & Update"
                  )}
                </button>
                <button
                  onClick={() => setIsPaymentEditOpen(false)}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Renew Package Modal */}
      {isRenewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <PackageIcon className="w-6 h-6 text-red-400" />
                Renew Package
              </h3>
              <button
                onClick={() => {
                  setIsRenewModalOpen(false);
                  setSelectedRenewPackage(null);
                  setIsRenewFormOpen(false);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {!isRenewFormOpen ? (
              <div className="space-y-4">
                <p className="text-gray-300 text-sm mb-4">
                  Select a package to renew from the member's packages:
                </p>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">
                    Select Package
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={selectedRenewPackage?._id || ""}
                    onChange={(e) => {
                      const pkg = renewPackageList.find(
                        (p) => p._id === e.target.value
                      );
                      setSelectedRenewPackage(pkg);
                    }}
                  >
                    <option value="">-- Select Package --</option>
                    {renewPackageList.map((pkg) => (
                      <option key={pkg._id} value={pkg._id}>
                        {pkg.packageName} - {pkg.packageType} (
                        {pkg.packageStatus})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedRenewPackage && (
                  <div className="bg-gray-700/50 rounded-lg p-4 mt-4 space-y-2">
                    <h4 className="font-semibold text-white mb-3">
                      Package Details
                    </h4>
                    <div className="text-sm space-y-1">
                      <p className="text-gray-300">
                        <span className="text-gray-400">Name:</span>{" "}
                        {selectedRenewPackage.packageName}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-400">Type:</span>{" "}
                        {selectedRenewPackage.packageType}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-400">Status:</span>{" "}
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            selectedRenewPackage.packageStatus === "Active"
                              ? "bg-green-600/20 text-green-400"
                              : selectedRenewPackage.packageStatus === "Expired"
                              ? "bg-red-600/20 text-red-400"
                              : "bg-gray-600/20 text-gray-400"
                          }`}
                        >
                          {selectedRenewPackage.packageStatus}
                        </span>
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-400">Start Date:</span>{" "}
                        {new Date(
                          selectedRenewPackage.startDate
                        ).toLocaleDateString("en-GB")}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-400">End Date:</span>{" "}
                        {new Date(
                          selectedRenewPackage.endDate
                        ).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      if (!selectedRenewPackage) {
                        toast.error("Please select a package to renew");
                        return;
                      }

                      // Check if package is still active
                      if (selectedRenewPackage.packageStatus === "Active") {
                        toast.error(
                          "You can't renew an active package. Wait until it expires."
                        );
                        return;
                      }

                      // Open renew form
                      setIsRenewFormOpen(true);

                      // Get duration from packageId
                      let durationInDays = 30; // Default to monthly

                      console.log(
                        "Selected Package for Renew:",
                        selectedRenewPackage
                      );

                      if (selectedRenewPackage.packageId?.duration) {
                        const duration =
                          selectedRenewPackage.packageId.duration;
                        const unit = duration.unit?.toLowerCase() || "months";
                        const value = duration.value || 1;

                        console.log(
                          `Duration from packageId: ${value} ${unit}`
                        );

                        // Convert to days based on unit
                        if (unit === "days") {
                          durationInDays = value;
                        } else if (unit === "weeks") {
                          durationInDays = value * 7;
                        } else if (unit === "months") {
                          durationInDays = value * 30;
                        } else if (unit === "years") {
                          durationInDays = value * 365;
                        }
                      } else {
                        console.warn(
                          "Package duration not found in packageId, checking packages list"
                        );

                        // Fallback: Try to find the package from the packages list
                        const fullPackage = packages.find(
                          (p) =>
                            p._id === selectedRenewPackage.packageId?._id ||
                            p._id === selectedRenewPackage.packageId
                        );

                        if (fullPackage?.duration) {
                          const duration = fullPackage.duration;
                          const unit = duration.unit?.toLowerCase() || "months";
                          const value = duration.value || 1;

                          console.log(
                            `Duration from packages list: ${value} ${unit}`
                          );

                          if (unit === "days") {
                            durationInDays = value;
                          } else if (unit === "weeks") {
                            durationInDays = value * 7;
                          } else if (unit === "months") {
                            durationInDays = value * 30;
                          } else if (unit === "years") {
                            durationInDays = value * 365;
                          }
                        } else {
                          console.warn(
                            "Package duration not found, using default 30 days"
                          );
                        }
                      }

                      console.log(`Final duration in days: ${durationInDays}`);

                      // Pre-fill form with package details
                      setRenewFormData({
                        startDate: "",
                        endDate: "",
                        durationInDays: durationInDays,
                        amount: selectedRenewPackage.finalAmount || "",
                        discount: 0,
                        totalPaid: 0,
                        totalPending: selectedRenewPackage.finalAmount || 0,
                        paymentDate: new Date().toISOString().split("T")[0],
                        paymentStatus: "Pending",
                        paymentMethod: "Cash",
                        transactionId: "",
                      });
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all"
                  >
                    Continue
                  </button>
                  <button
                    onClick={() => {
                      setIsRenewModalOpen(false);
                      setSelectedRenewPackage(null);
                    }}
                    className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-white mb-3">
                    Renewing Package: {selectedRenewPackage.packageName}
                  </h4>
                  <div className="text-sm space-y-1">
                    <p className="text-gray-300">
                      <span className="text-gray-400">Previous Amount:</span> ₹
                      {selectedRenewPackage.finalAmount}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-400">Previous Status:</span>{" "}
                      {selectedRenewPackage.packageStatus}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-400">Previous End Date:</span>{" "}
                      {new Date(
                        selectedRenewPackage.endDate
                      ).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                </div>

                {/* Renew Form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={renewFormData.startDate}
                        onChange={(e) => {
                          const startDate = e.target.value;
                          let endDate = "";

                          // Auto-calculate end date based on package duration
                          if (startDate && renewFormData.durationInDays) {
                            const start = new Date(startDate);
                            const end = new Date(start);
                            end.setDate(
                              end.getDate() + renewFormData.durationInDays
                            );
                            endDate = end.toISOString().split("T")[0];
                          }

                          setRenewFormData({
                            ...renewFormData,
                            startDate: startDate,
                            endDate: endDate,
                          });
                        }}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        End Date (Auto-calculated)
                      </label>
                      <input
                        type="text"
                        value={
                          renewFormData.endDate
                            ? new Date(
                                renewFormData.endDate
                              ).toLocaleDateString("en-GB")
                            : "Select start date first"
                        }
                        readOnly
                        className="w-full px-4 py-2 bg-gray-600 border border-gray-600 rounded-lg text-white cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Duration: {renewFormData.durationInDays} days
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Amount *
                      </label>
                      <input
                        type="number"
                        value={renewFormData.amount}
                        onChange={(e) => {
                          const amount = parseFloat(e.target.value) || 0;
                          const discount = renewFormData.discount || 0;
                          const finalAmount = amount - discount;
                          const paid = renewFormData.totalPaid || 0;
                          setRenewFormData({
                            ...renewFormData,
                            amount: e.target.value,
                            totalPending: Math.max(0, finalAmount - paid),
                          });
                        }}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Discount
                      </label>
                      <input
                        type="number"
                        value={renewFormData.discount}
                        onChange={(e) => {
                          const discount = parseFloat(e.target.value) || 0;
                          const amount = renewFormData.amount || 0;
                          const finalAmount = amount - discount;
                          const paid = renewFormData.totalPaid || 0;
                          setRenewFormData({
                            ...renewFormData,
                            discount: e.target.value,
                            totalPending: Math.max(0, finalAmount - paid),
                          });
                        }}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Amount Paid
                      </label>
                      <input
                        type="number"
                        value={renewFormData.totalPaid}
                        onChange={(e) => {
                          const paid = parseFloat(e.target.value) || 0;
                          const amount = renewFormData.amount || 0;
                          const discount = renewFormData.discount || 0;
                          const finalAmount = amount - discount;
                          setRenewFormData({
                            ...renewFormData,
                            totalPaid: e.target.value,
                            totalPending: Math.max(0, finalAmount - paid),
                          });
                        }}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Payment Date
                      </label>
                      <input
                        type="date"
                        value={renewFormData.paymentDate}
                        onChange={(e) =>
                          setRenewFormData({
                            ...renewFormData,
                            paymentDate: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Payment Status
                    </label>
                    <select
                      value={renewFormData.paymentStatus}
                      onChange={(e) =>
                        setRenewFormData({
                          ...renewFormData,
                          paymentStatus: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Partial">Partial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Payment Method
                    </label>
                    <select
                      value={renewFormData.paymentMethod}
                      onChange={(e) =>
                        setRenewFormData({
                          ...renewFormData,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="UPI">UPI</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Transaction ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={renewFormData.transactionId}
                      onChange={(e) =>
                        setRenewFormData({
                          ...renewFormData,
                          transactionId: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter transaction ID if available"
                    />
                  </div>

                  {/* Summary Box */}
                  <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-700/30 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-400">Final Amount:</p>
                        <p className="text-white font-semibold text-lg">
                          ₹
                          {(
                            (parseFloat(renewFormData.amount) || 0) -
                            (parseFloat(renewFormData.discount) || 0)
                          ).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Amount Due:</p>
                        <p className="text-yellow-400 font-semibold text-lg">
                          ₹{renewFormData.totalPending}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={async () => {
                      try {
                        // Validation
                        if (
                          !renewFormData.startDate ||
                          !renewFormData.endDate
                        ) {
                          toast.error("Please fill start and end dates");
                          return;
                        }
                        if (
                          !renewFormData.amount ||
                          renewFormData.amount <= 0
                        ) {
                          toast.error("Please enter valid amount");
                          return;
                        }

                        setIsRenewing(true);

                        const response = await fetch(
                          `${
                            import.meta.env.VITE_API_BASE_URL ||
                            "http://localhost:3000"
                          }/api/admin/members/${
                            selectedMember._id
                          }/renew-package`,
                          {
                            method: "POST",
                            credentials: "include",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              packageId: selectedRenewPackage._id,
                              renewData: renewFormData,
                            }),
                          }
                        );

                        const data = await response.json();

                        if (data.success) {
                          toast.success(
                            "Package renewed successfully! Email sent with invoice."
                          );
                          setIsRenewModalOpen(false);
                          setSelectedRenewPackage(null);
                          setIsRenewFormOpen(false);
                          dispatch(
                            fetchAllMembers({
                              page: currentPage,
                              limit: membersPerPage,
                            })
                          );
                          dispatch(fetchMemberById(selectedMember._id));
                        } else {
                          toast.error(data.error || "Failed to renew package");
                        }
                      } catch (error) {
                        console.error("Error renewing package:", error);
                        toast.error("Failed to renew package");
                      } finally {
                        setIsRenewing(false);
                      }
                    }}
                    disabled={isRenewing}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isRenewing ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Renewing...</span>
                      </>
                    ) : (
                      "Renew Package"
                    )}
                  </button>
                  <button
                    onClick={() => setIsRenewFormOpen(false)}
                    className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upgrade Package Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <PackageIcon className="w-6 h-6 text-red-400" />
                Add New Package
              </h3>
              <button
                onClick={() => {
                  setIsUpgradeModalOpen(false);
                  setSelectedUpgradePackage(null);
                  setUpgradeFormData({
                    startDate: "",
                    endDate: "",
                    amount: "",
                    discount: 0,
                    totalPaid: 0,
                    totalPending: 0,
                    paymentDate: "",
                    paymentStatus: "Paid",
                    paymentMethod: "Cash",
                    transactionId: "",
                  });
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300 text-sm mb-4">
                Add a new package to this member. Previous packages will remain
                in the member's history.
              </p>

              {/* Select Package */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  Select Package *
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={selectedUpgradePackage?._id || ""}
                  onChange={(e) => {
                    const pkg = packages.find((p) => p._id === e.target.value);
                    setSelectedUpgradePackage(pkg);

                    if (pkg) {
                      // Calculate duration for selected package
                      const duration = pkg.duration;
                      const unit = duration.unit?.toLowerCase() || "months";
                      const value = duration.value || 1;
                      let durationInDays = 30;

                      if (unit === "days") {
                        durationInDays = value;
                      } else if (unit === "weeks") {
                        durationInDays = value * 7;
                      } else if (unit === "months") {
                        durationInDays = value * 30;
                      } else if (unit === "years") {
                        durationInDays = value * 365;
                      }

                      const packageAmount = pkg.originalPrice || 0;
                      const discount = upgradeFormData.discount || 0;
                      const discountType = pkg.discountType || "flat";

                      // Calculate discount amount
                      let discountAmount = 0;
                      if (discountType === "percentage") {
                        discountAmount = (packageAmount * discount) / 100;
                      } else {
                        discountAmount = discount;
                      }

                      const finalAmount = packageAmount - discountAmount;

                      // Calculate totalPaid and totalPending based on current payment status
                      let totalPaid = upgradeFormData.totalPaid || 0;
                      if (upgradeFormData.paymentStatus === "Paid") {
                        totalPaid = finalAmount;
                      } else if (upgradeFormData.paymentStatus === "Pending") {
                        totalPaid = 0;
                      }

                      setUpgradeFormData({
                        ...upgradeFormData,
                        durationInDays: durationInDays,
                        amount: packageAmount,
                        discountType: discountType,
                        maxDiscount:
                          discountType === "percentage"
                            ? Math.round(
                                (pkg.savings / pkg.originalPrice) * 100
                              )
                            : pkg.savings || 0,
                        totalPaid: totalPaid,
                        totalPending: Math.max(0, finalAmount - totalPaid),
                      });
                    }
                  }}
                >
                  <option value="">-- Select Package --</option>
                  {packages.map((pkg) => (
                    <option key={pkg._id} value={pkg._id}>
                      {pkg.packageName} ({pkg.duration.value}{" "}
                      {pkg.duration.unit})
                    </option>
                  ))}
                </select>
              </div>

              {selectedUpgradePackage && (
                <>
                  {/* Package Details Preview */}
                  <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Selected Package
                    </h4>
                    <div className="text-sm space-y-1">
                      <p className="text-gray-300">
                        {selectedUpgradePackage.packageName}
                      </p>
                      <p className="text-gray-400">
                        {selectedUpgradePackage.category}
                      </p>
                      <p className="text-gray-400">
                        Amount: ₹{selectedUpgradePackage.discountedPrice}
                      </p>
                      <p className="text-gray-400">
                        Duration: {selectedUpgradePackage.duration.value}{" "}
                        {selectedUpgradePackage.duration.unit}
                      </p>
                    </div>
                  </div>

                  {/* Optional: Handle Old Package */}
                  <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 space-y-3">
                    <h4 className="text-sm font-semibold text-gray-300">
                      Optional: Manage Existing Package
                    </h4>
                    <p className="text-xs text-gray-400">
                      You can optionally expire or delete an existing package.
                      Leave empty to keep all existing packages.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Select Package to Remove (Optional)
                        </label>
                        <select
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                          value={selectedOldPackage?._id || ""}
                          onChange={(e) => {
                            const pkg = selectedMember.packages.find(
                              (p) => p._id === e.target.value
                            );
                            setSelectedOldPackage(pkg || null);
                          }}
                        >
                          <option value="">-- Keep All Packages --</option>
                          {selectedMember.packages.map((pkg) => (
                            <option key={pkg._id} value={pkg._id}>
                              {pkg.packageName} - {pkg.packageType} (
                              {pkg.packageStatus})
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedOldPackage && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Action for Selected Package
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="oldPackageAction"
                                value="expire"
                                checked={oldPackageAction === "expire"}
                                onChange={(e) =>
                                  setOldPackageAction(e.target.value)
                                }
                                className="w-4 h-4 text-red-600 focus:ring-red-500"
                              />
                              <span className="text-white text-sm">
                                Expire (Keep in history)
                              </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="oldPackageAction"
                                value="delete"
                                checked={oldPackageAction === "delete"}
                                onChange={(e) =>
                                  setOldPackageAction(e.target.value)
                                }
                                className="w-4 h-4 text-red-600 focus:ring-red-500"
                              />
                              <span className="text-white text-sm">
                                Delete (Remove completely)
                              </span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Form */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          value={upgradeFormData.startDate}
                          onChange={(e) => {
                            const startDate = e.target.value;
                            let endDate = "";

                            if (startDate && upgradeFormData.durationInDays) {
                              const start = new Date(startDate);
                              const end = new Date(start);
                              end.setDate(
                                end.getDate() + upgradeFormData.durationInDays
                              );
                              endDate = end.toISOString().split("T")[0];
                            }

                            setUpgradeFormData({
                              ...upgradeFormData,
                              startDate: startDate,
                              endDate: endDate,
                            });
                          }}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          End Date (Auto-calculated)
                        </label>
                        <input
                          type="text"
                          value={
                            upgradeFormData.endDate
                              ? new Date(
                                  upgradeFormData.endDate
                                ).toLocaleDateString("en-GB")
                              : "Select start date first"
                          }
                          readOnly
                          className="w-full px-4 py-2 bg-gray-600 border border-gray-600 rounded-lg text-white cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Duration: {upgradeFormData.durationInDays} days
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Amount *
                        </label>
                        <input
                          type="number"
                          value={upgradeFormData.amount}
                          onChange={(e) => {
                            const amount = parseFloat(e.target.value) || 0;
                            const discount = upgradeFormData.discount || 0;
                            const finalAmount = amount - discount;
                            const paid = upgradeFormData.totalPaid || 0;
                            setUpgradeFormData({
                              ...upgradeFormData,
                              amount: e.target.value,
                              totalPending: Math.max(0, finalAmount - paid),
                            });
                          }}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="0"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Discount
                        </label>
                        <input
                          type="number"
                          value={upgradeFormData.discount}
                          onChange={(e) => {
                            const discount = parseFloat(e.target.value) || 0;
                            const amount = upgradeFormData.amount || 0;
                            const finalAmount = amount - discount;
                            const paid = upgradeFormData.totalPaid || 0;
                            setUpgradeFormData({
                              ...upgradeFormData,
                              discount: e.target.value,
                              totalPending: Math.max(0, finalAmount - paid),
                            });
                          }}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Amount Paid
                        </label>
                        <input
                          type="number"
                          value={upgradeFormData.totalPaid}
                          onChange={(e) => {
                            const paid = parseFloat(e.target.value) || 0;
                            const amount = upgradeFormData.amount || 0;
                            const discount = upgradeFormData.discount || 0;
                            const finalAmount = amount - discount;
                            setUpgradeFormData({
                              ...upgradeFormData,
                              totalPaid: e.target.value,
                              totalPending: Math.max(0, finalAmount - paid),
                            });
                          }}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Payment Date
                        </label>
                        <input
                          type="date"
                          value={upgradeFormData.paymentDate}
                          onChange={(e) =>
                            setUpgradeFormData({
                              ...upgradeFormData,
                              paymentDate: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Payment Status
                      </label>
                      <select
                        value={upgradeFormData.paymentStatus}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          const amount =
                            parseFloat(upgradeFormData.amount) || 0;
                          const discount =
                            parseFloat(upgradeFormData.discount) || 0;
                          const finalAmount = amount - discount;

                          // Auto-fill paid amount based on status
                          let newPaid =
                            parseFloat(upgradeFormData.totalPaid) || 0;
                          if (newStatus === "Paid") {
                            newPaid = finalAmount;
                          } else if (newStatus === "Pending") {
                            newPaid = 0;
                          }

                          setUpgradeFormData({
                            ...upgradeFormData,
                            paymentStatus: newStatus,
                            totalPaid: newPaid,
                            totalPending: Math.max(0, finalAmount - newPaid),
                          });
                        }}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Partial">Partial</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Payment Method
                      </label>
                      <select
                        value={upgradeFormData.paymentMethod}
                        onChange={(e) =>
                          setUpgradeFormData({
                            ...upgradeFormData,
                            paymentMethod: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="Cash">Cash</option>
                        <option value="Card">Card</option>
                        <option value="UPI">UPI</option>
                        <option value="Online">Online</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Transaction ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={upgradeFormData.transactionId}
                        onChange={(e) =>
                          setUpgradeFormData({
                            ...upgradeFormData,
                            transactionId: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter transaction ID if available"
                      />
                    </div>

                    {/* Summary Box */}
                    <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-700/30 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-400">Final Amount:</p>
                          <p className="text-white font-semibold text-lg">
                            ₹
                            {(
                              (parseFloat(upgradeFormData.amount) || 0) -
                              (parseFloat(upgradeFormData.discount) || 0)
                            ).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Amount Due:</p>
                          <p className="text-yellow-400 font-semibold text-lg">
                            ₹{upgradeFormData.totalPending}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={async () => {
                        try {
                          if (!selectedUpgradePackage) {
                            toast.error("Please select a package");
                            return;
                          }
                          if (
                            !upgradeFormData.startDate ||
                            !upgradeFormData.endDate
                          ) {
                            toast.error("Please fill start and end dates");
                            return;
                          }
                          if (
                            !upgradeFormData.amount ||
                            upgradeFormData.amount <= 0
                          ) {
                            toast.error("Please enter valid amount");
                            return;
                          }

                          setIsUpgrading(true);

                          const response = await fetch(
                            `${
                              import.meta.env.VITE_API_BASE_URL ||
                              "http://localhost:3000"
                            }/api/admin/members/${
                              selectedMember._id
                            }/upgrade-package`,
                            {
                              method: "POST",
                              credentials: "include",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                packageId: selectedUpgradePackage._id,
                                startDate: upgradeFormData.startDate,
                                endDate: upgradeFormData.endDate,
                                amount: upgradeFormData.amount,
                                discount: upgradeFormData.discount,
                                totalPaid: upgradeFormData.totalPaid,
                                totalPending: upgradeFormData.totalPending,
                                paymentDate: upgradeFormData.paymentDate,
                                paymentStatus: upgradeFormData.paymentStatus,
                                paymentMethod: upgradeFormData.paymentMethod,
                                transactionId: upgradeFormData.transactionId,
                                // Optional old package handling
                                oldPackageId: selectedOldPackage?._id || null,
                                oldPackageAction: selectedOldPackage
                                  ? oldPackageAction
                                  : null,
                              }),
                            }
                          );

                          const data = await response.json();

                          if (data.success) {
                            toast.success(
                              "Package added successfully! Email sent with invoice."
                            );
                            setIsUpgradeModalOpen(false);
                            setSelectedUpgradePackage(null);
                            setSelectedOldPackage(null);
                            setOldPackageAction("expire");
                            setUpgradeFormData({
                              startDate: "",
                              endDate: "",
                              amount: "",
                              discount: 0,
                              totalPaid: 0,
                              totalPending: 0,
                              paymentDate: "",
                              paymentStatus: "Paid",
                              paymentMethod: "Cash",
                              transactionId: "",
                            });
                            dispatch(
                              fetchAllMembers({
                                page: currentPage,
                                limit: membersPerPage,
                              })
                            );
                            dispatch(fetchMemberById(selectedMember._id));
                          } else {
                            toast.error(data.error || "Failed to add package");
                          }
                        } catch (error) {
                          console.error("Error adding package:", error);
                          toast.error("Failed to add package");
                        } finally {
                          setIsUpgrading(false);
                        }
                      }}
                      disabled={isUpgrading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isUpgrading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Adding...</span>
                        </>
                      ) : (
                        "Upgrade Package"
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsUpgradeModalOpen(false);
                        setSelectedUpgradePackage(null);
                        setSelectedOldPackage(null);
                        setOldPackageAction("expire");
                      }}
                      className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Freeze Package Selection Modal */}
      {isFreezeSelectionModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <PackageIcon className="w-6 h-6 text-blue-400" />
                Freeze Package
              </h3>
              <button
                onClick={() => setIsFreezeSelectionModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                Select a package to freeze from the member's packages:
              </p>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Package
              </label>
              <select
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => {
                  const selectedPkgId = e.target.value;
                  if (selectedPkgId) {
                    const packageToFreeze = selectedMember.packages.find(
                      (p) => p._id === selectedPkgId
                    );
                    if (packageToFreeze) {
                      const isFreezable =
                        packageToFreeze.freezable ||
                        packageToFreeze.packageId?.freezable;
                      if (isFreezable) {
                        setSelectedFreezePackage(packageToFreeze);
                        setFreezeStartDate("");
                        setFreezeEndDate("");
                        setIsFreezeSelectionModalOpen(false);
                        setIsFreezeModalOpen(true);
                      } else {
                        toast.error("This package cannot be frozen");
                      }
                    }
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  -- Select Package --
                </option>
                {selectedMember.packages.map((p) => {
                  const isFreezable = p.freezable || p.packageId?.freezable;
                  return (
                    <option key={p._id} value={p._id} disabled={!isFreezable}>
                      {p.packageName} - {p.packageStatus}{" "}
                      {!isFreezable ? "(Not Freezable)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsFreezeSelectionModalOpen(false)}
                className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extension Package Selection Modal */}
      {isExtensionSelectionModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <PackageIcon className="w-6 h-6 text-green-400" />
                Extend Package
              </h3>
              <button
                onClick={() => setIsExtensionSelectionModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                Select a package to extend from the member's packages:
              </p>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Package
              </label>
              <select
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onChange={(e) => {
                  const selectedPkgId = e.target.value;
                  if (selectedPkgId) {
                    const packageToExtend = selectedMember.packages.find(
                      (p) => p._id === selectedPkgId
                    );
                    if (packageToExtend) {
                      setSelectedExtensionPackage(packageToExtend);
                      setExtensionDays("");
                      setAddExtraAmount(false);
                      setExtensionAmount("");
                      setExtensionPaid("");
                      setIsExtensionSelectionModalOpen(false);
                      setIsExtensionModalOpen(true);
                    }
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  -- Select Package --
                </option>
                {selectedMember.packages.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.packageName} - {p.packageStatus}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsExtensionSelectionModalOpen(false)}
                className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Freeze Package Modal */}
      {isFreezeModalOpen && selectedFreezePackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <PackageIcon className="w-6 h-6 text-blue-400" />
                Freeze Package
              </h3>
              <button
                onClick={() => {
                  setIsFreezeModalOpen(false);
                  setSelectedFreezePackage(null);
                  setFreezeStartDate("");
                  setFreezeEndDate("");
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-2">Package:</p>
                <p className="text-white font-semibold">
                  {selectedFreezePackage.packageName}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Current End Date:{" "}
                  {formatDateForDisplay(selectedFreezePackage.endDate)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Freeze Start Date *
                  </label>
                  <input
                    type="date"
                    value={freezeStartDate}
                    onChange={(e) => {
                      setFreezeStartDate(e.target.value);
                      // Auto-calculate days if both dates are set
                      if (freezeEndDate && e.target.value) {
                        const start = new Date(e.target.value);
                        const end = new Date(freezeEndDate);
                        if (end >= start) {
                          const days = Math.ceil(
                            (end - start) / (1000 * 60 * 60 * 24)
                          );
                          // Extension days = freeze period
                        }
                      }
                    }}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Freeze End Date *
                  </label>
                  <input
                    type="date"
                    value={freezeEndDate}
                    min={freezeStartDate}
                    onChange={(e) => setFreezeEndDate(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {freezeStartDate && freezeEndDate && (
                <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3">
                  <p className="text-sm text-blue-400">
                    Freeze Period:{" "}
                    {Math.ceil(
                      (new Date(freezeEndDate) - new Date(freezeStartDate)) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </p>
                  <p className="text-sm text-blue-400 mt-1">
                    New End Date:{" "}
                    {(() => {
                      const currentEnd = new Date(
                        selectedFreezePackage.endDate
                      );
                      const freezeDays = Math.ceil(
                        (new Date(freezeEndDate) - new Date(freezeStartDate)) /
                          (1000 * 60 * 60 * 24)
                      );
                      currentEnd.setDate(currentEnd.getDate() + freezeDays);
                      return formatDateForDisplay(currentEnd);
                    })()}
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={async () => {
                    if (!freezeStartDate || !freezeEndDate) {
                      toast.error("Please select freeze start and end dates");
                      return;
                    }

                    const start = new Date(freezeStartDate);
                    const end = new Date(freezeEndDate);

                    if (end <= start) {
                      toast.error("End date must be after start date");
                      return;
                    }

                    const freezeDays = Math.ceil(
                      (end - start) / (1000 * 60 * 60 * 24)
                    );

                    setIsFreezing(true);
                    try {
                      const response = await fetch(
                        `${
                          import.meta.env.VITE_API_BASE_URL ||
                          "http://localhost:3000"
                        }/api/admin/members/${
                          selectedMember._id
                        }/freeze-package/${selectedFreezePackage._id}`,
                        {
                          method: "PATCH",
                          credentials: "include",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            freezeStartDate: freezeStartDate,
                            freezeEndDate: freezeEndDate,
                            freezeDays: freezeDays,
                          }),
                        }
                      );

                      const data = await response.json();

                      if (data.success) {
                        toast.success(
                          `Package frozen for ${freezeDays} days. End date extended.`
                        );
                        setIsFreezeModalOpen(false);
                        setSelectedFreezePackage(null);
                        setFreezeStartDate("");
                        setFreezeEndDate("");
                        dispatch(fetchMemberById(selectedMember._id));
                        dispatch(
                          fetchAllMembers({
                            page: currentPage,
                            limit: membersPerPage,
                          })
                        );
                      } else {
                        toast.error(data.error || "Failed to freeze package");
                      }
                    } catch (error) {
                      console.error("Error freezing package:", error);
                      toast.error("Failed to freeze package");
                    } finally {
                      setIsFreezing(false);
                    }
                  }}
                  disabled={isFreezing || !freezeStartDate || !freezeEndDate}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFreezing ? "Freezing..." : "Freeze Package"}
                </button>
                <button
                  onClick={() => {
                    setIsFreezeModalOpen(false);
                    setSelectedFreezePackage(null);
                    setFreezeStartDate("");
                    setFreezeEndDate("");
                  }}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extension Package Modal */}
      {isExtensionModalOpen && selectedExtensionPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <PackageIcon className="w-6 h-6 text-green-400" />
                Extend Package
              </h3>
              <button
                onClick={() => {
                  setIsExtensionModalOpen(false);
                  setSelectedExtensionPackage(null);
                  setExtensionDays("");
                  setAddExtraAmount(false);
                  setExtensionAmount("");
                  setExtensionPaid("");
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-2">Package:</p>
                <p className="text-white font-semibold">
                  {selectedExtensionPackage.packageName}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Current End Date:{" "}
                  {formatDateForDisplay(selectedExtensionPackage.endDate)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Extension Days *
                </label>
                <input
                  type="number"
                  min="1"
                  value={extensionDays}
                  onChange={(e) => setExtensionDays(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter number of days"
                />
                {extensionDays && parseInt(extensionDays) > 0 && (
                  <p className="text-sm text-green-400 mt-2">
                    New End Date:{" "}
                    {(() => {
                      const currentEnd = new Date(
                        selectedExtensionPackage.endDate
                      );
                      currentEnd.setDate(
                        currentEnd.getDate() + parseInt(extensionDays)
                      );
                      return formatDateForDisplay(currentEnd);
                    })()}
                  </p>
                )}
              </div>

              <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addExtraAmount}
                    onChange={(e) => {
                      setAddExtraAmount(e.target.checked);
                      if (!e.target.checked) {
                        setExtensionAmount("");
                        setExtensionPaid("");
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-white font-medium">
                    Add Extra Amount for Extension
                  </span>
                </label>
              </div>

              {addExtraAmount && (
                <div className="space-y-3 bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Extra Amount *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={extensionAmount}
                      onChange={(e) => setExtensionAmount(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount Paid *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={extensionPaid}
                      onChange={(e) => setExtensionPaid(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0"
                    />
                  </div>
                  {extensionAmount && extensionPaid && (
                    <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-lg p-3">
                      <p className="text-sm text-yellow-400">
                        Due Amount: ₹
                        {Math.max(
                          0,
                          parseFloat(extensionAmount) -
                            parseFloat(extensionPaid)
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={async () => {
                    if (!extensionDays || parseInt(extensionDays) <= 0) {
                      toast.error("Please enter valid number of days");
                      return;
                    }

                    if (addExtraAmount) {
                      if (
                        !extensionAmount ||
                        parseFloat(extensionAmount) <= 0
                      ) {
                        toast.error("Please enter valid extra amount");
                        return;
                      }
                      if (!extensionPaid || parseFloat(extensionPaid) < 0) {
                        toast.error("Please enter valid paid amount");
                        return;
                      }
                    }

                    setIsExtending(true);
                    try {
                      const response = await fetch(
                        `${
                          import.meta.env.VITE_API_BASE_URL ||
                          "http://localhost:3000"
                        }/api/admin/members/${
                          selectedMember._id
                        }/extend-package/${selectedExtensionPackage._id}`,
                        {
                          method: "PATCH",
                          credentials: "include",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            extensionDays: parseInt(extensionDays),
                            addExtraAmount: addExtraAmount,
                            extraAmount: addExtraAmount
                              ? parseFloat(extensionAmount)
                              : 0,
                            amountPaid: addExtraAmount
                              ? parseFloat(extensionPaid)
                              : 0,
                          }),
                        }
                      );

                      const data = await response.json();

                      if (data.success) {
                        toast.success(
                          `Package extended by ${extensionDays} days successfully!`
                        );
                        setIsExtensionModalOpen(false);
                        setSelectedExtensionPackage(null);
                        setExtensionDays("");
                        setAddExtraAmount(false);
                        setExtensionAmount("");
                        setExtensionPaid("");
                        dispatch(fetchMemberById(selectedMember._id));
                        dispatch(
                          fetchAllMembers({
                            page: currentPage,
                            limit: membersPerPage,
                          })
                        );
                      } else {
                        toast.error(data.error || "Failed to extend package");
                      }
                    } catch (error) {
                      console.error("Error extending package:", error);
                      toast.error("Failed to extend package");
                    } finally {
                      setIsExtending(false);
                    }
                  }}
                  disabled={
                    isExtending ||
                    !extensionDays ||
                    parseInt(extensionDays) <= 0
                  }
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExtending ? "Extending..." : "Extend Package"}
                </button>
                <button
                  onClick={() => {
                    setIsExtensionModalOpen(false);
                    setSelectedExtensionPackage(null);
                    setExtensionDays("");
                    setAddExtraAmount(false);
                    setExtensionAmount("");
                    setExtensionPaid("");
                  }}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Member Drawer - Keep existing drawer code */}
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
          onClick={() => setIsDrawerOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-full sm:w-[600px] bg-gray-800 border-l border-gray-700 shadow-2xl transition-transform duration-300 overflow-y-auto ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-red-600 to-red-700 sticky top-0 z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">
                  {editMode ? "Edit Member" : "Add New Member"}
                </h2>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setCurrentStep(1);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span>
                    Step {currentStep} of {totalSteps}
                  </span>
                  <span>
                    {Math.round(((currentStep - 1) / totalSteps) * 100)}%
                    Complete
                  </span>
                </div>

                {/* Progress Bar Track */}
                <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${((currentStep - 1) / totalSteps) * 100}%`,
                    }}
                  />
                </div>

                {/* Step Indicators */}
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className="flex flex-col items-center flex-1"
                    >
                      <button
                        onClick={() => goToStep(step)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${
                          step < currentStep
                            ? "bg-white text-red-600"
                            : step === currentStep
                            ? "bg-white text-red-600 ring-4 ring-white/30"
                            : "bg-white/30 text-white/60"
                        }`}
                      >
                        {step}
                      </button>
                      <span
                        className={`text-xs mt-1 ${
                          step <= currentStep ? "text-white" : "text-white/50"
                        }`}
                      >
                        {step === 1
                          ? "Basic Info"
                          : step === 2
                          ? "Package & Payment"
                          : "Trainer"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 p-6 space-y-6">
              {/* STEP 1: Basic Information */}
              {currentStep === 1 && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                      Personal Information
                    </h3>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Registration Number
                      </label>
                      <input
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Auto-generated (e.g., FLM0003) or enter manually"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Leave empty to auto-generate (FLM####)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Member Joining Date *
                      </label>
                      <input
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate || ""}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        The date when member joined the gym
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Due Date (Optional)
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Optional: a due date associated with the member
                      </p>
                    </div>

                    {/* Profile Picture Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Profile Picture
                      </label>
                      <div className="flex items-center gap-4">
                        {profilePicPreview && (
                          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-red-500">
                            <img
                              src={profilePicPreview}
                              alt="Profile preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePicChange}
                            className="hidden"
                            id="profile-pic-upload"
                          />
                          <label
                            htmlFor="profile-pic-upload"
                            className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-block"
                          >
                            Choose Image
                          </label>
                          <p className="text-xs text-gray-400 mt-2">
                            Max size: 5MB. Formats: JPG, PNG
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Document Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <PackageIcon className="w-4 h-4 inline mr-2" />
                        Documents
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,image/*"
                        multiple
                        onChange={handleDocumentChange}
                        className="hidden"
                        id="document-upload"
                      />
                      <label
                        htmlFor="document-upload"
                        className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
                      >
                        Upload Documents
                      </label>
                      <p className="text-xs text-gray-400 mt-2">
                        Max size: 10MB per file. Formats: PDF, DOC, DOCX, JPG,
                        PNG
                      </p>
                      {documentFiles.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {documentFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-700 p-2 rounded"
                            >
                              <span className="text-sm text-white truncate flex-1">
                                {file.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeDocument(index)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {formData.documents && formData.documents.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-gray-400">
                            Existing documents:
                          </p>
                          {formData.documents.map((doc, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-600 p-2 rounded"
                            >
                              <span className="text-sm text-white truncate flex-1">
                                {doc.name}
                              </span>
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-xs"
                              >
                                View
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter member's full name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="member@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Phone *
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="+91-1234567890"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Blood Group
                        </label>
                        <select
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="Unknown">Unknown</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Vaccination Status
                        </label>
                        <select
                          name="vaccinationStatus"
                          value={formData.vaccinationStatus}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="Not Vaccinated">Not Vaccinated</option>
                          <option value="Partially Vaccinated">
                            Partially Vaccinated
                          </option>
                          <option value="Vaccinated">Vaccinated</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                      Emergency Contact
                    </h3>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        name="emergencyContact.name"
                        value={formData.emergencyContact.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Emergency contact name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Relationship
                        </label>
                        <input
                          type="text"
                          name="emergencyContact.relationship"
                          value={formData.emergencyContact.relationship}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="e.g., Father, Mother, Spouse"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="emergencyContact.phone"
                          value={formData.emergencyContact.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Emergency contact phone"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sales Representative */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                      Sales Information
                    </h3>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Sales Representative
                      </label>
                      <input
                        type="text"
                        name="salesRepresentative"
                        value={formData.salesRepresentative}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter sales representative name"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* STEP 2: Package & Payment */}
              {currentStep === 2 && (
                <>
                  {/* Package Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                      Add Package {!editMode && "*"}
                    </h3>

                    {/* Added Packages List */}
                    {formData.packages.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-400">Added Packages:</p>
                        <div className="bg-gray-700/50 p-3 rounded-lg mb-3">
                          <p className="text-xs text-gray-400 mb-1">
                            Overall Payment Summary:
                          </p>
                          <p className="text-sm text-white">
                            Total Paid:{" "}
                            <span className="text-green-400 font-semibold">
                              ₹{formData.totalPaid || 0}
                            </span>{" "}
                            • Total Pending:{" "}
                            <span className="text-yellow-400 font-semibold">
                              ₹{formData.totalPending || 0}
                            </span>
                          </p>
                        </div>
                        {formData.packages.map((pkg, index) => {
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
                            >
                              <div className="flex-1">
                                <p className="text-white font-semibold">
                                  {pkg.packageName}
                                </p>
                                <p className="text-xs text-gray-400">
                                  ₹{pkg.finalAmount || pkg.amount} • Status:{" "}
                                  <span
                                    className={`font-semibold ${
                                      pkg.paymentStatus === "Paid"
                                        ? "text-green-400"
                                        : pkg.paymentStatus === "Pending"
                                        ? "text-yellow-400"
                                        : "text-blue-400"
                                    }`}
                                  >
                                    {pkg.paymentStatus}
                                  </span>
                                  {pkg.isPrimary && " • ⭐ Primary"}
                                </p>
                              </div>
                              <button
                                onClick={() => removePackageFromForm(index)}
                                className="p-2 hover:bg-red-900/30 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Package Type Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <Filter className="w-4 h-4 inline mr-2" />
                        Filter by Package Type
                      </label>
                      <select
                        value={packageTypeFilter}
                        onChange={(e) => setPackageTypeFilter(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">All Package Types</option>
                        <option value="Membership">Membership</option>
                        <option value="Personal Training">
                          Personal Training
                        </option>
                        <option value="Group Classes">Group Classes</option>
                        <option value="Day Pass">Day Pass</option>
                        <option value="Corporate">Corporate</option>
                        <option value="Special">Special Offer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Select Package *
                      </label>
                      <select
                        name="packageId"
                        value={packageFormData.packageId}
                        onChange={handlePackageInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
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
                        <option value="">
                          Choose a package
                          {packageTypeFilter ? ` (${packageTypeFilter})` : ""}
                        </option>
                        {packages &&
                          packages
                            .filter(
                              (pkg) =>
                                !packageTypeFilter ||
                                pkg.packageType === packageTypeFilter
                            )
                            .map((pkg) => (
                              <option key={pkg._id} value={pkg._id}>
                                {pkg.packageName} ({pkg.packageType})
                              </option>
                            ))}
                      </select>
                      {packageTypeFilter && (
                        <p className="text-xs text-gray-400 mt-1">
                          Showing{" "}
                          {packages?.filter(
                            (pkg) => pkg.packageType === packageTypeFilter
                          ).length || 0}{" "}
                          {packageTypeFilter} packages
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Start Date *
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={packageFormData.startDate || ""}
                          onChange={handlePackageInputChange}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          End Date (Auto-calculated)
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={packageFormData.endDate || ""}
                          disabled
                          className="w-full px-4 py-3 bg-gray-600 border border-gray-600 rounded-lg text-gray-300 cursor-not-allowed"
                          title="End date is automatically calculated based on package duration"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <IndianRupee className="w-4 h-4 inline mr-2" />
                          Amount *
                        </label>
                        <input
                          type="number"
                          name="amount"
                          value={packageFormData.amount}
                          onChange={handlePackageInputChange}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Enter amount"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Discount{" "}
                          {packageFormData.discountType === "percentage"
                            ? `(Max ${packageFormData.maxDiscount || 0}%)`
                            : `(Max ₹${packageFormData.maxDiscount || 0})`}
                        </label>
                        <input
                          type="number"
                          name="discount"
                          value={packageFormData.discount}
                          onChange={handlePackageInputChange}
                          max={packageFormData.maxDiscount || 0}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <IndianRupee className="w-4 h-4 inline mr-2" />
                          Total Paid
                        </label>
                        <input
                          type="number"
                          name="totalPaid"
                          value={packageFormData.totalPaid}
                          onChange={handlePackageInputChange}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <IndianRupee className="w-4 h-4 inline mr-2" />
                          Total Pending (Due)
                        </label>
                        <input
                          type="number"
                          name="totalPending"
                          value={packageFormData.totalPending}
                          readOnly
                          className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-gray-300 cursor-not-allowed"
                          placeholder="Auto-calculated"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Payment Date
                        </label>
                        <input
                          type="date"
                          name="paymentDate"
                          value={packageFormData.paymentDate || ""}
                          onChange={handlePackageInputChange}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Payment Status
                        </label>
                        <select
                          name="paymentStatus"
                          value={packageFormData.paymentStatus}
                          onChange={handlePackageInputChange}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="Paid">Paid</option>
                          <option value="Pending">Pending</option>
                          <option value="Partial">Partial</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Payment Method
                        </label>
                        <select
                          name="paymentMethod"
                          value={packageFormData.paymentMethod}
                          onChange={handlePackageInputChange}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="Cash">Cash</option>
                          <option value="Card">Card</option>
                          <option value="UPI">UPI</option>
                          <option value="Net Banking">Net Banking</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Transaction ID
                      </label>
                      <input
                        type="text"
                        name="transactionId"
                        value={packageFormData.transactionId}
                        onChange={handlePackageInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Optional"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={addPackageToForm}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add Package
                    </button>
                  </div>
                </>
              )}

              {/* STEP 3: Trainer Information */}
              {currentStep === 3 && (
                <>
                  {/* Trainer Assignment */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                      Member Settings
                    </h3>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        <Users className="w-4 h-4 inline mr-2" />
                        Assign Trainer
                      </label>
                      <select
                        name="assignedTrainer"
                        value={formData.assignedTrainer}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">No Trainer</option>
                        {trainers.map((trainer) => (
                          <option key={trainer._id} value={trainer._id}>
                            {trainer.fullName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                      Additional Notes
                    </h3>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows="5"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Additional notes about the member..."
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4 sticky bottom-0 bg-gray-800 pb-6 border-t border-gray-700 mt-6">
                {/* Previous Button */}
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                  >
                    ← Previous
                  </button>
                )}

                {/* Cancel Button (only on first step) */}
                {currentStep === 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setCurrentStep(1);
                    }}
                    className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                )}

                {/* Next or Submit Button */}
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all flex items-center justify-center gap-2"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || isUploading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUploading
                      ? "Uploading Files..."
                      : isLoading
                      ? "Processing..."
                      : editMode
                      ? "✓ Update Member"
                      : "✓ Add Member"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Import Modal */}
      {isBulkImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-green-600 to-green-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Upload className="w-6 h-6 text-white" />
                  <h2 className="text-2xl font-bold text-white">
                    Bulk Import Members
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setIsBulkImportOpen(false);
                    setBulkImportFile(null);
                    setBulkImportData([]);
                    setImportResults(null);
                    setValidationResults(null);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
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
                <ul className="text-blue-300 text-sm space-y-1 ml-6 list-disc">
                  <li>Download the template and fill in member details</li>
                  <li>
                    Package name must match exactly with existing packages
                  </li>
                  <li>Start date format: YYYY-MM-DD or DD/MM/YYYY</li>
                  <li>
                    End date will be calculated automatically based on package
                    duration
                  </li>
                  <li>
                    If phone number exists, package will be added to existing
                    member
                  </li>
                </ul>
              </div>

              {/* Download Templates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={downloadTemplate}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Template
                </button>
                <button
                  onClick={downloadDemoTemplate}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FileSpreadsheet className="w-5 h-5" />
                  Download Demo Template
                </button>
              </div>

              {/* File Upload */}
              <div className="bg-gray-700/50 rounded-lg p-6">
                <label className="block text-white font-semibold mb-3">
                  Select Excel File
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                />
                {bulkImportFile && (
                  <p className="text-green-400 text-sm mt-2">
                    ✓ Selected: {bulkImportFile.name}
                  </p>
                )}
              </div>

              {/* Preview Data */}
              {bulkImportData.length > 0 && (
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-green-400" />
                    Preview: {bulkImportData.length} members found
                  </h3>

                  <div className="max-h-60 overflow-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-800 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left text-gray-300">
                            #
                          </th>
                          <th className="px-3 py-2 text-left text-gray-300">
                            Full Name
                          </th>
                          <th className="px-3 py-2 text-left text-gray-300">
                            Phone
                          </th>
                          <th className="px-3 py-2 text-left text-gray-300">
                            Package
                          </th>
                          <th className="px-3 py-2 text-left text-gray-300">
                            Start Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {bulkImportData.slice(0, 10).map((member, index) => {
                          const fullName = getExcelFieldValue(
                            member,
                            "Full Name",
                            "fullName",
                            "Name"
                          );
                          const phone = getExcelFieldValue(
                            member,
                            "Phone Number",
                            "phoneNumber",
                            "Phone"
                          );
                          const packageName = getExcelFieldValue(
                            member,
                            "Package Name",
                            "packageName",
                            "Package"
                          );
                          const startDate = getExcelFieldValue(
                            member,
                            "package start date",
                            "packageStartDate",
                            "Start Date",
                            "startDate"
                          );

                          return (
                            <tr
                              key={index}
                              className="border-t border-gray-700"
                            >
                              <td className="px-3 py-2 text-gray-400">
                                {index + 1}
                              </td>
                              <td className="px-3 py-2 text-white">
                                {fullName || "N/A"}
                              </td>
                              <td className="px-3 py-2 text-gray-300">
                                {phone || "N/A"}
                              </td>
                              <td className="px-3 py-2 text-blue-400">
                                {packageName || "N/A"}
                              </td>
                              <td className="px-3 py-2 text-gray-300">
                                {startDate || "N/A"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {bulkImportData.length > 10 && (
                      <p className="text-gray-400 text-xs mt-2 text-center">
                        Showing first 10 of {bulkImportData.length} members
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Validate Button */}
              {bulkImportData.length > 0 && !importResults && (
                <div className="flex justify-center">
                  <button
                    onClick={validateMembers}
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
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-yellow-400" />
                    Validation Results
                  </h3>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <p className="text-gray-400 text-xs mb-1">
                        Total Members
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

                  {/* Invalid Members */}
                  {validationResults.invalid > 0 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                      <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Invalid Members ({validationResults.invalid})
                      </h4>
                      <div className="max-h-60 overflow-auto space-y-3">
                        {validationResults.invalidMembers.map(
                          (invalid, index) => (
                            <div
                              key={index}
                              className="bg-gray-800/50 rounded-lg p-3"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="text-red-300 font-semibold">
                                    Row {invalid.row}: {invalid.fullName}
                                  </p>
                                  <p className="text-gray-400 text-xs">
                                    Phone: {invalid.phone || "N/A"}
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
                              {invalid.warnings &&
                                invalid.warnings.length > 0 && (
                                  <ul className="space-y-1 ml-4 mt-2 pt-2 border-t border-gray-700">
                                    {invalid.warnings.map(
                                      (warning, warnIndex) => (
                                        <li
                                          key={warnIndex}
                                          className="text-yellow-400 text-sm flex items-start gap-2"
                                        >
                                          <span className="text-yellow-500 mt-1">
                                            ⚠
                                          </span>
                                          <span>{warning}</span>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Valid Members with Warnings */}
                  {validationResults.valid > 0 && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                      <h4 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Valid Members ({validationResults.valid})
                      </h4>
                      <div className="max-h-60 overflow-auto space-y-2">
                        {validationResults.validMembers
                          .slice(0, 10)
                          .map((valid, index) => (
                            <div
                              key={index}
                              className="bg-gray-800/50 rounded-lg p-2 flex items-center justify-between"
                            >
                              <div className="flex-1">
                                <p className="text-green-300 font-medium text-sm">
                                  Row {valid.row}: {valid.fullName}
                                </p>
                                <p className="text-gray-400 text-xs">
                                  Phone: {valid.phone} | Package:{" "}
                                  {valid.package}
                                </p>
                                {valid.warnings &&
                                  valid.warnings.length > 0 && (
                                    <ul className="space-y-1 mt-1 ml-2">
                                      {valid.warnings.map(
                                        (warning, warnIndex) => (
                                          <li
                                            key={warnIndex}
                                            className="text-yellow-400 text-xs flex items-start gap-1"
                                          >
                                            <span className="text-yellow-500">
                                              ⚠
                                            </span>
                                            <span>{warning}</span>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  )}
                              </div>
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 ml-2" />
                            </div>
                          ))}
                        {validationResults.validMembers.length > 10 && (
                          <p className="text-gray-400 text-xs text-center py-2">
                            ...and {validationResults.validMembers.length - 10}{" "}
                            more valid members
                          </p>
                        )}
                      </div>
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
                              Row {failure.row}: {failure.fullName}
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
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Import Members
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addmember;
