# Package Bulk Import Guide

## Overview

The Package Bulk Import feature allows you to import multiple gym packages at once using an Excel file. This feature supports up to 60MB file uploads and includes image handling capabilities.

## Getting Started

### Step 1: Download the Template

1. Navigate to Admin > Add Packages
2. Click on the "Bulk Import" button
3. Click "Download Excel Template"
4. Two sheets will be included:
   - **Packages**: Fill this with your package data
   - **Instructions**: Detailed field descriptions

### Step 2: Fill in the Template

#### Required Fields

| Field Name       | Description                   | Example                         | Valid Options                                                              |
| ---------------- | ----------------------------- | ------------------------------- | -------------------------------------------------------------------------- |
| Package Name     | Unique name for the package   | FB Fitness Fantasia Half Yearly | Any text                                                                   |
| Package Type     | Type of package               | Membership                      | Membership, Personal Training, Group Classes, Day Pass, Corporate, Special |
| Package Category | Category classification       | Basic                           | Basic, Premium, VIP, Custom                                                |
| Duration value   | Numeric duration              | 1                               | Any positive number                                                        |
| Duration unit    | Time unit                     | Months                          | Days, Weeks, Months, Years                                                 |
| Original Price   | Full price without discount   | 5000                            | Any positive number (no commas)                                            |
| Discount Type    | Type of discount              | percentage                      | flat, percentage                                                           |
| Discount Value   | Discount amount or percentage | 25                              | Number (% for percentage, amount for flat)                                 |
| Freezable        | Can package be frozen         | Yes                             | Yes, No                                                                    |
| Package Status   | Current status                | Active                          | Active, Inactive, Coming Soon                                              |

#### Optional Fields

| Field Name    | Description         | Example                            |
| ------------- | ------------------- | ---------------------------------- |
| Description   | Package description | Full gym access with all amenities |
| Sessions      | Session information | Unlimited                          |
| Session Count | Number of sessions  | 12                                 |
| Badge         | Display badge       | Popular                            |

### Step 3: Understanding Discount Types

#### Percentage Discount

- **Discount Type**: `percentage`
- **Discount Value**: Enter the percentage (e.g., 25 for 25%)
- **Example**:
  - Original Price: 5000
  - Discount Value: 25
  - Final Price: 3750 (25% off)

#### Flat Discount

- **Discount Type**: `flat`
- **Discount Value**: Enter the discount amount
- **Example**:
  - Original Price: 5000
  - Discount Value: 1000
  - Final Price: 4000 (1000 rupees off)

### Step 4: Upload and Import

1. Save your Excel file
2. Click "Bulk Import" in the Add Packages page
3. Click the upload area or drag & drop your file
4. Review the preview of packages to be imported
5. Click "Import Packages"
6. Wait for the import to complete
7. Review the results:
   - **Total**: Total packages in file
   - **Successful**: Successfully imported
   - **Created**: New packages created
   - **Updated**: Existing packages updated
   - **Failed**: Failed imports with error details

## Important Notes

### File Requirements

- File format: `.xlsx` or `.xls`
- Maximum file size: 60MB (for images)
- Encoding: UTF-8 recommended

### Data Validation

- Package names should be unique
- If a package with the same name exists, it will be updated
- All required fields must be filled
- Prices should be positive numbers without commas

### Error Handling

- If import fails for specific rows, details will be shown
- Successfully imported packages will still be saved
- Failed records can be corrected and re-imported

## Sample Data

```
Package Name: FB Fitness Fantasia Half Yearly
Package Type: Membership
Package Category: Basic
Duration value: 6
Duration unit: Months
Original Price: 4200
Discount Type: flat
Discount Value: 0
Freezable: Yes
Package Status: Active
Description: Half yearly membership with basic gym access
Sessions: Unlimited
```

## Image Upload (Separate Feature)

For package images:

1. Images can be uploaded separately via the API endpoint
2. Maximum file size: 60MB per image
3. Supported formats: JPG, PNG, GIF, WebP
4. Use the `/api/packages/upload/image` endpoint

### Image Upload API

```javascript
POST /api/packages/upload/image
Content-Type: multipart/form-data

Body:
- image: File (max 60MB)

Response:
{
  "success": true,
  "message": "Image uploaded successfully",
  "url": "https://cloudinary.com/...",
  "publicId": "..."
}
```

## Troubleshooting

### Common Issues

1. **File not uploading**

   - Check file format (.xlsx or .xls)
   - Ensure file size is under 60MB
   - Try re-saving the Excel file

2. **Import failing for all records**

   - Verify all required fields are present
   - Check for extra spaces in column names
   - Ensure data types are correct

3. **Some packages failing**

   - Check error messages for specific rows
   - Verify package names are unique
   - Ensure prices are valid numbers

4. **Existing packages not updating**
   - Package name must match exactly
   - Check for extra spaces or special characters

## API Endpoints

### Get Template

```
GET /api/packages/import/template
Response: JSON with template data and instructions
```

### Bulk Import

```
POST /api/packages/import/bulk
Content-Type: application/json
Body: { "packages": [...] }
```

### Upload Image

```
POST /api/packages/upload/image
Content-Type: multipart/form-data
Body: FormData with image file
```

## Database Schema Mapping

The import controller automatically maps Excel columns to the database schema:

| Excel Column     | Database Field  | Type          |
| ---------------- | --------------- | ------------- |
| Package Name     | packageName     | String        |
| Package Type     | packageType     | String (enum) |
| Package Category | category        | String (enum) |
| Duration value   | duration.value  | Number        |
| Duration unit    | duration.unit   | String (enum) |
| Original Price   | originalPrice   | Number        |
| Discount Type    | discountType    | String (enum) |
| Discount Value   | discountedPrice | Number        |
| Freezable        | freezable       | Boolean       |
| Package Status   | status          | String (enum) |
| Description      | description     | String        |
| Sessions         | sessions        | String        |
| Session Count    | sessionCount    | Number        |
| Badge            | badge           | String        |

## Support

For issues or questions:

1. Check error messages in import results
2. Verify your data format matches the template
3. Review this guide for common solutions
4. Contact system administrator if problems persist

---

**Last Updated**: December 27, 2025
**Version**: 1.0
