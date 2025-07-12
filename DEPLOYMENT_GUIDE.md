# Anti-Money Laundering & Economic Crimes Prevention System
## Updated Deployment Guide

### 🚨 **CRITICAL: Follow These Steps Exactly**

This guide provides the corrected step-by-step instructions for deploying the comprehensive AML & Economic Crimes Prevention System. **All issues with automatic sheet creation and data initialization have been fixed.**

### 🔧 **Fixed Issues**
- ✅ **Automatic sheet creation** now works properly
- ✅ **Default data population** is now functional
- ✅ **Cursor issue on system logo** has been fixed (no more hover pointer)
- ✅ **Forgot password functionality** has been fully implemented
- ✅ **Complete initialization** with sample data

---

## 📋 **Prerequisites**
- Google Account with Google Apps Script access
- Google Sheets access
- Gmail access for email functionality

---

## 🚀 **Step-by-Step Deployment**

### **Step 1: Create Google Apps Script Project**
1. Go to [Google Apps Script](https://script.google.com)
2. Click **"New Project"**
3. **Delete all default code**
4. **Copy and paste the ENTIRE `Code.gs` file content**
5. **Save** the project (Ctrl+S) with name **"AML-System"**

### **Step 2: Add HTML File**
1. In the Apps Script editor, click the **"+"** button next to "Files"
2. Select **"HTML"**
3. Name it **"index"** (exactly this name)
4. **Delete all default content**
5. **Copy and paste the ENTIRE `index.html` file content**
6. **Save** the file (Ctrl+S)

### **Step 3: Set Up Google Sheets Database**
1. **Create a new Google Sheets document**
2. **Name it "AML-System-Database"**
3. **Copy the Sheet ID** from URL (the long string between `/d/` and `/edit`)
   ```
   Example URL: https://docs.google.com/spreadsheets/d/1ABC123XYZ_SHEET_ID_HERE/edit
   Sheet ID: 1ABC123XYZ_SHEET_ID_HERE
   ```
4. **In Apps Script, go to Project Settings** (gear icon)
5. **Add Script Property:**
   - **Property:** `SPREADSHEET_ID`
   - **Value:** Your copied Sheet ID
6. **Click "Save script properties"**

### **Step 4: Deploy as Web App**
1. In Apps Script editor, click **"Deploy"** > **"New deployment"**
2. **Click the gear icon** next to "Type" and select **"Web app"**
3. **Fill in details:**
   - **Description:** "AML System v1.0"
   - **Execute as:** "Me"
   - **Who has access:** "Anyone with Google account"
4. **Click "Deploy"**
5. **Copy the deployment URL** and save it

### **Step 5: 🔑 CRITICAL - Initialize the System**
**This step is MANDATORY and must be done EXACTLY as described:**

1. **In the Apps Script editor, ensure you have the spreadsheet open**
2. **Click on the spreadsheet tabs at the bottom**
3. **You should see "AML System" menu appear** (if not, refresh and wait)
4. **Click "AML System" menu > "Initialize System"**
5. **Wait for "System initialized successfully!" message**
6. **Click "AML System" menu > "Create Admin User"**
7. **Note the admin credentials displayed**
8. **OPTIONAL: Click "AML System" menu > "Create Sample Data"** for demo data

### **Step 6: Verify System Setup**
1. **Open your deployment URL**
2. **Wait for loading to complete**
3. **Triple-click on the shield logo** (no cursor change should occur)
4. **Login with admin credentials:**
   - **Email:** `admin@deczambia.gov.zm`
   - **Password:** `Admin@123`

---

## 🛡️ **Security Features Implemented**

### **Triple-Click Security (Fixed)**
- **No cursor change** on hover over system logo
- **Triple-click required** to reveal login
- **Completely hidden** login access

### **Advanced Password Features**
- **Real-time password strength** validation
- **Visual feedback** with color coding
- **Forgot password** functionality with email reset
- **Secure reset tokens** with 30-minute expiry

### **Geographic & Time Restrictions**
- **Zambia coordinates only:** Lat -18 to -8, Lng 22 to 34
- **Working hours only:** 7:00 AM to 8:00 PM
- **Weekdays only:** Monday to Friday
- **VPN detection** and blocking

---

## 📊 **What Gets Created Automatically**

### **System Sheets (All Auto-Created)**
1. **Users** - User accounts and security data
2. **SecurityLogs** - Security event tracking
3. **Invitations** - Invitation code management
4. **ActivityLog** - User activity logging
5. **Cases** - Case management data
6. **Investigations** - Investigation tracking
7. **Prosecutions** - Prosecution management
8. **Entities** - Entity database
9. **Properties** - Property registry
10. **SeizedAssets** - Seized asset management
11. **FinancialIntelligence** - Financial data
12. **IntelligenceReports** - Intelligence gathering
13. **Evidence** - Evidence management
14. **Suspects** - Suspect tracking
15. **Witnesses** - Witness management
16. **Victims** - Victim support

### **Sample Data Created**
- **Default admin user**
- **Sample case records**
- **Sample entities**
- **Sample investigations**
- **Sample prosecutions**
- **Additional sample users** (optional)

---

## 🔧 **Troubleshooting**

### **Issue: Sheets Not Created**
**Solution:**
1. Make sure you've set the `SPREADSHEET_ID` property correctly
2. Run "Initialize System" from the AML System menu
3. Check Apps Script execution transcript for errors
4. Ensure you have edit permissions on the spreadsheet

### **Issue: Cannot Login**
**Solution:**
1. Verify admin user was created successfully
2. Check the Users sheet for admin record
3. Use exact credentials: `admin@deczambia.gov.zm` / `Admin@123`
4. Check security logs for failed login attempts
5. Ensure you're accessing during working hours (7-20, weekdays)

### **Issue: Menu Not Appearing**
**Solution:**
1. Refresh the spreadsheet
2. Make sure the `onOpen()` function executed
3. Check if you have necessary permissions
4. Manually run `onOpen()` function in Apps Script

### **Issue: Forgot Password Not Working**
**Solution:**
1. Check Gmail settings for sending emails
2. Verify email permissions in Apps Script
3. Check spam folder for reset emails
4. Ensure email domain is allowed in CONFIG

### **Issue: Geographic Restrictions**
**Solution:**
1. Disable temporarily by modifying `performSecurityValidation()`
2. Update Zambia coordinates if needed
3. Test with known good coordinates

---

## 🎯 **Deployment Verification Checklist**

- [ ] ✅ Apps Script project created and saved
- [ ] ✅ HTML file added and saved
- [ ] ✅ Spreadsheet ID configured in project properties
- [ ] ✅ Web app deployed successfully
- [ ] ✅ "Initialize System" executed successfully
- [ ] ✅ Admin user created successfully
- [ ] ✅ All sheets visible in spreadsheet with headers
- [ ] ✅ Sample data loaded (if selected)
- [ ] ✅ Triple-click login works (no cursor change)
- [ ] ✅ Admin login successful
- [ ] ✅ All modules accessible
- [ ] ✅ Data can be created/viewed
- [ ] ✅ Forgot password functionality tested

---

## 🔐 **Default Credentials**

### **Admin Account**
- **Email:** `admin@deczambia.gov.zm`
- **Password:** `Admin@123`
- **Role:** Admin (Full Access)

### **Sample Users (If Created)**
- **National Manager:** `national@deczambia.gov.zm` / `Password@123`
- **Regional Manager:** `regional@deczambia.gov.zm` / `Password@123`
- **Case Officer:** `officer@deczambia.gov.zm` / `Password@123`

---

## 📱 **System Features Verified**

### **Security Features ✅**
- Triple-click hidden login access
- Password strength validation with visual feedback
- Forgot password with email reset
- Session timeout (3 minutes)
- Geographic restrictions (Zambia only)
- Time-based access (working hours only)
- VPN detection and blocking
- Account lockout after 3 failed attempts

### **Core Functionality ✅**
- Real-time data loading without page refresh
- Comprehensive CRUD operations
- Role-based access control
- 12 fully functional modules
- Professional law enforcement UI
- Beautiful animations and gradients
- Mobile-responsive design
- Advanced search and filtering

### **Data Management ✅**
- Automatic sheet initialization
- Sample data generation
- Comprehensive field validation
- Duplicate prevention
- Audit trail logging
- Data relationship management

---

## 🚨 **Important Security Notes**

1. **Change default passwords** immediately after deployment
2. **Restrict access** to authorized personnel only
3. **Monitor security logs** regularly
4. **Update email domains** in CONFIG to match your organization
5. **Configure proper geographic boundaries** if not in Zambia
6. **Set up proper email sending** for password resets
7. **Regular backup** of spreadsheet data

---

## 📞 **Support**

### **If You Encounter Issues:**
1. **Check the execution transcript** in Apps Script
2. **Verify all steps were followed exactly**
3. **Check browser console** for JavaScript errors
4. **Ensure proper permissions** are granted
5. **Test with different browsers** if needed

### **Common Solutions:**
- **Clear browser cache** and cookies
- **Use incognito/private browsing** mode
- **Check Google Apps Script quotas**
- **Verify email sending permissions**

---

## 🎉 **Success Indicators**

Your system is successfully deployed when:
- ✅ All 16 sheets are created with proper headers
- ✅ Admin user exists in Users sheet
- ✅ Triple-click login works without cursor change
- ✅ Password strength validation shows visual feedback
- ✅ Forgot password sends email (test this)
- ✅ All modules load with sample data
- ✅ CRUD operations work properly
- ✅ Real-time notifications appear
- ✅ Security restrictions are enforced

---

**Version:** 2.0 (Fixed)  
**Last Updated:** December 2024  
**Status:** Production Ready ✅**