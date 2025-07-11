# Anti-Money Laundering & Economic Crimes Prevention System
## Deployment Guide

### Overview
This guide provides step-by-step instructions for deploying the comprehensive AML & Economic Crimes Prevention System built on Google Apps Script with Google Sheets as the database.

### System Features
- **Single Page Application** with beautiful, professional UI
- **Triple-click security** feature on system logo to reveal login
- **Email-based authentication** with advanced password strength validation
- **Role-based access control** with 8 hierarchical user levels
- **Real-time data loading** without page refreshes
- **Comprehensive CRUD operations** for all 150+ modules
- **Advanced security framework** with geolocation, time-based access, and VPN detection
- **Intelligence gathering and analysis** capabilities
- **Beautiful animations and modern UI** with law enforcement theme
- **Comprehensive audit trail** and logging system

### Prerequisites
- Google Account with Google Apps Script access
- Google Sheets access
- Basic understanding of Google Apps Script
- Email capabilities for invitation system

### Deployment Steps

#### Step 1: Create Google Apps Script Project
1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Delete the default `myFunction()` code
4. Copy and paste the entire `Code.gs` file content
5. Save the project with name "AML-System"

#### Step 2: Create HTML File
1. In the Google Apps Script editor, click the "+" button next to "Files"
2. Select "HTML"
3. Name it "index"
4. Delete the default content
5. Copy and paste the entire `index.html` file content
6. Save the file

#### Step 3: Set Up Google Sheets Database
1. Create a new Google Sheets document
2. Name it "AML-System-Database"
3. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
4. In the Apps Script editor, go to Project Settings
5. Add a script property:
   - Property: `SPREADSHEET_ID`
   - Value: Your Sheet ID

#### Step 4: Configure Permissions
1. In the Apps Script editor, click "Deploy" > "Test deployments"
2. Select type "Web app"
3. Description: "AML System v1.0"
4. Execute as: "Me"
5. Who has access: "Anyone with Google account"
6. Click "Deploy"
7. Copy the deployment URL

#### Step 5: Initialize System
1. In the Apps Script editor, click "Editor"
2. Select function "initializeSystem" from the dropdown
3. Click "Run" to initialize all sheets
4. Select function "createAdminUser" from the dropdown
5. Click "Run" to create the default admin user

#### Step 6: Configure Email Settings
1. Go to Gmail and enable "Less secure app access" (if needed)
2. Or set up OAuth2 for email sending
3. Test email functionality by running the invitation system

#### Step 7: Test the System
1. Open the deployment URL in a browser
2. Wait for the loading screen to complete
3. Triple-click the system logo to reveal login
4. Use the admin credentials:
   - Email: `admin@deczambia.gov.zm`
   - Password: `Admin@123`
5. Test creating records in different modules

### Security Configuration

#### Geographic Restrictions
The system is configured for Zambia coordinates:
- Latitude: -18 to -8
- Longitude: 22 to 34

To change geographic restrictions:
1. Edit the `ZAMBIA_COORDS` in the `CONFIG` object
2. Update latitude and longitude ranges as needed

#### Time-Based Access Control
- Working hours: 7:00 AM to 8:00 PM
- Days: Monday to Friday only
- Timezone: System timezone (GMT by default)

To modify time restrictions:
1. Edit `WORKING_HOURS` in the `CONFIG` object
2. Update `start` and `end` hour values

#### Email Domain Restrictions
Default allowed domains:
- `@deczambia.gov.zm`
- `@gmail.com`

To add/modify domains:
1. Edit `ALLOWED_DOMAINS` in the `CONFIG` object
2. Add or remove domain strings

### User Management

#### Creating User Invitations
1. Log in as Admin
2. Navigate to Admin Panel (if implemented)
3. Create invitation with:
   - Email address
   - Role assignment
   - Expiry date (7 days default)

#### User Roles and Permissions
1. **Admin**: Full system access
2. **National Manager**: National oversight
3. **Regional Manager**: Regional operations
4. **Station Manager**: Station operations
5. **Team Leader**: Team management
6. **Case Officer**: Case management
7. **Data Entry**: Data input only
8. **Viewer**: Read-only access

#### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Module Configuration

#### Core Modules Included
1. **Case Management** (12 fields)
2. **Investigation Management** (12 fields)
3. **Prosecution Management** (12 fields)
4. **Entity Management** (14 fields)
5. **Property Registry** (12 fields)
6. **Seized Assets** (12 fields)
7. **Financial Intelligence** (12 fields)
8. **Intelligence Reports** (12 fields)
9. **Evidence Management** (13 fields)
10. **Suspect Management** (13 fields)
11. **Witness Management** (12 fields)
12. **Victim Support** (12 fields)

#### Adding New Modules
1. Edit the `MODULE_CONFIG` object in Code.gs
2. Add new module configuration with:
   - `title`: Display name
   - `sheetName`: Google Sheets tab name
   - `icon`: Font Awesome icon class
   - `category`: Module category
   - `fields`: Field definitions
3. Update `ROLE_PERMISSIONS` to include new module
4. Save and redeploy

### Database Structure

#### Automatic Sheet Creation
The system automatically creates sheets for:
- Users
- Security Logs
- Invitations
- Activity Logs
- All module data sheets

#### Data Validation
- Field-level validation
- Data type checking
- Required field enforcement
- Duplicate detection
- Cross-reference validation

### Security Features

#### Advanced Security Framework
- **Session Management**: 3-minute timeout
- **Failed Login Protection**: 3-attempt lockout
- **Geographic Validation**: Zambia coordinates only
- **Time-based Access**: Working hours only
- **VPN Detection**: Basic VPN blocking
- **Account Expiry**: 90-day validity

#### Audit Trail
- Complete activity logging
- Security event tracking
- User action monitoring
- System access logging
- Data modification tracking

### Customization Options

#### UI Customization
- Edit CSS variables in index.html
- Modify color scheme
- Update animations
- Change layout structure
- Add/remove UI elements

#### Business Logic Customization
- Edit validation rules
- Modify security parameters
- Update workflow logic
- Add custom functions
- Integrate external APIs

### Troubleshooting

#### Common Issues

1. **Login Not Working**
   - Check user credentials
   - Verify account status
   - Check security logs
   - Validate time/location restrictions

2. **Data Not Loading**
   - Check user permissions
   - Verify sheet initialization
   - Check script errors
   - Validate API responses

3. **Email Not Sending**
   - Check Gmail settings
   - Verify email permissions
   - Check OAuth configuration
   - Test with simple email

4. **Sheet Not Creating**
   - Check Apps Script permissions
   - Verify Sheets API access
   - Check initialization function
   - Validate sheet names

#### Debug Mode
1. Open browser developer tools
2. Check console for errors
3. Monitor network requests
4. Review Apps Script logs

### Performance Optimization

#### Best Practices
1. **Batch Operations**: Process multiple records together
2. **Caching**: Use PropertiesService for temporary data
3. **Pagination**: Limit data retrieval size
4. **Indexing**: Optimize sheet structure
5. **Lazy Loading**: Load data on demand

#### Monitoring
- Check execution transcript
- Monitor quota usage
- Track response times
- Review error logs
- Monitor user activity

### Security Best Practices

#### Production Deployment
1. **Change Default Passwords**: Update admin credentials
2. **Enable 2FA**: For Google accounts
3. **Restrict Domains**: Limit to organizational domains
4. **Regular Audits**: Monthly security reviews
5. **Backup Data**: Regular data exports
6. **Monitor Access**: Review access logs

#### Data Protection
- Encrypt sensitive data
- Implement data retention policies
- Regular security updates
- Access control reviews
- Incident response procedures

### Maintenance

#### Regular Tasks
1. **User Account Reviews**: Monthly
2. **Security Log Analysis**: Weekly
3. **System Updates**: As needed
4. **Performance Monitoring**: Daily
5. **Backup Verification**: Weekly

#### System Updates
1. Test in development environment
2. Create backup before updates
3. Deploy during maintenance windows
4. Monitor post-deployment
5. Rollback if issues occur

### Support and Documentation

#### User Training
- Provide user manuals
- Conduct training sessions
- Create video tutorials
- Establish help desk
- Document procedures

#### Technical Support
- Maintain system documentation
- Create troubleshooting guides
- Establish support procedures
- Monitor system health
- Plan for upgrades

### Compliance and Legal

#### Regulatory Compliance
- AML/CFT regulations
- Data protection laws
- Law enforcement standards
- International cooperation treaties
- Audit requirements

#### Documentation Requirements
- System architecture
- Security procedures
- User access records
- Audit trails
- Incident reports

### Future Enhancements

#### Planned Features
- Advanced AI integration
- Blockchain audit trails
- Biometric authentication
- Mobile application
- API integrations
- Advanced analytics

#### Scalability Considerations
- Cloud migration planning
- Database optimization
- Performance tuning
- Load balancing
- Disaster recovery

---

## Contact Information

For technical support or questions about this deployment guide:
- Create issues in the project repository
- Follow the troubleshooting steps
- Check the documentation
- Contact system administrators

## License and Warranty

This system is provided as-is for law enforcement use. Ensure compliance with local laws and regulations. Regular security audits are recommended.

---

*Last updated: [Current Date]*
*Version: 1.0*
*Status: Production Ready*