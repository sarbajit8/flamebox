import React, { useState, useEffect } from "react";
import {
  Calendar,
  DollarSign,
  Filter,
  Download,
  Search,
  CreditCard,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  Eye,
  TrendingUp,
  User,
  Package as PackageIcon,
  CheckCircle,
  Clock,
  X,
  FileText,
  Upload,
  FileSpreadsheet,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const PaymentHistory = () => {
  // State management
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    paidTransactions: 0,
    pendingTransactions: 0,
    averageTransaction: 0,
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPayments: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filter state
  const [filters, setFilters] = useState({
    search: "",
    paymentStatus: "",
    transactionType: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
  });

  // Detail modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Excel import state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [importLoading, setImportLoading] = useState(false);
  const [validationResults, setValidationResults] = useState(null);

  // Fetch payment history
  const fetchPaymentHistory = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        ...filters,
      });

      const response = await axios.get(
        `http://localhost:3000/api/admin/payment-history?${queryParams}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setPayments(response.data.data.payments);
        setPagination(response.data.data.pagination);
        setStatistics(response.data.data.statistics);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
      toast.error("Failed to fetch payment history");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    fetchPaymentHistory(1);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
      paymentStatus: "",
      transactionType: "",
      paymentMethod: "",
      startDate: "",
      endDate: "",
    });
    setTimeout(() => fetchPaymentHistory(1), 100);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchPaymentHistory(newPage);
    }
  };

  // View payment details
  const viewPaymentDetails = async (paymentId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/admin/payment-history/${paymentId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setSelectedPayment(response.data.data);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
      toast.error("Failed to fetch payment details");
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      case "Refunded":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "Cash":
        return "💵";
      case "Card":
        return "💳";
      case "UPI":
        return "📱";
      case "Net Banking":
        return "🏦";
      case "Cheque":
        return "📝";
      default:
        return "💰";
    }
  };

  // Handle Excel file upload
  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setExcelFile(file);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        setExcelData(jsonData);
        toast.success(`Loaded ${jsonData.length} records from Excel`);

        // Auto-validate after loading
        if (jsonData.length > 0) {
          setImportLoading(true);
          try {
            const response = await axios.post(
              "http://localhost:3000/api/admin/payment-history/validate-import",
              { payments: jsonData },
              { withCredentials: true }
            );

            if (response.data.success) {
              setValidationResults(response.data.validationResults);
              toast.info("Validation complete - check results below");
            }
          } catch (error) {
            console.error("Auto-validation error:", error);
            console.error("Error details:", error.response?.data);
            toast.error(
              error.response?.data?.message ||
                "Auto-validation failed, please validate manually"
            );
          } finally {
            setImportLoading(false);
          }
        }
      } catch (error) {
        console.error("Error reading Excel file:", error);
        toast.error("Failed to read Excel file");
      }
    };

    reader.readAsBinaryString(file);
  };

  // Validate Excel data
  const validateExcelData = async () => {
    if (excelData.length === 0) {
      toast.error("Please upload an Excel file first");
      return;
    }

    console.log("Validating data:", {
      recordCount: excelData.length,
      sampleRecord: excelData[0],
    });

    setImportLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/payment-history/validate-import",
        { payments: excelData },
        { withCredentials: true }
      );

      if (response.data.success) {
        setValidationResults(response.data.validationResults);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Validation error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to validate data");
    } finally {
      setImportLoading(false);
    }
  };

  // Import Excel data
  const importExcelData = async () => {
    if (excelData.length === 0) {
      toast.error("Please upload an Excel file first");
      return;
    }

    if (!window.confirm(`Import ${excelData.length} payment records?`)) {
      return;
    }

    setImportLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/payment-history/bulk-import",
        { payments: excelData },
        { withCredentials: true }
      );

      if (response.data.success) {
        const { results } = response.data;

        console.log("Import results:", results);

        if (results.failed && results.failed.length > 0) {
          console.error("Failed records:", results.failed);
          toast.warning(
            `Imported ${results.success.length} out of ${results.total}. ${results.failed.length} failed. Check console for details.`
          );
        } else {
          toast.success(
            `Successfully imported ${results.success.length} out of ${results.total} records`
          );
        }

        // Reset and refresh
        setIsImportModalOpen(false);
        setExcelFile(null);
        setExcelData([]);
        setValidationResults(null);
        fetchPaymentHistory(1);
      }
    } catch (error) {
      console.error("Import error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to import data");
    } finally {
      setImportLoading(false);
    }
  };

  // Download demo Excel template
  const downloadDemoExcel = () => {
    const demoData = [
      {
        Name: "John Doe",
        "Purchase Date": "2024-01-15",
        "Invoice Number": "INV-2024-001",
        "Mobile Number": "+91-9876543210",
        "Sales Rep": "Sales Team",
        "Payment Mode": "upi",
        "Customer Rep": "Admin",
        Packages: "Basic Membership Plan Yearly",
        "Activation Date": "2024-01-20",
        "Expiry Date": "2025-01-20",
        "Package Duration": "12 months",
        Amount: "5000",
      },
      {
        Name: "Jane Smith",
        "Purchase Date": "2024-02-10",
        "Invoice Number": "INV-2024-002",
        "Mobile Number": "+91-9876543211",
        "Sales Rep": "Sales Team",
        "Payment Mode": "cash",
        "Customer Rep": "Manager",
        Packages: "Premium Membership Plan Monthly",
        "Activation Date": "2024-02-15",
        "Expiry Date": "2024-03-15",
        "Package Duration": "1 month",
        Amount: "1500",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(demoData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payment History");

    // Set column widths
    const maxWidth = 20;
    worksheet["!cols"] = [
      { wch: maxWidth },
      { wch: maxWidth },
      { wch: maxWidth },
      { wch: maxWidth },
      { wch: maxWidth },
      { wch: maxWidth },
      { wch: maxWidth },
      { wch: maxWidth },
      { wch: maxWidth },
      { wch: maxWidth },
      { wch: maxWidth },
      { wch: maxWidth },
    ];

    XLSX.writeFile(workbook, "Payment_History_Demo_Template.xlsx");
    toast.success("Demo template downloaded!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <IndianRupee className="w-6 h-6 text-orange-600" />
                </div>
                Payment History
              </h1>
              <p className="text-gray-600 mt-1">
                Track all transactions and payments
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={downloadDemoExcel}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Demo Template
              </button>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Import Excel
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(statistics.totalRevenue || 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {statistics.totalTransactions || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {statistics.paidTransactions || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {statistics.pendingTransactions || 0}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  placeholder="Name, phone, receipt..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={filters.paymentStatus}
                onChange={(e) =>
                  handleFilterChange("paymentStatus", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type
              </label>
              <select
                value={filters.transactionType}
                onChange={(e) =>
                  handleFilterChange("transactionType", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="New Membership">New Membership</option>
                <option value="Renewal">Renewal</option>
                <option value="Upgrade">Upgrade</option>
                <option value="Partial Payment">Partial Payment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={filters.paymentMethod}
                onChange={(e) =>
                  handleFilterChange("paymentMethod", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Methods</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cheque">Cheque</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={applyFilters}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Receipt
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <FileText className="w-12 h-12 text-gray-400" />
                        <p className="text-gray-500">
                          No payment records found
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {payment.receiptNumber || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {payment.memberName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {payment.memberPhone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {payment.packageName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {payment.transactionType}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {formatCurrency(payment.finalAmount)}
                          </p>
                          {payment.discount > 0 && (
                            <p className="text-xs text-green-600">
                              Discount: {formatCurrency(payment.discount)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {getPaymentMethodIcon(payment.paymentMethod)}{" "}
                          {payment.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            payment.paymentStatus
                          )}`}
                        >
                          {payment.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {formatDate(payment.paymentDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => viewPaymentDetails(payment._id)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && payments.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing {(pagination.currentPage - 1) * pagination.limit + 1}{" "}
                  to{" "}
                  {Math.min(
                    pagination.currentPage * pagination.limit,
                    pagination.totalPayments
                  )}{" "}
                  of {pagination.totalPayments} payments
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex gap-1">
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
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              pageNumber === pagination.currentPage
                                ? "bg-orange-600 text-white"
                                : "border border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === pagination.currentPage - 2 ||
                        pageNumber === pagination.currentPage + 2
                      ) {
                        return <span key={pageNumber}>...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Detail Modal */}
      {isDetailModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                Payment Details
              </h3>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Receipt Info */}
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Receipt Number</p>
                    <p className="text-lg font-bold text-gray-900">
                      {selectedPayment.receiptNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        selectedPayment.paymentStatus
                      )}`}
                    >
                      {selectedPayment.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Member Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Member Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedPayment.memberName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedPayment.memberPhone}
                    </p>
                  </div>
                  {selectedPayment.memberEmail && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedPayment.memberEmail}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Package Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <PackageIcon className="w-4 h-4" />
                  Package Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Package Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedPayment.packageName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedPayment.packageType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Transaction Type</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedPayment.transactionType}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(selectedPayment.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Discount</p>
                    <p className="text-sm font-medium text-green-600">
                      - {formatCurrency(selectedPayment.discount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Final Amount</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(selectedPayment.finalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Payment Method</p>
                    <p className="text-sm font-medium text-gray-900">
                      {getPaymentMethodIcon(selectedPayment.paymentMethod)}{" "}
                      {selectedPayment.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Payment Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(selectedPayment.paymentDate)}
                    </p>
                  </div>
                  {selectedPayment.transactionId && (
                    <div>
                      <p className="text-xs text-gray-500">Transaction ID</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedPayment.transactionId}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Membership Period */}
              {selectedPayment.membershipStartDate && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Membership Period
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Start Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(selectedPayment.membershipStartDate)}
                      </p>
                    </div>
                    {selectedPayment.membershipEndDate && (
                      <div>
                        <p className="text-xs text-gray-500">End Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(selectedPayment.membershipEndDate)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedPayment.notes && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Notes
                  </h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedPayment.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="w-full px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excel Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6 text-orange-600" />
                Import Payment History from Excel
              </h3>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setExcelFile(null);
                  setExcelData([]);
                  setValidationResults(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  📋 Instructions
                </h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Download the demo template to see the required format</li>
                  <li>Fill in your payment data in the same format</li>
                  <li>Upload the Excel file (.xlsx or .xls)</li>
                  <li>Click "Validate Data" to check for errors</li>
                  <li>Click "Import" to add records to the database</li>
                </ul>
              </div>

              {/* Required Columns */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Required Excel Columns:
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
                  <div>✓ Name</div>
                  <div>✓ Mobile Number</div>
                  <div>✓ Purchase Date</div>
                  <div>✓ Invoice Number</div>
                  <div>✓ Payment Mode</div>
                  <div>✓ Amount</div>
                  <div>✓ Packages</div>
                  <div>✓ Activation Date</div>
                  <div>✓ Expiry Date</div>
                  <div>• Sales Rep (optional)</div>
                  <div>• Customer Rep (optional)</div>
                  <div>• Package Duration (optional)</div>
                </div>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors">
                <input
                  type="file"
                  id="excelUpload"
                  accept=".xlsx,.xls"
                  onChange={handleExcelUpload}
                  className="hidden"
                />
                <label
                  htmlFor="excelUpload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <FileSpreadsheet className="w-16 h-16 text-gray-400 mb-3" />
                  <p className="text-lg font-medium text-gray-700 mb-1">
                    {excelFile ? excelFile.name : "Click to upload Excel file"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {excelData.length > 0
                      ? `${excelData.length} records loaded`
                      : "Support for .xlsx and .xls files"}
                  </p>
                </label>
              </div>

              {/* Validation Results */}
              {validationResults && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">
                    Validation Results:
                  </h4>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {validationResults.total}
                      </div>
                      <div className="text-xs text-blue-700">Total</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {validationResults.valid.length}
                      </div>
                      <div className="text-xs text-green-700">Valid</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {validationResults.invalid.length}
                      </div>
                      <div className="text-xs text-red-700">Invalid</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {validationResults.warnings.length}
                      </div>
                      <div className="text-xs text-yellow-700">Warnings</div>
                    </div>
                  </div>

                  {/* Invalid Records */}
                  {validationResults.invalid.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-48 overflow-y-auto">
                      <h5 className="font-semibold text-red-900 mb-2">
                        ❌ Invalid Records:
                      </h5>
                      {validationResults.invalid.map((item, index) => (
                        <div
                          key={index}
                          className="text-sm text-red-800 mb-2 pb-2 border-b border-red-200 last:border-0"
                        >
                          <strong>Row {item.index}:</strong> {item.name} -{" "}
                          {item.issues.join(", ")}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Warnings */}
                  {validationResults.warnings.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-h-48 overflow-y-auto">
                      <h5 className="font-semibold text-yellow-900 mb-2">
                        ⚠️ Warnings:
                      </h5>
                      {validationResults.warnings.map((item, index) => (
                        <div
                          key={index}
                          className="text-sm text-yellow-800 mb-2 pb-2 border-b border-yellow-200 last:border-0"
                        >
                          <strong>Row {item.index}:</strong> {item.name} -{" "}
                          {item.warnings.join(", ")}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={validateExcelData}
                  disabled={excelData.length === 0 || importLoading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {importLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Validating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Validate Data
                    </>
                  )}
                </button>
                <button
                  onClick={importExcelData}
                  disabled={
                    excelData.length === 0 ||
                    importLoading ||
                    (validationResults && validationResults.invalid.length > 0)
                  }
                  className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {importLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Import to Database
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

export default PaymentHistory;
