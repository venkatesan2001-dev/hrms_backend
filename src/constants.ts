export enum ResponseStatus {
  BAD_REQUEST = 400,
  VALIDATION_ERROR = 412,
  NOT_FOUND = 404,
  NOT_ALLOWED = 405,
  INTERNAL_ERROR = 500,
  BAD_GATEWAY = 502,
  SUCCESS = 200,
  CREATED = 201,
  CONFLICT = 409,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
}

export enum DefaultMessage {
  INACTIVE_USER = 'User is Inactive',
  USER_NOT_FOUND = 'User not found',
  NO_RECORDS_FOUND = 'No records found',
  INVALID_CREDENTIAL = 'Invalid Employee ID or Password',
  NOT_EXISTS = 'Not exists.',
  INVALID_TOKEN = 'Invalid Token',
  JWT_EXPIRED = 'Session has expired',
  INVALID_SIGNATURE = 'Signature failed',
  USER_NOT_EXISTS = 'There is No User Associated With this mail ID',
  INVALID_LINK = 'Invalid Link',
  OLD_PASS_NEW_PASS_SAME = 'Old password and New password should not be same',
  OLD_PASSWORD_INCORRECT = 'Old password is incorrect',
  PRODUCT_CATEGORY_EXIST = 'Product category with this name already exist',
  EMAIL_TEMPLATE_EXIST = 'Email template with this name already exist',
  SAMPLE_CON_EXIST = 'Sample condition with this name already exist',
  ID_MANDATORY = 'Id should not be empty when validate name',
  USERNAME_EXISTS = 'Username already exists',
  EMAIL_EXISTS = 'Email already exists',
  INVALID_COLUMNS_FOUND = 'Invalid columns found',
  NOT_AVAILABLE = 'N/A',
  EMPLOYEE_ID_PREFIX = 'RL',
  AUTHORIZATION_FAILED = 'Authorization Failed',
  PERMISSION_DENIED = "You don't have permission to perform this action",
  VALUE_LENGTH_DIFFER = 'Range value length must be a value of 2',
  FUTUREDATE_NOT_ALLOWED = 'Future dates are not allowed',
  INVALID_SUB_STATUS = 'Invalid sub status found',
  REPEAT_SUB_STATUS = 'The status has already been set as you given',
  SRFID_EXISTS = 'SRF ID already exists',
  TEST_REQUESTNO_EXISTS = 'Test Request Number already exists',
  ENCODEDCODE_EXISTS = 'Encoded code already exists',
  DATE_VAL_REPORTISSUED = 'Report issue date should not less than sample received date',
  DATE_VAL_RETURNEDON = 'Returned on date should not less than report issued date',
  DATE_VAL_ENDDATE = 'End date should not less than sample received date',
}

export const SampleStatusConfig = {
  REPORTS_ISSUED_STATUS: ['REPORTS_ISSUED'],
  REPORTS_ISSUED_SUB_STATUS: ['RETURNED', 'DISPOSED'],
  ALLOTTED_STATUS: ['ALLOTTED'],
  ALLOTTED_SUB_STATUS: ['IN_TESTING', 'CANCELLED'],
};

export const EmailTemplatesConfig = {
  EMPLOYEE_CREATE: 'EMPLOYEE_CREATE',
  FORGET_PASSWORD: 'FORGET_PASSWORD',
  ASSIGN_SAMPLE_ADMIN: 'ASSIGN_SAMPLE_ADMIN',
  ASSIGN_SAMPLE_STANDARD: 'ASSIGN_SAMPLE_STANDARD',
  DISCLAIMER: `This email is for the use of intended recipient(s) only. If
              you have received this email in error, please notify the sender 
              immediately and then delete it. If you are not the intended recipient,
               you must not keep, use, disclose, copy or distribute this email without 
               the author's prior permission. We have taken precautions to minimize the 
               risk of transmitting software viruses, but we advise you to carry out your own
                virus checks on any attachment to this message. We cannot accept liability for 
                any loss or damage caused by software viruses. The information contained in this 
                communication may be confidential`,
};

export const ReportSampleConfig = {
  ALLOWED_KEYS: [
    'received_date',
    'applicant_name',
    'product_category_ref',
    'model_no',
    'no_of_samples_received',
    'standard',
    'allot_srf_id',
    'rpt_testreport_no',
    'rpt_issue_date',
    'tested_by_ref',
    'rpt_expiry_date',
    'status',
    'sub_status',
  ],
  EQUVALENT_DISPLAY_HEADER: {
    received_date: 'RECEIVED DATE',
    end_date: 'END DATE',
    applicant_name: 'APPLICANT NAME',
    product_category_ref: 'PRODUCT CATEGORY',
    model_no: 'MODEL NUMBER',
    no_of_samples_received: 'NO OF SAMPLES RECEIVED',
    standard: 'STANDARD',
    allot_srf_id: 'SRF ID',
    rpt_testreport_no: 'TEST REPORT NO',
    rpt_issue_date: 'REPORT ISSUE DATE',
    tested_by_ref: 'TESTED BY',
    rpt_expiry_date: 'EXPIRY DATE',
    status: 'STATUS',
    sub_status: 'SUB STATUS',
  },
  CHILD_OBJECT: {
    product_category_ref: 'name',
    tested_by_ref: 'first_name',
  },
};

export const ROLE = {
  ADMIN: 'ADMIN',
  STANDARD: 'STANDARD',
};
