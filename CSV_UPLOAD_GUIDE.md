# CSV Course Upload Feature Guide

## Overview

The Student Manager now supports bulk course data upload via CSV files. This feature allows you to quickly import multiple courses at once instead of adding them one by one.

## Where to Use

The CSV upload feature is available in:

1. **Add New Student** - When creating a new student profile
2. **Edit Student** - When editing an existing student's course history

## CSV Format Requirements

### Required Columns (in order):

1. **course_name** (required) - Full name of the course
2. **grade** (required) - Grade received in the course

### Optional Columns (in order):

3. **course_code** (optional) - Course code/identifier (e.g., CSC3014)
4. **credit_hour** (optional) - Credit hours for the course (defaults to 3 if not provided)
5. **course_description** (optional) - Brief description of the course

### Valid Grades

- A+, A, A-
- B+, B, B-
- C+, C, C-
- D+, D
- F
- CR (Credit)

## CSV Format Examples

### Example 1: With Header Row

```csv
course_name,grade,course_code,credit_hour,course_description
Software Quality Assurance,A,CSC3014,3,Software project-related subject
Web Development,B+,CSC2008,3,Frontend and backend web technologies
Database Systems,A-,CSC2014,4,Relational database design and SQL
Mobile App Development,B,CSC3016,3,Android and iOS development
Data Structures,A,CSC2015,4,Fundamental data structures and algorithms
```

### Example 2: Without Header Row

```csv
Software Engineering,A,CSC3020,4,Full software development lifecycle
Computer Networks,B+,CSC2010,3,Network protocols and architecture
Artificial Intelligence,A-,CSC4016,3,AI fundamentals and applications
```

### Example 3: Minimum Required Fields Only

```csv
Programming Fundamentals,A
Object-Oriented Programming,B+
Advanced Algorithms,A-
```

### Example 4: With Some Optional Fields

```csv
Software Testing,A,CSC3018,3
Cloud Computing,B+,,4,Cloud services and deployment
Machine Learning,A-,CSC4020,3,ML algorithms and applications
```

## How to Use

### Step 1: Prepare Your CSV File

1. Create a CSV file using Excel, Google Sheets, or any text editor
2. Follow one of the format examples above
3. Ensure required fields (course_name and grade) are present
4. Validate that grades use the correct format

### Step 2: Upload the CSV

1. Navigate to the Student Manager
2. Either:
   - Click "Add New Student" for creating a new student, or
   - Select a student and click "Edit" to add courses to an existing student
3. Scroll to the **Courses** section
4. Look for the **"Import Courses from CSV"** card
5. Click "Show Format Guide" to review the format requirements (optional)
6. Click the upload area or drag and drop your CSV file

### Step 3: Preview and Import

1. After selecting the file, the system will automatically parse and preview the courses
2. Review the preview to ensure all courses are correctly formatted
3. If there are errors, they will be displayed in red
4. Click **"Import X Courses"** button to add all courses
5. The system will automatically trigger ML retraining after import

## Tips and Best Practices

### Creating CSV Files

- **Excel/Google Sheets**: Save as CSV format
- **Text Editor**: Make sure to use commas as separators
- **UTF-8 Encoding**: Save files in UTF-8 to avoid character issues

### Common Issues and Solutions

#### Issue: "Invalid grade"

**Solution**: Ensure grades are exactly: A+, A, A-, B+, B, B-, C+, C, C-, D+, D, F, or CR

#### Issue: "course_name cannot be empty"

**Solution**: Every course must have a name. Check for empty rows or missing data.

#### Issue: "At least course_name and grade are required"

**Solution**: Ensure each row has at least the course name and grade fields.

### Performance Notes

- You can import dozens of courses at once
- ML retraining runs automatically after import (this may take a few seconds)
- For very large imports (50+ courses), consider splitting into smaller batches

## Download Template

Click the **"📥 Download CSV Template"** button in the upload interface to get a pre-formatted template with examples.

## Technical Notes

- The system auto-detects whether your CSV has a header row
- Fields with commas must be enclosed in quotes (e.g., "Course, Advanced")
- Empty optional fields can be left blank or omitted
- Credit hours default to 3 if not specified
- The import process validates all data before adding to the database

## Support

If you encounter issues:

1. Check that your CSV follows the format guide
2. Verify all required fields are present
3. Ensure grades are in the correct format
4. Try downloading and using the template as a starting point

---

**Last Updated**: November 25, 2025
