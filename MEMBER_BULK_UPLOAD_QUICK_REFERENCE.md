# Member Bulk Upload - Quick Reference Card

## Excel Columns (9 Required)

| #   | Column Name             | Required? | Format           | Example                           | Notes                          |
| --- | ----------------------- | --------- | ---------------- | --------------------------------- | ------------------------------ |
| 1   | **Registration Number** | Optional  | FLMxxxx or empty | `FLM1436`                         | Auto-generated if empty        |
| 2   | **Member Joining Date** | Optional  | YYYY-MM-DD       | `2025-01-15`                      | Defaults to package start date |
| 3   | **Full Name**           | ✅ Yes    | Text             | `John Doe`                        | Member's full name             |
| 4   | **Phone**               | ✅ Yes    | 10 digits        | `9876543210`                      | Must be unique per member      |
| 5   | **Package**             | ✅ Yes    | Exact name       | `FB Fitness Fantasia 2024 Yearly` | Case-insensitive               |
| 6   | **package start date**  | ✅ Yes    | YYYY-MM-DD       | `2025-01-15`                      | Package activation date        |
| 7   | **trainer**             | Optional  | ObjectId         | `6950e1b3a4814e3afb6a3031`        | Trainer ID (not name)          |
| 8   | **last update date**    | Optional  | YYYY-MM-DD       | `2025-01-15`                      | Defaults to today              |
| 9   | **status**              | ✅ Yes    | Active/Inactive  | `Active`                          | Member status                  |

## Automatic Features

| Feature                    | Value              | Description                                |
| -------------------------- | ------------------ | ------------------------------------------ |
| 💰 **Payment Amount**      | Full package price | Automatically set to complete package cost |
| 💵 **Payment Method**      | Cash               | Always set to Cash                         |
| ✅ **Payment Status**      | Paid               | Always marked as Paid                      |
| 💸 **Discount**            | 0                  | No discounts in bulk import                |
| 📅 **Package End Date**    | Auto-calculated    | Based on start date + duration             |
| 🔢 **Registration Number** | Auto-generated     | Sequential: FLM1001, FLM1002...            |

## Common Values

### Status Options

- `Active` - Member is currently active
- `Inactive` - Member is inactive

### Date Formats (All Accepted)

- `2025-01-15` (YYYY-MM-DD) ✅ Recommended
- `15/01/2025` (DD/MM/YYYY) ✅ Accepted
- `01/15/2025` (MM/DD/YYYY) ❌ Not recommended

## Quick Validation Checklist

- [ ] All required columns present
- [ ] Phone numbers are valid (10 digits)
- [ ] Package names match exactly
- [ ] Dates are in correct format
- [ ] Status is Active or Inactive
- [ ] Trainer IDs are valid (if provided)
- [ ] Registration numbers are unique (if provided)

## Process Steps

```
1. Download Template → 2. Fill Data → 3. Upload File → 4. Validate → 5. Import
```

## Tips

✅ **DO:**

- Use demo template as starting point
- Validate before importing
- Use correct trainer IDs (not names)
- Keep phone numbers unique
- Check package names carefully

❌ **DON'T:**

- Use trainer names (use IDs)
- Mix date formats in same file
- Leave required fields empty
- Use duplicate phone numbers for different members
- Skip validation step

## Get Help

1. Download demo template for examples
2. Check `MEMBER_BULK_UPLOAD_GUIDE.md` for detailed guide
3. Use validation feature to find errors
4. Contact system admin for trainer IDs

---

**Quick Start**: Download Template → Fill 10 test members → Upload → Validate → Import
