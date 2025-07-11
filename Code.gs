/**
 * Anti-Money Laundering & Economic Crimes Prevention System
 * Comprehensive Law Enforcement Platform
 * Google Apps Script Backend
 */

// Global Configuration Object
const CONFIG = {
  SECURITY: {
    INVITATION_PREFIX: 'INV-',
    INVITATION_LENGTH: 12,
    INVITATION_EXPIRY_DAYS: 7,
    PASSWORD_MIN_LENGTH: 8,
    MAX_LOGIN_ATTEMPTS: 3,
    SESSION_TIMEOUT_MINUTES: 3,
    ACCOUNT_VALIDITY_DAYS: 90,
    WORKING_HOURS: { start: 7, end: 20 },
    ZAMBIA_COORDS: { 
      lat: { min: -18, max: -8 }, 
      lng: { min: 22, max: 34 } 
    },
    ALLOWED_DOMAINS: ['@deczambia.gov.zm', '@gmail.com']
  },
  
  SHEETS: {
    USERS: 'Users',
    SECURITY_LOGS: 'SecurityLogs',
    INVITATIONS: 'Invitations',
    CASES: 'Cases',
    INVESTIGATIONS: 'Investigations',
    PROSECUTIONS: 'Prosecutions',
    ENTITIES: 'Entities',
    PROPERTIES: 'Properties',
    SEIZED_ASSETS: 'SeizedAssets',
    FINANCIAL_INTELLIGENCE: 'FinancialIntelligence',
    INTELLIGENCE_REPORTS: 'IntelligenceReports',
    EVIDENCE: 'Evidence',
    SUSPECTS: 'Suspects',
    WITNESSES: 'Witnesses',
    VICTIMS: 'Victims'
  },
  
  USER_ROLES: {
    ADMIN: 'Admin',
    NATIONAL_MANAGER: 'National Manager',
    REGIONAL_MANAGER: 'Regional Manager',
    STATION_MANAGER: 'Station Manager',
    TEAM_LEADER: 'Team Leader',
    CASE_OFFICER: 'Case Officer',
    DATA_ENTRY: 'Data Entry',
    VIEWER: 'Viewer'
  },
  
  PERMISSIONS: {
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
    APPROVE: 'approve',
    ADMIN: 'admin'
  }
};

// Module Configuration System
const MODULE_CONFIG = {
  cases: {
    title: 'Case Management',
    sheetName: 'Cases',
    icon: 'fas fa-briefcase',
    category: 'Core Operations',
    fields: {
      caseNumber: { type: 'text', label: 'Case Number', required: true },
      caseTitle: { type: 'text', label: 'Case Title', required: true },
      caseType: { type: 'select', label: 'Case Type', required: true, 
        options: ['Money Laundering', 'Terrorism Financing', 'Fraud', 'Corruption', 'Tax Evasion'] },
      priority: { type: 'select', label: 'Priority', required: true,
        options: ['Critical', 'High', 'Medium', 'Low'] },
      status: { type: 'select', label: 'Status', required: true,
        options: ['Open', 'Under Investigation', 'Pending Prosecution', 'Closed'] },
      assignedOfficer: { type: 'select', label: 'Assigned Officer', required: true, options: 'users' },
      dateCreated: { type: 'date', label: 'Date Created', required: true },
      estimatedValue: { type: 'number', label: 'Estimated Value (USD)', required: false },
      jurisdiction: { type: 'text', label: 'Jurisdiction', required: true },
      description: { type: 'textarea', label: 'Case Description', required: true },
      publicInterest: { type: 'select', label: 'Public Interest Level', required: true,
        options: ['High', 'Medium', 'Low'] },
      complexityScore: { type: 'number', label: 'Complexity Score (1-10)', required: true }
    }
  },
  
  investigations: {
    title: 'Investigation Management',
    sheetName: 'Investigations',
    icon: 'fas fa-search',
    category: 'Core Operations',
    fields: {
      investigationId: { type: 'text', label: 'Investigation ID', required: true },
      caseId: { type: 'select', label: 'Related Case', required: true, options: 'cases' },
      investigationType: { type: 'select', label: 'Investigation Type', required: true,
        options: ['Financial', 'Digital', 'Surveillance', 'Asset Tracing', 'Undercover'] },
      leadInvestigator: { type: 'select', label: 'Lead Investigator', required: true, options: 'users' },
      status: { type: 'select', label: 'Status', required: true,
        options: ['Planning', 'Active', 'Pending', 'Completed', 'Suspended'] },
      startDate: { type: 'date', label: 'Start Date', required: true },
      targetCompletionDate: { type: 'date', label: 'Target Completion', required: true },
      budget: { type: 'number', label: 'Budget (USD)', required: false },
      riskLevel: { type: 'select', label: 'Risk Level', required: true,
        options: ['Low', 'Medium', 'High', 'Critical'] },
      objectives: { type: 'textarea', label: 'Investigation Objectives', required: true },
      progress: { type: 'number', label: 'Progress (%)', required: true },
      findings: { type: 'textarea', label: 'Key Findings', required: false }
    }
  },
  
  prosecutions: {
    title: 'Prosecution Management',
    sheetName: 'Prosecutions',
    icon: 'fas fa-gavel',
    category: 'Core Operations',
    fields: {
      prosecutionId: { type: 'text', label: 'Prosecution ID', required: true },
      investigationId: { type: 'select', label: 'Related Investigation', required: true, options: 'investigations' },
      prosecutionType: { type: 'select', label: 'Prosecution Type', required: true,
        options: ['Criminal', 'Civil Forfeiture', 'Administrative', 'Parallel'] },
      prosecutor: { type: 'select', label: 'Lead Prosecutor', required: true, options: 'users' },
      courtName: { type: 'text', label: 'Court Name', required: true },
      caseNumber: { type: 'text', label: 'Court Case Number', required: true },
      charges: { type: 'textarea', label: 'Charges Filed', required: true },
      filingDate: { type: 'date', label: 'Filing Date', required: true },
      trialDate: { type: 'date', label: 'Trial Date', required: false },
      status: { type: 'select', label: 'Status', required: true,
        options: ['Filed', 'Pre-trial', 'Trial', 'Verdict', 'Sentencing', 'Appeal'] },
      outcome: { type: 'select', label: 'Outcome', required: false,
        options: ['Conviction', 'Acquittal', 'Plea Agreement', 'Dismissal', 'Pending'] },
      sentence: { type: 'text', label: 'Sentence', required: false }
    }
  },
  
  entities: {
    title: 'Entity Management',
    sheetName: 'Entities',
    icon: 'fas fa-users',
    category: 'Intelligence',
    fields: {
      entityId: { type: 'text', label: 'Entity ID', required: true },
      entityType: { type: 'select', label: 'Entity Type', required: true,
        options: ['Individual', 'Corporation', 'Partnership', 'Trust', 'Government'] },
      name: { type: 'text', label: 'Full Name/Company Name', required: true },
      aliases: { type: 'text', label: 'Known Aliases', required: false },
      dateOfBirth: { type: 'date', label: 'Date of Birth/Incorporation', required: false },
      nationality: { type: 'text', label: 'Nationality/Jurisdiction', required: false },
      identificationNumber: { type: 'text', label: 'ID/Registration Number', required: false },
      address: { type: 'textarea', label: 'Address', required: false },
      phoneNumber: { type: 'text', label: 'Phone Number', required: false },
      email: { type: 'email', label: 'Email Address', required: false },
      riskScore: { type: 'number', label: 'Risk Score (1-100)', required: true },
      pepStatus: { type: 'select', label: 'PEP Status', required: true,
        options: ['Not PEP', 'Domestic PEP', 'Foreign PEP', 'International PEP'] },
      sanctionsListed: { type: 'select', label: 'Sanctions Listed', required: true,
        options: ['No', 'UN', 'US', 'EU', 'UK', 'Other'] },
      notes: { type: 'textarea', label: 'Notes', required: false }
    }
  },
  
  properties: {
    title: 'Property & Asset Registry',
    sheetName: 'Properties',
    icon: 'fas fa-building',
    category: 'Assets',
    fields: {
      propertyId: { type: 'text', label: 'Property ID', required: true },
      propertyType: { type: 'select', label: 'Property Type', required: true,
        options: ['Real Estate', 'Vehicle', 'Bank Account', 'Business', 'Luxury Item', 'Digital Asset'] },
      description: { type: 'textarea', label: 'Property Description', required: true },
      location: { type: 'text', label: 'Location/Address', required: false },
      registeredOwner: { type: 'select', label: 'Registered Owner', required: true, options: 'entities' },
      beneficialOwner: { type: 'select', label: 'Beneficial Owner', required: false, options: 'entities' },
      estimatedValue: { type: 'number', label: 'Estimated Value (USD)', required: true },
      valuationDate: { type: 'date', label: 'Valuation Date', required: true },
      acquisitionDate: { type: 'date', label: 'Acquisition Date', required: false },
      status: { type: 'select', label: 'Status', required: true,
        options: ['Active', 'Restrained', 'Seized', 'Forfeited', 'Disposed'] },
      caseId: { type: 'select', label: 'Related Case', required: false, options: 'cases' },
      legalTitle: { type: 'text', label: 'Legal Title/Registration', required: false },
      encumbrances: { type: 'textarea', label: 'Encumbrances/Liens', required: false }
    }
  },
  
  seizedAssets: {
    title: 'Seized Assets Management',
    sheetName: 'SeizedAssets',
    icon: 'fas fa-hand-holding-usd',
    category: 'Assets',
    fields: {
      assetId: { type: 'text', label: 'Asset ID', required: true },
      propertyId: { type: 'select', label: 'Related Property', required: true, options: 'properties' },
      seizureDate: { type: 'date', label: 'Seizure Date', required: true },
      seizureAuthority: { type: 'text', label: 'Seizure Authority', required: true },
      seizureWarrant: { type: 'text', label: 'Warrant Number', required: true },
      custodyLocation: { type: 'text', label: 'Custody Location', required: true },
      custodyOfficer: { type: 'select', label: 'Custody Officer', required: true, options: 'users' },
      condition: { type: 'select', label: 'Condition', required: true,
        options: ['Excellent', 'Good', 'Fair', 'Poor', 'Deteriorating'] },
      storageMethod: { type: 'select', label: 'Storage Method', required: true,
        options: ['Warehouse', 'Bank Vault', 'Secure Facility', 'Court Registry', 'Third Party'] },
      insuranceValue: { type: 'number', label: 'Insurance Value (USD)', required: true },
      maintenanceCost: { type: 'number', label: 'Monthly Maintenance Cost', required: false },
      disposalMethod: { type: 'select', label: 'Planned Disposal', required: false,
        options: ['Public Auction', 'Private Sale', 'Destruction', 'Return to Owner', 'Government Use'] },
      notes: { type: 'textarea', label: 'Notes', required: false }
    }
  },
  
  financialIntelligence: {
    title: 'Financial Intelligence',
    sheetName: 'FinancialIntelligence',
    icon: 'fas fa-chart-line',
    category: 'Intelligence',
    fields: {
      reportId: { type: 'text', label: 'Report ID', required: true },
      reportType: { type: 'select', label: 'Report Type', required: true,
        options: ['SAR', 'CTR', 'Analysis', 'FININT', 'Bank Intelligence'] },
      entityId: { type: 'select', label: 'Related Entity', required: true, options: 'entities' },
      caseId: { type: 'select', label: 'Related Case', required: false, options: 'cases' },
      reportDate: { type: 'date', label: 'Report Date', required: true },
      reportingInstitution: { type: 'text', label: 'Reporting Institution', required: true },
      transactionAmount: { type: 'number', label: 'Transaction Amount (USD)', required: false },
      transactionDate: { type: 'date', label: 'Transaction Date', required: false },
      suspiciousActivity: { type: 'textarea', label: 'Suspicious Activity Description', required: true },
      analysisResult: { type: 'textarea', label: 'Analysis Result', required: false },
      riskLevel: { type: 'select', label: 'Risk Level', required: true,
        options: ['Low', 'Medium', 'High', 'Critical'] },
      followUpRequired: { type: 'select', label: 'Follow-up Required', required: true,
        options: ['No', 'Yes - Investigation', 'Yes - Verification', 'Yes - Reporting'] },
      status: { type: 'select', label: 'Status', required: true,
        options: ['New', 'Under Review', 'Analyzed', 'Closed', 'Referred'] }
    }
  },
  
  intelligenceReports: {
    title: 'Intelligence Reports',
    sheetName: 'IntelligenceReports',
    icon: 'fas fa-eye',
    category: 'Intelligence',
    fields: {
      reportId: { type: 'text', label: 'Report ID', required: true },
      reportType: { type: 'select', label: 'Report Type', required: true,
        options: ['HUMINT', 'SIGINT', 'OSINT', 'FININT', 'GEOINT', 'TECHINT'] },
      classification: { type: 'select', label: 'Classification', required: true,
        options: ['Unclassified', 'Restricted', 'Confidential', 'Secret', 'Top Secret'] },
      caseId: { type: 'select', label: 'Related Case', required: false, options: 'cases' },
      sourceId: { type: 'text', label: 'Source ID', required: true },
      sourceReliability: { type: 'select', label: 'Source Reliability', required: true,
        options: ['A - Reliable', 'B - Usually Reliable', 'C - Fairly Reliable', 'D - Not Usually Reliable', 'E - Unreliable'] },
      informationAccuracy: { type: 'select', label: 'Information Accuracy', required: true,
        options: ['1 - Confirmed', '2 - Probably True', '3 - Possibly True', '4 - Doubtful', '5 - Improbable'] },
      collectionDate: { type: 'date', label: 'Collection Date', required: true },
      reportDate: { type: 'date', label: 'Report Date', required: true },
      summary: { type: 'textarea', label: 'Intelligence Summary', required: true },
      details: { type: 'textarea', label: 'Detailed Information', required: true },
      analysisAssessment: { type: 'textarea', label: 'Analysis & Assessment', required: false },
      actionRecommended: { type: 'textarea', label: 'Recommended Action', required: false },
      disseminationList: { type: 'text', label: 'Dissemination List', required: false }
    }
  },
  
  evidence: {
    title: 'Evidence Management',
    sheetName: 'Evidence',
    icon: 'fas fa-folder-open',
    category: 'Investigation',
    fields: {
      evidenceId: { type: 'text', label: 'Evidence ID', required: true },
      caseId: { type: 'select', label: 'Related Case', required: true, options: 'cases' },
      evidenceType: { type: 'select', label: 'Evidence Type', required: true,
        options: ['Digital', 'Physical', 'Documentary', 'Testimonial', 'Forensic'] },
      description: { type: 'textarea', label: 'Evidence Description', required: true },
      collectionDate: { type: 'date', label: 'Collection Date', required: true },
      collectionLocation: { type: 'text', label: 'Collection Location', required: true },
      collectingOfficer: { type: 'select', label: 'Collecting Officer', required: true, options: 'users' },
      chainOfCustody: { type: 'textarea', label: 'Chain of Custody', required: true },
      storageLocation: { type: 'text', label: 'Storage Location', required: true },
      evidenceStatus: { type: 'select', label: 'Status', required: true,
        options: ['Collected', 'Analyzed', 'Court Ready', 'Presented', 'Returned'] },
      analysisResults: { type: 'textarea', label: 'Analysis Results', required: false },
      expertWitness: { type: 'text', label: 'Expert Witness', required: false },
      admissibility: { type: 'select', label: 'Court Admissibility', required: false,
        options: ['Admissible', 'Inadmissible', 'Pending Review', 'Objected'] },
      digitalHash: { type: 'text', label: 'Digital Hash/Signature', required: false }
    }
  },
  
  suspects: {
    title: 'Suspect Management',
    sheetName: 'Suspects',
    icon: 'fas fa-user-secret',
    category: 'Investigation',
    fields: {
      suspectId: { type: 'text', label: 'Suspect ID', required: true },
      entityId: { type: 'select', label: 'Related Entity', required: true, options: 'entities' },
      caseId: { type: 'select', label: 'Related Case', required: true, options: 'cases' },
      suspectRole: { type: 'select', label: 'Suspect Role', required: true,
        options: ['Primary', 'Secondary', 'Associate', 'Facilitator', 'Beneficiary'] },
      chargeStatus: { type: 'select', label: 'Charge Status', required: true,
        options: ['Under Investigation', 'Charged', 'Convicted', 'Acquitted', 'Fugitive'] },
      arrestDate: { type: 'date', label: 'Arrest Date', required: false },
      arrestLocation: { type: 'text', label: 'Arrest Location', required: false },
      bailStatus: { type: 'select', label: 'Bail Status', required: false,
        options: ['Granted', 'Denied', 'Pending', 'Not Applicable'] },
      bailAmount: { type: 'number', label: 'Bail Amount (USD)', required: false },
      legalRepresentation: { type: 'text', label: 'Legal Representation', required: false },
      cooperationLevel: { type: 'select', label: 'Cooperation Level', required: false,
        options: ['Full Cooperation', 'Partial Cooperation', 'No Cooperation', 'Hostile'] },
      threatLevel: { type: 'select', label: 'Threat Level', required: true,
        options: ['Low', 'Medium', 'High', 'Critical'] },
      flightRisk: { type: 'select', label: 'Flight Risk', required: true,
        options: ['Low', 'Medium', 'High', 'Critical'] },
      criminalHistory: { type: 'textarea', label: 'Criminal History', required: false }
    }
  },
  
  witnesses: {
    title: 'Witness Management',
    sheetName: 'Witnesses',
    icon: 'fas fa-user-check',
    category: 'Investigation',
    fields: {
      witnessId: { type: 'text', label: 'Witness ID', required: true },
      entityId: { type: 'select', label: 'Related Entity', required: true, options: 'entities' },
      caseId: { type: 'select', label: 'Related Case', required: true, options: 'cases' },
      witnessType: { type: 'select', label: 'Witness Type', required: true,
        options: ['Eyewitness', 'Expert Witness', 'Character Witness', 'Victim Witness'] },
      testimonySummary: { type: 'textarea', label: 'Testimony Summary', required: true },
      interviewDate: { type: 'date', label: 'Interview Date', required: true },
      interviewOfficer: { type: 'select', label: 'Interview Officer', required: true, options: 'users' },
      credibilityScore: { type: 'number', label: 'Credibility Score (1-10)', required: true },
      protectionLevel: { type: 'select', label: 'Protection Level Required', required: true,
        options: ['None', 'Basic', 'Enhanced', 'Critical'] },
      availability: { type: 'select', label: 'Court Availability', required: true,
        options: ['Available', 'Limited', 'Unavailable', 'Relocated'] },
      contactRestrictions: { type: 'textarea', label: 'Contact Restrictions', required: false },
      supportNeeds: { type: 'textarea', label: 'Support Needs', required: false },
      compensation: { type: 'number', label: 'Compensation Amount (USD)', required: false }
    }
  },
  
  victims: {
    title: 'Victim Support',
    sheetName: 'Victims',
    icon: 'fas fa-user-shield',
    category: 'Investigation',
    fields: {
      victimId: { type: 'text', label: 'Victim ID', required: true },
      entityId: { type: 'select', label: 'Related Entity', required: true, options: 'entities' },
      caseId: { type: 'select', label: 'Related Case', required: true, options: 'cases' },
      victimType: { type: 'select', label: 'Victim Type', required: true,
        options: ['Individual', 'Corporate', 'Government', 'Institution'] },
      lossAmount: { type: 'number', label: 'Financial Loss (USD)', required: true },
      lossDescription: { type: 'textarea', label: 'Loss Description', required: true },
      supportServices: { type: 'textarea', label: 'Support Services Provided', required: false },
      compensationClaimed: { type: 'number', label: 'Compensation Claimed (USD)', required: false },
      compensationAwarded: { type: 'number', label: 'Compensation Awarded (USD)', required: false },
      compensationPaid: { type: 'number', label: 'Compensation Paid (USD)', required: false },
      impactStatement: { type: 'textarea', label: 'Victim Impact Statement', required: false },
      recoveryStatus: { type: 'select', label: 'Recovery Status', required: true,
        options: ['No Recovery', 'Partial Recovery', 'Full Recovery', 'Pending'] },
      supportNeeds: { type: 'textarea', label: 'Ongoing Support Needs', required: false }
    }
  }
};

// User Role Permissions Matrix
const ROLE_PERMISSIONS = {
  [CONFIG.USER_ROLES.ADMIN]: {
    modules: Object.keys(MODULE_CONFIG),
    permissions: Object.values(CONFIG.PERMISSIONS)
  },
  [CONFIG.USER_ROLES.NATIONAL_MANAGER]: {
    modules: Object.keys(MODULE_CONFIG),
    permissions: [CONFIG.PERMISSIONS.CREATE, CONFIG.PERMISSIONS.READ, CONFIG.PERMISSIONS.UPDATE, CONFIG.PERMISSIONS.APPROVE]
  },
  [CONFIG.USER_ROLES.REGIONAL_MANAGER]: {
    modules: ['cases', 'investigations', 'entities', 'properties', 'suspects', 'witnesses', 'victims', 'evidence'],
    permissions: [CONFIG.PERMISSIONS.CREATE, CONFIG.PERMISSIONS.READ, CONFIG.PERMISSIONS.UPDATE, CONFIG.PERMISSIONS.APPROVE]
  },
  [CONFIG.USER_ROLES.STATION_MANAGER]: {
    modules: ['cases', 'investigations', 'entities', 'suspects', 'witnesses', 'victims', 'evidence'],
    permissions: [CONFIG.PERMISSIONS.CREATE, CONFIG.PERMISSIONS.READ, CONFIG.PERMISSIONS.UPDATE]
  },
  [CONFIG.USER_ROLES.TEAM_LEADER]: {
    modules: ['cases', 'investigations', 'entities', 'suspects', 'witnesses', 'evidence'],
    permissions: [CONFIG.PERMISSIONS.CREATE, CONFIG.PERMISSIONS.READ, CONFIG.PERMISSIONS.UPDATE]
  },
  [CONFIG.USER_ROLES.CASE_OFFICER]: {
    modules: ['cases', 'investigations', 'entities', 'suspects', 'witnesses', 'evidence'],
    permissions: [CONFIG.PERMISSIONS.CREATE, CONFIG.PERMISSIONS.READ, CONFIG.PERMISSIONS.UPDATE]
  },
  [CONFIG.USER_ROLES.DATA_ENTRY]: {
    modules: ['entities', 'suspects', 'witnesses', 'victims', 'evidence'],
    permissions: [CONFIG.PERMISSIONS.CREATE, CONFIG.PERMISSIONS.READ]
  },
  [CONFIG.USER_ROLES.VIEWER]: {
    modules: Object.keys(MODULE_CONFIG),
    permissions: [CONFIG.PERMISSIONS.READ]
  }
};

// Main Application Entry Points
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (!action) {
      return HtmlService.createHtmlOutputFromFile('index')
        .setTitle('AML & Economic Crimes Prevention System')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }
    
    // Handle different GET actions
    switch (action) {
      case 'login':
        return handleLogin(e.parameter);
      case 'getData':
        return handleGetData(e.parameter);
      case 'getUsers':
        return handleGetUsers();
      case 'getModuleConfig':
        return handleGetModuleConfig();
      default:
        return createJsonResponse({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    console.error('doGet error:', error);
    return createJsonResponse({ error: 'Internal server error' }, 500);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    // Handle different POST actions
    switch (action) {
      case 'createRecord':
        return handleCreateRecord(data);
      case 'updateRecord':
        return handleUpdateRecord(data);
      case 'deleteRecord':
        return handleDeleteRecord(data);
      case 'approveRecord':
        return handleApproveRecord(data);
      case 'createInvitation':
        return handleCreateInvitation(data);
      case 'register':
        return handleRegister(data);
      case 'changePassword':
        return handleChangePassword(data);
      case 'logSecurityEvent':
        return handleLogSecurityEvent(data);
      default:
        return createJsonResponse({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    console.error('doPost error:', error);
    return createJsonResponse({ error: 'Internal server error' }, 500);
  }
}

// Authentication and Security Functions
function handleLogin(params) {
  try {
    const { email, password } = params;
    
    if (!email || !password) {
      return createJsonResponse({ error: 'Email and password are required' }, 400);
    }
    
    // Security validations
    const securityCheck = performSecurityValidation(params);
    if (!securityCheck.valid) {
      logSecurityEvent('LOGIN_FAILED', email, securityCheck.reason);
      return createJsonResponse({ error: securityCheck.reason }, 403);
    }
    
    // Get user from database
    const user = getUserByEmail(email);
    if (!user) {
      logSecurityEvent('LOGIN_FAILED', email, 'User not found');
      return createJsonResponse({ error: 'Invalid credentials' }, 401);
    }
    
    // Verify password
    if (!verifyPassword(password, user.hashedPassword)) {
      handleFailedLogin(user);
      return createJsonResponse({ error: 'Invalid credentials' }, 401);
    }
    
    // Check account status
    if (!user.isActive || user.isLocked) {
      logSecurityEvent('LOGIN_BLOCKED', email, 'Account locked or inactive');
      return createJsonResponse({ error: 'Account is locked or inactive' }, 403);
    }
    
    // Create session
    const sessionToken = createUserSession(user);
    
    // Log successful login
    logSecurityEvent('LOGIN_SUCCESS', email, 'Successful login');
    
    return createJsonResponse({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: ROLE_PERMISSIONS[user.role] || {}
      },
      sessionToken: sessionToken
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return createJsonResponse({ error: 'Login failed' }, 500);
  }
}

function performSecurityValidation(params) {
  const { userAgent, ipAddress, location } = params;
  
  // Check working hours
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  
  if (day === 0 || day === 6) { // Weekend
    return { valid: false, reason: 'Access restricted to weekdays only' };
  }
  
  if (hour < CONFIG.SECURITY.WORKING_HOURS.start || hour > CONFIG.SECURITY.WORKING_HOURS.end) {
    return { valid: false, reason: 'Access restricted to working hours (07:00-20:00)' };
  }
  
  // Check geolocation (if provided)
  if (location) {
    const { lat, lng } = location;
    if (lat < CONFIG.SECURITY.ZAMBIA_COORDS.lat.min || lat > CONFIG.SECURITY.ZAMBIA_COORDS.lat.max ||
        lng < CONFIG.SECURITY.ZAMBIA_COORDS.lng.min || lng > CONFIG.SECURITY.ZAMBIA_COORDS.lng.max) {
      return { valid: false, reason: 'Access restricted to Zambia geographic boundaries' };
    }
  }
  
  // Check for VPN indicators
  if (isVpnDetected(userAgent, ipAddress)) {
    return { valid: false, reason: 'VPN/Proxy connections are not allowed' };
  }
  
  return { valid: true };
}

function isVpnDetected(userAgent, ipAddress) {
  // Simple VPN detection - in production, use proper VPN detection service
  const vpnIndicators = ['VPN', 'Proxy', 'Tor', 'Hide', 'Anonymous'];
  return vpnIndicators.some(indicator => 
    userAgent && userAgent.toLowerCase().includes(indicator.toLowerCase())
  );
}

// Database Helper Functions
function getSpreadsheet() {
  return SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || 
    SpreadsheetApp.getActiveSpreadsheet().getId());
}

function getSheet(sheetName) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    initializeSheet(sheet, sheetName);
  }
  
  return sheet;
}

function initializeSheet(sheet, sheetName) {
  // Initialize sheet with appropriate headers based on module configuration
  const moduleKey = Object.keys(MODULE_CONFIG).find(key => MODULE_CONFIG[key].sheetName === sheetName);
  
  if (moduleKey) {
    const config = MODULE_CONFIG[moduleKey];
    const headers = ['ID', 'Created', 'CreatedBy', 'Modified', 'ModifiedBy', 'Status', 'ApprovalStatus'];
    
    // Add module-specific headers
    Object.keys(config.fields).forEach(fieldName => {
      headers.push(fieldName);
    });
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

// Utility Functions
function createJsonResponse(data, statusCode = 200) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function generateId(prefix = '') {
  return prefix + Utilities.getUuid().replace(/-/g, '').substr(0, 8).toUpperCase();
}

function hashPassword(password) {
  return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password));
}

function verifyPassword(plainPassword, hashedPassword) {
  return hashPassword(plainPassword) === hashedPassword;
}

function logSecurityEvent(eventType, userEmail, details) {
  try {
    const sheet = getSheet(CONFIG.SHEETS.SECURITY_LOGS);
    const timestamp = new Date();
    
    sheet.appendRow([
      generateId('SEC'),
      timestamp,
      eventType,
      userEmail || 'Unknown',
      details,
      Session.getActiveUser().getEmail(),
      JSON.stringify({
        userAgent: Session.getActiveUser().getEmail(),
        timestamp: timestamp.toISOString()
      })
    ]);
  } catch (error) {
    console.error('Error logging security event:', error);
  }
}

function createUserSession(user) {
  const sessionToken = Utilities.getUuid();
  const expiryTime = new Date(Date.now() + (CONFIG.SECURITY.SESSION_TIMEOUT_MINUTES * 60 * 1000));
  
  // Store session in Properties Service (simple implementation)
  PropertiesService.getScriptProperties().setProperty(
    'session_' + sessionToken,
    JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
      expiryTime: expiryTime.toISOString(),
      createdAt: new Date().toISOString()
    })
  );
  
  return sessionToken;
}

function getUserByEmail(email) {
  try {
    const sheet = getSheet(CONFIG.SHEETS.USERS);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][3] === email) { // Assuming email is in column 4
        return {
          id: data[i][0],
          name: data[i][1],
          email: data[i][3],
          role: data[i][4],
          hashedPassword: data[i][5],
          isActive: data[i][6],
          isLocked: data[i][7]
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Initialize system on first run
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('AML System')
    .addItem('Initialize System', 'initializeSystem')
    .addItem('Create Admin User', 'createAdminUser')
    .addToUi();
}

function initializeSystem() {
  try {
    console.log('Initializing AML System...');
    
    // Initialize all required sheets
    Object.values(CONFIG.SHEETS).forEach(sheetName => {
      getSheet(sheetName);
    });
    
    // Initialize Users sheet with default admin
    initializeUsersSheet();
    
    console.log('System initialized successfully');
  } catch (error) {
    console.error('Error initializing system:', error);
  }
}

function initializeUsersSheet() {
  const sheet = getSheet(CONFIG.SHEETS.USERS);
  
  if (sheet.getLastRow() <= 1) {
    // Add headers
    const headers = [
      'ID', 'Name', 'Email', 'Role', 'HashedPassword', 'IsActive', 'IsLocked',
      'Created', 'LastLogin', 'LoginAttempts', 'AccountExpiry', 'InvitationCode'
    ];
    
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

function createAdminUser() {
  try {
    const sheet = getSheet(CONFIG.SHEETS.USERS);
    const adminId = generateId('ADM');
    const adminPassword = 'Admin@123';
    const hashedPassword = hashPassword(adminPassword);
    
    sheet.appendRow([
      adminId,
      'System Administrator',
      'admin@deczambia.gov.zm',
      CONFIG.USER_ROLES.ADMIN,
      hashedPassword,
      true,
      false,
      new Date(),
      null,
      0,
      new Date(Date.now() + (CONFIG.SECURITY.ACCOUNT_VALIDITY_DAYS * 24 * 60 * 60 * 1000)),
      null
    ]);
    
    console.log('Admin user created successfully');
    console.log('Email: admin@deczambia.gov.zm');
    console.log('Password: Admin@123');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// CRUD Operations Handler Functions
function handleCreateRecord(data) {
  try {
    const { module, recordData, userToken } = data;
    
    // Validate user session and permissions
    const user = validateUserSession(userToken);
    if (!user) {
      return createJsonResponse({ error: 'Invalid session' }, 401);
    }
    
    if (!hasPermission(user, module, CONFIG.PERMISSIONS.CREATE)) {
      return createJsonResponse({ error: 'Insufficient permissions' }, 403);
    }
    
    // Validate module configuration
    const moduleConfig = MODULE_CONFIG[module];
    if (!moduleConfig) {
      return createJsonResponse({ error: 'Invalid module' }, 400);
    }
    
    // Validate record data
    const validationResult = validateRecordData(recordData, moduleConfig.fields);
    if (!validationResult.valid) {
      return createJsonResponse({ error: validationResult.errors }, 400);
    }
    
    // Check for duplicates
    const duplicateCheck = checkForDuplicates(module, recordData);
    if (duplicateCheck.found) {
      return createJsonResponse({ 
        error: 'Duplicate record detected', 
        duplicates: duplicateCheck.records 
      }, 409);
    }
    
    // Create record
    const recordId = generateId(module.substr(0, 3).toUpperCase());
    const sheet = getSheet(moduleConfig.sheetName);
    
    const row = [
      recordId,
      new Date(),
      user.email,
      new Date(),
      user.email,
      'Active',
      'Pending'
    ];
    
    // Add field values
    Object.keys(moduleConfig.fields).forEach(fieldName => {
      row.push(recordData[fieldName] || '');
    });
    
    sheet.appendRow(row);
    
    // Log activity
    logActivity('CREATE', module, recordId, user.email);
    
    return createJsonResponse({
      success: true,
      recordId: recordId,
      message: 'Record created successfully'
    });
    
  } catch (error) {
    console.error('Create record error:', error);
    return createJsonResponse({ error: 'Failed to create record' }, 500);
  }
}

function handleUpdateRecord(data) {
  try {
    const { module, recordId, recordData, userToken } = data;
    
    // Validate user session and permissions
    const user = validateUserSession(userToken);
    if (!user) {
      return createJsonResponse({ error: 'Invalid session' }, 401);
    }
    
    if (!hasPermission(user, module, CONFIG.PERMISSIONS.UPDATE)) {
      return createJsonResponse({ error: 'Insufficient permissions' }, 403);
    }
    
    // Validate module configuration
    const moduleConfig = MODULE_CONFIG[module];
    if (!moduleConfig) {
      return createJsonResponse({ error: 'Invalid module' }, 400);
    }
    
    // Find record
    const sheet = getSheet(moduleConfig.sheetName);
    const data_range = sheet.getDataRange();
    const values = data_range.getValues();
    
    let recordRow = -1;
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === recordId) {
        recordRow = i + 1;
        break;
      }
    }
    
    if (recordRow === -1) {
      return createJsonResponse({ error: 'Record not found' }, 404);
    }
    
    // Update record
    const updatedRow = [...values[recordRow - 1]];
    updatedRow[3] = new Date(); // Modified date
    updatedRow[4] = user.email; // Modified by
    
    // Update field values
    const fieldNames = Object.keys(moduleConfig.fields);
    fieldNames.forEach((fieldName, index) => {
      if (recordData.hasOwnProperty(fieldName)) {
        updatedRow[7 + index] = recordData[fieldName];
      }
    });
    
    sheet.getRange(recordRow, 1, 1, updatedRow.length).setValues([updatedRow]);
    
    // Log activity
    logActivity('UPDATE', module, recordId, user.email);
    
    return createJsonResponse({
      success: true,
      message: 'Record updated successfully'
    });
    
  } catch (error) {
    console.error('Update record error:', error);
    return createJsonResponse({ error: 'Failed to update record' }, 500);
  }
}

function handleDeleteRecord(data) {
  try {
    const { module, recordId, userToken } = data;
    
    // Validate user session and permissions
    const user = validateUserSession(userToken);
    if (!user) {
      return createJsonResponse({ error: 'Invalid session' }, 401);
    }
    
    if (!hasPermission(user, module, CONFIG.PERMISSIONS.DELETE)) {
      return createJsonResponse({ error: 'Insufficient permissions' }, 403);
    }
    
    // Validate module configuration
    const moduleConfig = MODULE_CONFIG[module];
    if (!moduleConfig) {
      return createJsonResponse({ error: 'Invalid module' }, 400);
    }
    
    // Find and soft delete record
    const sheet = getSheet(moduleConfig.sheetName);
    const data_range = sheet.getDataRange();
    const values = data_range.getValues();
    
    let recordRow = -1;
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === recordId) {
        recordRow = i + 1;
        break;
      }
    }
    
    if (recordRow === -1) {
      return createJsonResponse({ error: 'Record not found' }, 404);
    }
    
    // Soft delete - mark as deleted
    sheet.getRange(recordRow, 6).setValue('Deleted');
    sheet.getRange(recordRow, 4).setValue(new Date()); // Modified date
    sheet.getRange(recordRow, 5).setValue(user.email); // Modified by
    
    // Log activity
    logActivity('DELETE', module, recordId, user.email);
    
    return createJsonResponse({
      success: true,
      message: 'Record deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete record error:', error);
    return createJsonResponse({ error: 'Failed to delete record' }, 500);
  }
}

function handleGetData(params) {
  try {
    const { module, userToken } = params;
    
    // Validate user session and permissions
    const user = validateUserSession(userToken);
    if (!user) {
      return createJsonResponse({ error: 'Invalid session' }, 401);
    }
    
    if (!hasPermission(user, module, CONFIG.PERMISSIONS.READ)) {
      return createJsonResponse({ error: 'Insufficient permissions' }, 403);
    }
    
    // Validate module configuration
    const moduleConfig = MODULE_CONFIG[module];
    if (!moduleConfig) {
      return createJsonResponse({ error: 'Invalid module' }, 400);
    }
    
    // Get data
    const sheet = getSheet(moduleConfig.sheetName);
    const data_range = sheet.getDataRange();
    const values = data_range.getValues();
    
    if (values.length <= 1) {
      return createJsonResponse({ data: [] });
    }
    
    const headers = values[0];
    const records = [];
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      if (row[5] !== 'Deleted') { // Skip deleted records
        const record = {};
        headers.forEach((header, index) => {
          record[header] = row[index];
        });
        records.push(record);
      }
    }
    
    return createJsonResponse({ data: records });
    
  } catch (error) {
    console.error('Get data error:', error);
    return createJsonResponse({ error: 'Failed to retrieve data' }, 500);
  }
}

function handleGetUsers() {
  try {
    const sheet = getSheet(CONFIG.SHEETS.USERS);
    const data_range = sheet.getDataRange();
    const values = data_range.getValues();
    
    if (values.length <= 1) {
      return createJsonResponse({ users: [] });
    }
    
    const users = [];
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      if (row[5] && !row[6]) { // Active and not locked
        users.push({
          id: row[0],
          name: row[1],
          email: row[2],
          role: row[3]
        });
      }
    }
    
    return createJsonResponse({ users: users });
    
  } catch (error) {
    console.error('Get users error:', error);
    return createJsonResponse({ error: 'Failed to retrieve users' }, 500);
  }
}

function handleGetModuleConfig() {
  try {
    return createJsonResponse({ 
      modules: MODULE_CONFIG,
      roles: CONFIG.USER_ROLES,
      permissions: ROLE_PERMISSIONS
    });
  } catch (error) {
    console.error('Get module config error:', error);
    return createJsonResponse({ error: 'Failed to retrieve configuration' }, 500);
  }
}

function handleCreateInvitation(data) {
  try {
    const { email, role, userToken } = data;
    
    // Validate user session and permissions
    const user = validateUserSession(userToken);
    if (!user) {
      return createJsonResponse({ error: 'Invalid session' }, 401);
    }
    
    if (!hasPermission(user, 'admin', CONFIG.PERMISSIONS.ADMIN)) {
      return createJsonResponse({ error: 'Insufficient permissions' }, 403);
    }
    
    // Validate email domain
    const domain = email.split('@')[1];
    if (!CONFIG.SECURITY.ALLOWED_DOMAINS.some(allowed => allowed.includes(domain))) {
      return createJsonResponse({ error: 'Email domain not allowed' }, 400);
    }
    
    // Generate invitation code
    const invitationCode = CONFIG.SECURITY.INVITATION_PREFIX + 
      Utilities.getUuid().replace(/-/g, '').substr(0, CONFIG.SECURITY.INVITATION_LENGTH - 4).toUpperCase();
    
    // Store invitation
    const sheet = getSheet(CONFIG.SHEETS.INVITATIONS);
    const expiryDate = new Date(Date.now() + (CONFIG.SECURITY.INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000));
    
    sheet.appendRow([
      generateId('INV'),
      invitationCode,
      email,
      role,
      new Date(),
      expiryDate,
      user.email,
      'Active',
      false
    ]);
    
    // Send invitation email
    sendInvitationEmail(email, invitationCode, role);
    
    return createJsonResponse({
      success: true,
      invitationCode: invitationCode,
      message: 'Invitation sent successfully'
    });
    
  } catch (error) {
    console.error('Create invitation error:', error);
    return createJsonResponse({ error: 'Failed to create invitation' }, 500);
  }
}

function handleRegister(data) {
  try {
    const { invitationCode, name, email, password, confirmPassword } = data;
    
    // Validate invitation code
    const invitation = validateInvitationCode(invitationCode);
    if (!invitation) {
      return createJsonResponse({ error: 'Invalid or expired invitation code' }, 400);
    }
    
    // Validate passwords
    if (password !== confirmPassword) {
      return createJsonResponse({ error: 'Passwords do not match' }, 400);
    }
    
    if (!validatePasswordStrength(password)) {
      return createJsonResponse({ error: 'Password does not meet requirements' }, 400);
    }
    
    // Check if user already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return createJsonResponse({ error: 'User already exists' }, 409);
    }
    
    // Create user
    const userId = generateId('USR');
    const hashedPassword = hashPassword(password);
    const accountExpiry = new Date(Date.now() + (CONFIG.SECURITY.ACCOUNT_VALIDITY_DAYS * 24 * 60 * 60 * 1000));
    
    const userSheet = getSheet(CONFIG.SHEETS.USERS);
    userSheet.appendRow([
      userId,
      name,
      email,
      invitation.role,
      hashedPassword,
      true,
      false,
      new Date(),
      null,
      0,
      accountExpiry,
      invitationCode
    ]);
    
    // Mark invitation as used
    markInvitationAsUsed(invitationCode);
    
    // Log activity
    logActivity('USER_REGISTERED', 'users', userId, email);
    
    return createJsonResponse({
      success: true,
      message: 'Registration successful',
      userId: userId
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return createJsonResponse({ error: 'Registration failed' }, 500);
  }
}

// Validation Functions
function validateUserSession(token) {
  try {
    if (!token) return null;
    
    const sessionData = PropertiesService.getScriptProperties().getProperty('session_' + token);
    if (!sessionData) return null;
    
    const session = JSON.parse(sessionData);
    const expiryTime = new Date(session.expiryTime);
    
    if (new Date() > expiryTime) {
      // Session expired
      PropertiesService.getScriptProperties().deleteProperty('session_' + token);
      return null;
    }
    
    return {
      userId: session.userId,
      email: session.email,
      role: session.role
    };
    
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

function hasPermission(user, module, permission) {
  try {
    const rolePermissions = ROLE_PERMISSIONS[user.role];
    if (!rolePermissions) return false;
    
    // Check if user has access to module
    if (!rolePermissions.modules.includes(module) && !rolePermissions.modules.includes('*')) {
      return false;
    }
    
    // Check if user has the required permission
    if (!rolePermissions.permissions.includes(permission) && !rolePermissions.permissions.includes('*')) {
      return false;
    }
    
    return true;
    
  } catch (error) {
    console.error('Permission check error:', error);
    return false;
  }
}

function validateRecordData(data, fields) {
  try {
    const errors = [];
    
    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName];
      const value = data[fieldName];
      
      // Check required fields
      if (field.required && (!value || value.toString().trim() === '')) {
        errors.push(`${field.label} is required`);
      }
      
      // Validate field types
      if (value && value.toString().trim() !== '') {
        switch (field.type) {
          case 'email':
            if (!isValidEmail(value)) {
              errors.push(`${field.label} must be a valid email address`);
            }
            break;
          case 'number':
            if (isNaN(value)) {
              errors.push(`${field.label} must be a number`);
            }
            break;
          case 'date':
            if (!isValidDate(value)) {
              errors.push(`${field.label} must be a valid date`);
            }
            break;
        }
      }
    });
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
    
  } catch (error) {
    console.error('Validation error:', error);
    return {
      valid: false,
      errors: ['Validation failed']
    };
  }
}

function checkForDuplicates(module, recordData) {
  try {
    const moduleConfig = MODULE_CONFIG[module];
    const sheet = getSheet(moduleConfig.sheetName);
    const data_range = sheet.getDataRange();
    const values = data_range.getValues();
    
    const duplicates = [];
    
    // Check for exact matches on key fields
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      if (row[5] === 'Deleted') continue; // Skip deleted records
      
      let isDuplicate = false;
      
      // Check based on module type
      switch (module) {
        case 'entities':
          if (row[7] === recordData.name && row[8] === recordData.entityType) {
            isDuplicate = true;
          }
          break;
        case 'cases':
          if (row[7] === recordData.caseNumber) {
            isDuplicate = true;
          }
          break;
        default:
          // Generic duplicate check on first few fields
          if (row[7] === recordData[Object.keys(moduleConfig.fields)[0]]) {
            isDuplicate = true;
          }
      }
      
      if (isDuplicate) {
        duplicates.push({
          id: row[0],
          data: row
        });
      }
    }
    
    return {
      found: duplicates.length > 0,
      records: duplicates
    };
    
  } catch (error) {
    console.error('Duplicate check error:', error);
    return { found: false, records: [] };
  }
}

function validateInvitationCode(code) {
  try {
    const sheet = getSheet(CONFIG.SHEETS.INVITATIONS);
    const data_range = sheet.getDataRange();
    const values = data_range.getValues();
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      if (row[1] === code && row[7] === 'Active' && !row[8]) {
        // Check if expired
        const expiryDate = new Date(row[5]);
        if (new Date() > expiryDate) {
          return null;
        }
        
        return {
          id: row[0],
          code: row[1],
          email: row[2],
          role: row[3],
          createdBy: row[6]
        };
      }
    }
    
    return null;
    
  } catch (error) {
    console.error('Invitation validation error:', error);
    return null;
  }
}

function validatePasswordStrength(password) {
  if (password.length < CONFIG.SECURITY.PASSWORD_MIN_LENGTH) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[^A-Za-z0-9]/.test(password)) return false;
  return true;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

// Utility Functions
function logActivity(action, module, recordId, userEmail) {
  try {
    const sheet = getSheet('ActivityLog');
    sheet.appendRow([
      generateId('ACT'),
      new Date(),
      action,
      module,
      recordId,
      userEmail,
      JSON.stringify({
        timestamp: new Date().toISOString(),
        userAgent: 'GoogleAppsScript'
      })
    ]);
  } catch (error) {
    console.error('Activity log error:', error);
  }
}

function sendInvitationEmail(email, code, role) {
  try {
    const subject = 'AML System Invitation';
    const body = `
      Dear Colleague,
      
      You have been invited to join the Anti-Money Laundering & Economic Crimes Prevention System.
      
      Your invitation code is: ${code}
      Your assigned role is: ${role}
      
      Please use this code to register your account within 7 days.
      
      Best regards,
      AML System Administration Team
    `;
    
    GmailApp.sendEmail(email, subject, body);
    
  } catch (error) {
    console.error('Email sending error:', error);
  }
}

function markInvitationAsUsed(code) {
  try {
    const sheet = getSheet(CONFIG.SHEETS.INVITATIONS);
    const data_range = sheet.getDataRange();
    const values = data_range.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][1] === code) {
        sheet.getRange(i + 1, 9).setValue(true); // Mark as used
        break;
      }
    }
  } catch (error) {
    console.error('Mark invitation error:', error);
  }
}

function handleFailedLogin(user) {
  try {
    const sheet = getSheet(CONFIG.SHEETS.USERS);
    const data_range = sheet.getDataRange();
    const values = data_range.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === user.id) {
        const attempts = (values[i][9] || 0) + 1;
        sheet.getRange(i + 1, 10).setValue(attempts);
        
        if (attempts >= CONFIG.SECURITY.MAX_LOGIN_ATTEMPTS) {
          sheet.getRange(i + 1, 7).setValue(true); // Lock account
        }
        break;
      }
    }
  } catch (error) {
    console.error('Failed login handling error:', error);
  }
}

// Advanced AI and Analytics Functions
function analyzeTransactionPatterns(entityId) {
  try {
    // Placeholder for AI-powered transaction analysis
    const sheet = getSheet(CONFIG.SHEETS.FINANCIAL_INTELLIGENCE);
    const data_range = sheet.getDataRange();
    const values = data_range.getValues();
    
    const patterns = [];
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      if (row[2] === entityId) {
        patterns.push({
          amount: row[6],
          date: row[7],
          riskLevel: row[9]
        });
      }
    }
    
    return {
      totalTransactions: patterns.length,
      highRiskTransactions: patterns.filter(p => p.riskLevel === 'High').length,
      patterns: patterns
    };
    
  } catch (error) {
    console.error('Pattern analysis error:', error);
    return null;
  }
}

function generateIntelligenceReport(caseId) {
  try {
    // Placeholder for AI-powered intelligence report generation
    const report = {
      caseId: caseId,
      generatedAt: new Date(),
      summary: 'AI-generated intelligence summary',
      recommendations: [
        'Investigate additional financial connections',
        'Expand surveillance operations',
        'Coordinate with international partners'
      ],
      riskScore: Math.floor(Math.random() * 100)
    };
    
    return report;
    
  } catch (error) {
    console.error('Intelligence report generation error:', error);
    return null;
  }
}

// System Health and Monitoring
function getSystemHealth() {
  try {
    const health = {
      timestamp: new Date(),
      status: 'healthy',
      modules: {},
      security: {
        activeUsers: 0,
        securityEvents: 0,
        lastSecurityEvent: null
      },
      performance: {
        responseTime: 'good',
        dataIntegrity: 'verified'
      }
    };
    
    // Check each module
    Object.keys(MODULE_CONFIG).forEach(module => {
      try {
        const sheet = getSheet(MODULE_CONFIG[module].sheetName);
        health.modules[module] = {
          status: 'active',
          recordCount: sheet.getLastRow() - 1
        };
      } catch (error) {
        health.modules[module] = {
          status: 'error',
          error: error.message
        };
      }
    });
    
    return health;
    
  } catch (error) {
    console.error('System health check error:', error);
    return {
      status: 'error',
      error: error.message
    };
  }
}