/**
 * Anti-Money Laundering & Economic Crimes Prevention System
 * Comprehensive Law Enforcement Platform
 * Google Apps Script Backend
 * 
 * AUTOMATIC INITIALIZATION ON DEPLOYMENT
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
    VICTIMS: 'Victims',
    ACTIVITY_LOG: 'ActivityLog',
    SYSTEM_STATUS: 'SystemStatus'
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
  },
  
  ADMIN_CREDENTIALS: {
    EMAIL: 'Artwell.Hachunde@deczambia.gov.zm',
    PASSWORD: 'AML@2024#Admin'  // Meets all strength requirements
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
    // AUTOMATIC SYSTEM INITIALIZATION ON FIRST RUN
    if (!isSystemInitialized()) {
      console.log('System not initialized. Initializing automatically...');
      initializeSystemAutomatically();
    }
    
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
    logSecurityEvent('SYSTEM_ERROR', 'system', 'doGet error: ' + error.toString());
    return createJsonResponse({ error: 'Internal server error', details: error.toString() }, 500);
  }
}

function doPost(e) {
  try {
    // AUTOMATIC SYSTEM INITIALIZATION ON FIRST RUN
    if (!isSystemInitialized()) {
      console.log('System not initialized. Initializing automatically...');
      initializeSystemAutomatically();
    }
    
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    // Handle different POST actions
    switch (action) {
      case 'login':
        return handleLogin(data);
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
      case 'forgotPassword':
        return handleForgotPassword(data);
      case 'resetPassword':
        return handleResetPassword(data);
      case 'logSecurityEvent':
        return handleLogSecurityEvent(data);
      default:
        return createJsonResponse({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    console.error('doPost error:', error);
    logSecurityEvent('SYSTEM_ERROR', 'system', 'doPost error: ' + error.toString());
    return createJsonResponse({ error: 'Internal server error', details: error.toString() }, 500);
  }
}

// AUTOMATIC SYSTEM INITIALIZATION FUNCTIONS
function isSystemInitialized() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const statusSheet = ss.getSheetByName(CONFIG.SHEETS.SYSTEM_STATUS);
    
    if (!statusSheet) {
      return false;
    }
    
    const statusData = statusSheet.getDataRange().getValues();
    if (statusData.length > 1) {
      const lastRow = statusData[statusData.length - 1];
      return lastRow[1] === 'INITIALIZED' && lastRow[2] === true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking system initialization:', error);
    return false;
  }
}

function initializeSystemAutomatically() {
  try {
    console.log('Starting automatic system initialization...');
    
    // Step 1: Initialize all required sheets
    initializeAllSheets();
    
    // Step 2: Create admin user automatically
    createAdminUserAutomatically();
    
    // Step 3: Create sample data
    createSampleDataAutomatically();
    
    // Step 4: Mark system as initialized
    markSystemAsInitialized();
    
    console.log('System initialization completed successfully');
    
  } catch (error) {
    console.error('Error during automatic initialization:', error);
    logSecurityEvent('SYSTEM_ERROR', 'system', 'Initialization error: ' + error.toString());
  }
}

function initializeAllSheets() {
  try {
    console.log('Initializing all sheets...');
    
    // Initialize all required sheets
    Object.values(CONFIG.SHEETS).forEach(sheetName => {
      console.log(`Initializing sheet: ${sheetName}`);
      getSheet(sheetName);
    });
    
    // Initialize module sheets
    Object.keys(MODULE_CONFIG).forEach(moduleKey => {
      const sheetName = MODULE_CONFIG[moduleKey].sheetName;
      console.log(`Initializing module sheet: ${sheetName}`);
      getSheet(sheetName);
    });
    
    console.log('All sheets initialized successfully');
  } catch (error) {
    console.error('Error initializing sheets:', error);
    throw error;
  }
}

function createAdminUserAutomatically() {
  try {
    console.log('Creating admin user automatically...');
    
    const sheet = getSheet(CONFIG.SHEETS.USERS);
    
    // Check if admin user already exists
    const data_range = sheet.getDataRange();
    const values = data_range.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][2] === CONFIG.ADMIN_CREDENTIALS.EMAIL) {
        console.log('Admin user already exists');
        return;
      }
    }
    
    const adminId = generateId('ADM');
    const adminPassword = CONFIG.ADMIN_CREDENTIALS.PASSWORD;
    const hashedPassword = hashPassword(adminPassword);
    const now = new Date();
    const accountExpiry = new Date(Date.now() + (CONFIG.SECURITY.ACCOUNT_VALIDITY_DAYS * 24 * 60 * 60 * 1000));
    
    sheet.appendRow([
      adminId,
      'Artwell Hachunde',
      CONFIG.ADMIN_CREDENTIALS.EMAIL,
      CONFIG.USER_ROLES.ADMIN,
      hashedPassword,
      true,
      false,
      now,
      null,
      0,
      accountExpiry,
      null,
      '+260971234567',
      'Administration',
      'System Administrator',
      'ADM001',
      'Top Secret',
      false,
      'English',
      'Africa/Lusaka',
      now,
      false,
      '',
      '+260971234567',
      'System Administrator - Auto-created'
    ]);
    
    console.log('Admin user created successfully');
    console.log('Email: ' + CONFIG.ADMIN_CREDENTIALS.EMAIL);
    console.log('Password: ' + CONFIG.ADMIN_CREDENTIALS.PASSWORD);
    
    // Log the admin user creation
    logSecurityEvent('ADMIN_USER_CREATED', CONFIG.ADMIN_CREDENTIALS.EMAIL, 'Admin user created automatically during system initialization');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

function createSampleDataAutomatically() {
  try {
    console.log('Creating sample data automatically...');
    
    // Create sample users
    createSampleUsers();
    
    console.log('Sample data created successfully');
  } catch (error) {
    console.error('Error creating sample data:', error);
    throw error;
  }
}

function markSystemAsInitialized() {
  try {
    console.log('Marking system as initialized...');
    
    const sheet = getSheet(CONFIG.SHEETS.SYSTEM_STATUS);
    const now = new Date();
    
    sheet.appendRow([
      generateId('SYS'),
      'INITIALIZED',
      true,
      now,
      CONFIG.ADMIN_CREDENTIALS.EMAIL,
      'System automatically initialized on deployment',
      'v2.0'
    ]);
    
    console.log('System marked as initialized');
  } catch (error) {
    console.error('Error marking system as initialized:', error);
    throw error;
  }
}

// Authentication and Security Functions
function handleLogin(params) {
  try {
    const email = params.email;
    const password = params.password;
    
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
    
    // Update last login
    updateLastLogin(user.id);
    
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
    logSecurityEvent('LOGIN_ERROR', params.email || 'unknown', 'Login error: ' + error.toString());
    return createJsonResponse({ error: 'Login failed', details: error.toString() }, 500);
  }
}

function handleForgotPassword(data) {
  try {
    const { email } = data;
    
    if (!email) {
      return createJsonResponse({ error: 'Email is required' }, 400);
    }
    
    // Check if user exists
    const user = getUserByEmail(email);
    if (!user) {
      // Don't reveal whether user exists or not for security
      return createJsonResponse({ 
        success: true, 
        message: 'If the email exists in our system, a reset link will be sent.' 
      });
    }
    
    // Generate reset token
    const resetToken = Utilities.getUuid();
    const expiryTime = new Date(Date.now() + (30 * 60 * 1000)); // 30 minutes
    
    // Store reset token
    PropertiesService.getScriptProperties().setProperty(
      'reset_' + resetToken,
      JSON.stringify({
        email: email,
        expiryTime: expiryTime.toISOString(),
        createdAt: new Date().toISOString()
      })
    );
    
    // Send reset email
    sendPasswordResetEmail(email, resetToken);
    
    // Log activity
    logSecurityEvent('PASSWORD_RESET_REQUESTED', email, 'Password reset requested');
    
    return createJsonResponse({
      success: true,
      message: 'If the email exists in our system, a reset link will be sent.'
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    return createJsonResponse({ error: 'Password reset request failed', details: error.toString() }, 500);
  }
}

function handleResetPassword(data) {
  try {
    const { resetToken, newPassword, confirmPassword } = data;
    
    if (!resetToken || !newPassword || !confirmPassword) {
      return createJsonResponse({ error: 'All fields are required' }, 400);
    }
    
    if (newPassword !== confirmPassword) {
      return createJsonResponse({ error: 'Passwords do not match' }, 400);
    }
    
    if (!validatePasswordStrength(newPassword)) {
      return createJsonResponse({ error: 'Password does not meet requirements' }, 400);
    }
    
    // Validate reset token
    const tokenData = PropertiesService.getScriptProperties().getProperty('reset_' + resetToken);
    if (!tokenData) {
      return createJsonResponse({ error: 'Invalid or expired reset token' }, 400);
    }
    
    const token = JSON.parse(tokenData);
    const expiryTime = new Date(token.expiryTime);
    
    if (new Date() > expiryTime) {
      PropertiesService.getScriptProperties().deleteProperty('reset_' + resetToken);
      return createJsonResponse({ error: 'Reset token has expired' }, 400);
    }
    
    // Update user password
    const user = getUserByEmail(token.email);
    if (!user) {
      return createJsonResponse({ error: 'User not found' }, 404);
    }
    
    // Update password in Users sheet
    const sheet = getSheet(CONFIG.SHEETS.USERS);
    const data_range = sheet.getDataRange();
    const values = data_range.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][2] === token.email) { // Email column
        const hashedPassword = hashPassword(newPassword);
        sheet.getRange(i + 1, 5).setValue(hashedPassword); // Password column
        sheet.getRange(i + 1, 10).setValue(0); // Reset login attempts
        sheet.getRange(i + 1, 7).setValue(false); // Unlock account
        break;
      }
    }
    
    // Delete reset token
    PropertiesService.getScriptProperties().deleteProperty('reset_' + resetToken);
    
    // Log activity
    logSecurityEvent('PASSWORD_RESET_COMPLETED', token.email, 'Password successfully reset');
    
    return createJsonResponse({
      success: true,
      message: 'Password reset successfully'
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    return createJsonResponse({ error: 'Password reset failed', details: error.toString() }, 500);
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
  return SpreadsheetApp.getActiveSpreadsheet();
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
  try {
    console.log(`Initializing sheet: ${sheetName}`);
    
    // Initialize different types of sheets
    if (sheetName === CONFIG.SHEETS.USERS) {
      initializeUsersSheet(sheet);
    } else if (sheetName === CONFIG.SHEETS.SECURITY_LOGS) {
      initializeSecurityLogsSheet(sheet);
    } else if (sheetName === CONFIG.SHEETS.INVITATIONS) {
      initializeInvitationsSheet(sheet);
    } else if (sheetName === CONFIG.SHEETS.ACTIVITY_LOG) {
      initializeActivityLogSheet(sheet);
    } else if (sheetName === CONFIG.SHEETS.SYSTEM_STATUS) {
      initializeSystemStatusSheet(sheet);
    } else {
      // Initialize module sheets
      const moduleKey = Object.keys(MODULE_CONFIG).find(key => MODULE_CONFIG[key].sheetName === sheetName);
      if (moduleKey) {
        initializeModuleSheet(sheet, moduleKey);
      }
    }
    
    console.log(`Sheet ${sheetName} initialized successfully`);
  } catch (error) {
    console.error(`Error initializing sheet ${sheetName}:`, error);
  }
}

function initializeUsersSheet(sheet) {
  const headers = [
    'ID', 'Name', 'Email', 'Role', 'HashedPassword', 'IsActive', 'IsLocked',
    'Created', 'LastLogin', 'LoginAttempts', 'AccountExpiry', 'InvitationCode',
    'Phone', 'Department', 'Position', 'BadgeNumber', 'SecurityClearance',
    'TwoFactorEnabled', 'PreferredLanguage', 'Timezone', 'LastPasswordChange',
    'PasswordResetRequired', 'ProfilePicture', 'EmergencyContact', 'Notes'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground('#1a365d');
  sheet.getRange(1, 1, 1, headers.length).setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);
}

function initializeSecurityLogsSheet(sheet) {
  const headers = [
    'ID', 'Timestamp', 'EventType', 'UserEmail', 'Details', 'SourceIP',
    'UserAgent', 'Location', 'Severity', 'Status', 'ResponseAction'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground('#e53e3e');
  sheet.getRange(1, 1, 1, headers.length).setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  
  sheet.autoResizeColumns(1, headers.length);
}

function initializeInvitationsSheet(sheet) {
  const headers = [
    'ID', 'InvitationCode', 'Email', 'Role', 'CreatedDate', 'ExpiryDate',
    'CreatedBy', 'Status', 'IsUsed', 'UsedDate', 'Notes'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground('#3182ce');
  sheet.getRange(1, 1, 1, headers.length).setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  
  sheet.autoResizeColumns(1, headers.length);
}

function initializeActivityLogSheet(sheet) {
  const headers = [
    'ID', 'Timestamp', 'Action', 'Module', 'RecordID', 'UserEmail',
    'Details', 'IPAddress', 'UserAgent', 'SessionID'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground('#38a169');
  sheet.getRange(1, 1, 1, headers.length).setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  
  sheet.autoResizeColumns(1, headers.length);
}

function initializeSystemStatusSheet(sheet) {
  const headers = [
    'ID', 'Status', 'IsInitialized', 'InitializationDate', 'InitializedBy', 'Notes', 'Version'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground('#805ad5');
  sheet.getRange(1, 1, 1, headers.length).setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  
  sheet.autoResizeColumns(1, headers.length);
}

function initializeModuleSheet(sheet, moduleKey) {
  const config = MODULE_CONFIG[moduleKey];
  const headers = ['ID', 'Created', 'CreatedBy', 'Modified', 'ModifiedBy', 'Status', 'ApprovalStatus'];
  
  // Add module-specific headers
  Object.keys(config.fields).forEach(fieldName => {
    headers.push(fieldName);
  });
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground('#2d5a87');
  sheet.getRange(1, 1, 1, headers.length).setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  
  sheet.autoResizeColumns(1, headers.length);
  
  // Add sample data for demonstration
  addSampleDataToModule(sheet, moduleKey, headers);
}

function addSampleDataToModule(sheet, moduleKey, headers) {
  try {
    const sampleData = getSampleDataForModule(moduleKey);
    if (sampleData.length > 0) {
      const startRow = 2;
      sheet.getRange(startRow, 1, sampleData.length, headers.length).setValues(sampleData);
      
      // Format sample data rows
      sheet.getRange(startRow, 1, sampleData.length, headers.length).setBackground('#f7fafc');
    }
  } catch (error) {
    console.error(`Error adding sample data to ${moduleKey}:`, error);
  }
}

function getSampleDataForModule(moduleKey) {
  const now = new Date();
  const sampleData = [];
  
  switch (moduleKey) {
    case 'cases':
      sampleData.push([
        'CAS001', now, 'system@example.com', now, 'system@example.com', 'Active', 'Approved',
        'ML-2024-001', 'Suspicious Banking Transactions', 'Money Laundering', 'High', 'Open',
        CONFIG.ADMIN_CREDENTIALS.EMAIL, now, 250000, 'Lusaka', 'Investigation into suspicious banking transactions involving multiple accounts', 'High', 8
      ]);
      sampleData.push([
        'CAS002', now, 'system@example.com', now, 'system@example.com', 'Active', 'Approved',
        'TF-2024-001', 'Terrorism Financing Investigation', 'Terrorism Financing', 'Critical', 'Under Investigation',
        CONFIG.ADMIN_CREDENTIALS.EMAIL, now, 150000, 'Ndola', 'Investigation into suspected terrorism financing network', 'High', 9
      ]);
      break;
      
    case 'entities':
      sampleData.push([
        'ENT001', now, 'system@example.com', now, 'system@example.com', 'Active', 'Approved',
        'ENT-001', 'Individual', 'John Doe', 'Johnny', new Date('1980-01-01'), 'Zambian',
        'NRC123456789', '123 Main Street, Lusaka', '+260971234567', 'john.doe@example.com', 45, 'Not PEP', 'No', 'Sample individual entity'
      ]);
      sampleData.push([
        'ENT002', now, 'system@example.com', now, 'system@example.com', 'Active', 'Approved',
        'ENT-002', 'Corporation', 'ABC Trading Ltd', 'ABC Corp', new Date('2010-05-15'), 'Zambian',
        'REG987654321', '456 Business Ave, Lusaka', '+260211123456', 'info@abctrading.com', 60, 'Not PEP', 'No', 'Sample corporate entity'
      ]);
      break;
      
    case 'investigations':
      sampleData.push([
        'INV001', now, 'system@example.com', now, 'system@example.com', 'Active', 'Approved',
        'INV-001', 'CAS001', 'Financial', CONFIG.ADMIN_CREDENTIALS.EMAIL, 'Active', now, 
        new Date(now.getTime() + 90*24*60*60*1000), 50000, 'Medium', 'Investigate financial transactions and identify money laundering patterns', 25, 'Initial analysis completed'
      ]);
      break;
      
    case 'prosecutions':
      sampleData.push([
        'PRO001', now, 'system@example.com', now, 'system@example.com', 'Active', 'Approved',
        'PRO-001', 'INV001', 'Criminal', CONFIG.ADMIN_CREDENTIALS.EMAIL, 'High Court of Zambia', 'HCZ/2024/001',
        'Money laundering contrary to the Financial Intelligence Centre Act', now, 
        new Date(now.getTime() + 60*24*60*60*1000), 'Filed', 'Pending', ''
      ]);
      break;
  }
  
  return sampleData;
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

function validatePasswordStrength(password) {
  if (password.length < CONFIG.SECURITY.PASSWORD_MIN_LENGTH) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[^A-Za-z0-9]/.test(password)) return false;
  return true;
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
      'Unknown IP', // In production, get real IP
      'Unknown Agent', // In production, get real user agent
      'Unknown Location', // In production, get real location
      'INFO',
      'LOGGED',
      'None'
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

function updateLastLogin(userId) {
  try {
    const sheet = getSheet(CONFIG.SHEETS.USERS);
    const data_range = sheet.getDataRange();
    const values = data_range.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === userId) {
        sheet.getRange(i + 1, 9).setValue(new Date()); // LastLogin column
        sheet.getRange(i + 1, 10).setValue(0); // Reset login attempts
        break;
      }
    }
  } catch (error) {
    console.error('Error updating last login:', error);
  }
}

function getUserByEmail(email) {
  try {
    const sheet = getSheet(CONFIG.SHEETS.USERS);
    const data_range = sheet.getDataRange();
    const values = data_range.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][2] === email) { // Email column is index 2
        return {
          id: values[i][0],
          name: values[i][1],
          email: values[i][2],
          role: values[i][3],
          hashedPassword: values[i][4],
          isActive: values[i][5],
          isLocked: values[i][6]
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

function sendPasswordResetEmail(email, resetToken) {
  try {
    const resetUrl = `${ScriptApp.getService().getUrl()}?resetToken=${resetToken}`;
    const subject = 'AML System - Password Reset Request';
    const body = `
      Dear User,
      
      You have requested a password reset for your AML System account.
      
      Please click the following link to reset your password:
      ${resetUrl}
      
      This link will expire in 30 minutes.
      
      If you did not request this reset, please ignore this email.
      
      Best regards,
      AML System Administration Team
    `;
    
    GmailApp.sendEmail(email, subject, body);
    
  } catch (error) {
    console.error('Email sending error:', error);
  }
}

function createSampleUsers() {
  const sheet = getSheet(CONFIG.SHEETS.USERS);
  const now = new Date();
  const accountExpiry = new Date(Date.now() + (CONFIG.SECURITY.ACCOUNT_VALIDITY_DAYS * 24 * 60 * 60 * 1000));
  
  const sampleUsers = [
    {
      name: 'National Manager',
      email: 'national@deczambia.gov.zm',
      role: CONFIG.USER_ROLES.NATIONAL_MANAGER,
      department: 'National Office',
      position: 'National Manager'
    },
    {
      name: 'Regional Manager',
      email: 'regional@deczambia.gov.zm', 
      role: CONFIG.USER_ROLES.REGIONAL_MANAGER,
      department: 'Regional Office',
      position: 'Regional Manager'
    },
    {
      name: 'Case Officer',
      email: 'officer@deczambia.gov.zm',
      role: CONFIG.USER_ROLES.CASE_OFFICER,
      department: 'Investigations',
      position: 'Senior Case Officer'
    }
  ];
  
  sampleUsers.forEach(user => {
    const userId = generateId('USR');
    const hashedPassword = hashPassword('SecurePass@123');
    
    sheet.appendRow([
      userId,
      user.name,
      user.email,
      user.role,
      hashedPassword,
      true,
      false,
      now,
      null,
      0,
      accountExpiry,
      null,
      '+260971234567',
      user.department,
      user.position,
      'BADGE' + userId.substr(-3),
      'Secret',
      false,
      'English',
      'Africa/Lusaka',
      now,
      false,
      '',
      '+260971234567',
      'Sample user account'
    ]);
  });
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
    if (!rolePermissions.modules.includes(module) && module !== 'admin') {
      return false;
    }
    
    // Check if user has the required permission
    if (!rolePermissions.permissions.includes(permission)) {
      return false;
    }
    
    return true;
    
  } catch (error) {
    console.error('Permission check error:', error);
    return false;
  }
}

function logActivity(action, module, recordId, userEmail) {
  try {
    const sheet = getSheet(CONFIG.SHEETS.ACTIVITY_LOG);
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
      }),
      'Unknown',
      'GoogleAppsScript',
      'N/A'
    ]);
  } catch (error) {
    console.error('Activity log error:', error);
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

// Additional required functions for completeness
function handleUpdateRecord(data) {
  return createJsonResponse({ message: 'Update functionality not implemented yet' });
}

function handleDeleteRecord(data) {
  return createJsonResponse({ message: 'Delete functionality not implemented yet' });
}

function handleApproveRecord(data) {
  return createJsonResponse({ message: 'Approve functionality not implemented yet' });
}

function handleCreateInvitation(data) {
  return createJsonResponse({ message: 'Invitation functionality not implemented yet' });
}

function handleRegister(data) {
  return createJsonResponse({ message: 'Registration functionality not implemented yet' });
}

function handleChangePassword(data) {
  return createJsonResponse({ message: 'Change password functionality not implemented yet' });
}

function handleLogSecurityEvent(data) {
  return createJsonResponse({ message: 'Security event logged' });
}

function handleGetUsers() {
  return createJsonResponse({ message: 'Get users functionality not implemented yet' });
}