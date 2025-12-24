# Payment History Excel Import Guide

## 📊 Schema Updated to Match Your Excel Data

Your PaymentHistory schema now supports all fields from your Excel file:

### Excel Columns → Database Fields

| Excel Column     | Database Field(s)                         |
| ---------------- | ----------------------------------------- |
| Name             | memberName                                |
| Purchase Date    | purchaseDate, paymentDate                 |
| Invoice Number   | invoiceNumber, transactionId              |
| Mobile Number    | memberPhone                               |
| Sales Rep        | salesRep                                  |
| Payment Mode     | paymentMode, paymentMethod                |
| Customer Rep     | customerRep                               |
| Packages         | packageName                               |
| Activation Date  | activationDate, membershipStartDate       |
| Expiry Date      | expiryDate, membershipEndDate             |
| Package Duration | packageDuration.text (e.g., "12 months,") |
| Amount           | amount, finalAmount                       |

## 🚀 Quick Start - Import Your Data

### Method 1: Using the HTML Import Tool (Easiest)

1. **Convert Excel to JSON**

   - Use an online converter like [ConvertCSV](https://www.convertcsv.com/excel-to-json.htm)
   - Or use Excel → Save As → CSV, then convert CSV to JSON
   - Save the JSON file

2. **Open the Import Tool**

   ```
   Open: server/scripts/importPaymentHistory.html in your browser
   ```

3. **Upload and Import**
   - Drag & drop your JSON file or click to browse
   - Click "Validate Data" to check for errors
   - Click "Import to Database" to import

### Method 2: Using API Directly

#### Step 1: Validate Your Data

```bash
POST http://localhost:5000/api/admin/payment-history/validate-import
Content-Type: application/json

{
  "payments": [
    {
      "Name": "partha chatterjee",
      "Purchase Date": "30th Oct 2020",
      "Invoice Number": "2020-0000000001",
      "Mobile Number": "+91-6291701499",
      "Sales Rep": "N/A",
      "Payment Mode": "upi",
      "Customer Rep": "koushik mandal",
      "Packages": "Basic Membership Plan Yearly",
      "Activation Date": "20th Nov 2020",
      "Expiry Date": "20th Nov 2021",
      "Package Duration": "12 months,",
      "Amount": "5600"
    }
  ]
}
```

#### Step 2: Import Data

```bash
POST http://localhost:5000/api/admin/payment-history/bulk-import
Content-Type: application/json

{
  "payments": [ ...your array of payment records... ]
}
```

### Method 3: Using Frontend (React/JavaScript)

```javascript
import axios from "axios";

async function importPaymentHistory(paymentsArray) {
  try {
    // Validate first
    const validateRes = await axios.post(
      "http://localhost:5000/api/admin/payment-history/validate-import",
      { payments: paymentsArray },
      { withCredentials: true }
    );

    console.log("Validation:", validateRes.data);

    // Import if valid
    if (validateRes.data.validationResults.invalid.length === 0) {
      const importRes = await axios.post(
        "http://localhost:5000/api/admin/payment-history/bulk-import",
        { payments: paymentsArray },
        { withCredentials: true }
      );

      console.log("Import Success:", importRes.data);
      return importRes.data;
    }
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}
```

## 📋 Excel to JSON Conversion

### Option 1: Online Converter

1. Go to https://www.convertcsv.com/excel-to-json.htm
2. Upload your Excel file
3. Download the JSON output

### Option 2: Excel → CSV → JSON

1. In Excel: File → Save As → CSV
2. Use online CSV to JSON converter
3. Download the JSON

### Option 3: Using Node.js (Advanced)

```javascript
const XLSX = require("xlsx");
const fs = require("fs");

// Read Excel file
const workbook = XLSX.readFile("payment_history.xlsx");
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const jsonData = XLSX.utils.sheet_to_json(worksheet);

// Save to file
fs.writeFileSync("payment_history.json", JSON.stringify(jsonData, null, 2));
```

## 🔍 Data Validation

The system automatically validates:

- ✅ Required fields (Name, Mobile Number, Amount)
- ✅ Date formats (handles multiple formats)
- ✅ Numeric values (Amount)
- ✅ Member matching by phone number
- ⚠️ Shows warnings for missing dates or members not found

## 🎯 Features

### Automatic Member Matching

- Searches for existing members by phone number
- Links payment history to member records
- Updates member information if found

### Flexible Field Mapping

- All fields are optional for import
- Handles various date formats
- Maps payment mode correctly (upi → UPI, cash → Cash)
- Preserves original Excel data in additional fields

### Error Handling

- Detailed error messages for each failed record
- Continues processing even if some records fail
- Returns comprehensive import report

## 📊 Import Response Format

### Validation Response

```json
{
  "success": true,
  "message": "Validation complete: 5 valid, 0 invalid",
  "validationResults": {
    "valid": [...],
    "invalid": [...],
    "warnings": [...],
    "total": 5
  }
}
```

### Import Response

```json
{
  "success": true,
  "message": "Successfully imported 5 out of 5 payment records",
  "results": {
    "success": [
      {
        "index": 1,
        "name": "partha chatterjee",
        "phone": "+91-6291701499",
        "receiptNumber": "RCP2412001"
      }
    ],
    "failed": [],
    "total": 5
  }
}
```

## ⚙️ Schema Details

### New Fields Added (All Optional)

- `purchaseDate` - Date from "Purchase Date" column
- `invoiceNumber` - From "Invoice Number" column
- `activationDate` - From "Activation Date" column
- `expiryDate` - From "Expiry Date" column
- `salesRep` - From "Sales Rep" column
- `customerRep` - From "Customer Rep" column
- `paymentMode` - From "Payment Mode" column
- `packageDuration.text` - From "Package Duration" column

### Existing Fields (Kept Intact)

- All original payment history fields remain
- Auto-generated receipt numbers
- Member references
- Transaction tracking
- Soft delete functionality

## 🔒 Security

- All endpoints require authentication (`authMiddleware`)
- Only admin users can import data
- Validates data before import
- Prevents duplicate imports with unique constraints

## 📝 Notes

1. **Date Formats**: The system accepts multiple date formats including "30th Oct 2020", "2020-10-30", etc.
2. **Member Matching**: If a phone number matches an existing member, the payment will be linked automatically
3. **Receipt Numbers**: Auto-generated for each imported payment
4. **Optional Fields**: All fields are optional to accommodate various Excel formats
5. **Error Recovery**: Failed imports don't affect successful ones

## 🆘 Troubleshooting

### "Member not found" Warning

- This is normal if the member doesn't exist in your database yet
- Payment record will still be created with the Excel data
- You can link it to a member later

### Date Parsing Errors

- Ensure dates are in a recognizable format
- Try converting dates to ISO format (YYYY-MM-DD) in Excel first

### Authentication Errors

- Make sure you're logged in as an admin
- Check that cookies are enabled in your browser

## 📞 Support

For issues or questions, check the console logs or contact the development team.

---

**Ready to import?** Start with the HTML tool at `server/scripts/importPaymentHistory.html`
