
export const appConfig = {
    mobile: '',
    withoutLoginUrls: ['/'],
    perPageDefault: 1,
    perPageArray: [12, 24, 36, 48, 60],
    perPageTblArray: [10, 20, 30, 40, 50, 100],
    perPageTblDefault: 1,
    date_format: 'DD-MM-YYYY',
    yearRange: 100,
    statusCode: {
        'ok':200,
        'created':201,
        'accepted':202,
        'noContent':204,
        'found':302,
        'temporaryRedirect':307,
        'badRequest': 400,
        'unauthorized': 401,
        'paymentRequired': 402,
        'forbidden': 403,
        'accountDeactivated': 433,
        'notFound': 404,
        'notAcceptable': 406,
        'requestTimeout': 408,
        'conflict': 409,
        'preconditionFailed': 412,
        'payloadTooLarge': 413,
        'unsupportedMediaType': 415,
        'tooManyRequests':429,
        'invalidToken': 498,
        'internalServerError': 500,
        'notImplemented': 501,
        'badGateway': 502,
        'serviceUnavailable': 503,
        'gatewayTimeout': 504,
        'httpVersionNotSupported': 505,
        'networkAuthenticationRequired': 511
    },
    pattern: {
        'USERNAME': /[a-zA-Z0-9_]{3,15}$/ig,
        'NAME': /^[a-zA-Z . \-\']*$/,
        "CITY": /^[a-zA-Z . \-\']*$/,
       // "EMAIL": /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "EMAIL":/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        "POSTAL_CODE": /(^\d{5}(-\d{4})?$)|(^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$)/, // /(^\d{5}$)|(^\d{5}-\d{4}$)/,
        "SUB_DOMAIN": /^[/a-z/A-Z][a-zA-Z0-9-]*[^/-/./0-9]$/,
        "PHONE_NO": /\(?\d{3}\)?-? *\d{3}-? *-?\d{4}/,
        "TASK_CODE": /^[0-9999]{1,4}$/,
        "SSN": /^((\d{3}-?\d{2}-?\d{4})|(X{3}-?X{2}-?X{4}))$/,
        "TRANSACTION_PIN": /d{4}$/,
        "PASSWORD": /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$/
    },
    email: {
        abuse_email: "no-reply@jointcrest.com",
        copyright: (new Date().getFullYear()) + " Copyright JointCrest, Lagos, Nigeria.",
        logo_url: "/public/images/logo.png"
    },
    roles: {
        "super_admin": 1, //Super Administrator
        "admin": 2, //Administrator
        "casual_user": 0, // Use services and Refer people
    },
    role_type: {
        "super_admin": { id: '1', meta: "super_admin", name: "Super Admin"},
        "admin": { id: '2', meta: "admin", name: "Admin"},
        "casual_user": { id: '3', meta: "casual_user", name: "Casual User"}
    },
    upload_dir: {
        "USER_PROFILE_PIC": '/public/dist/admin/productImages/',
        "BLOG_PIC": '/public/uploads/blogs/',
        "BLOG_CATEGORY_PIC": '/public/uploads/blogs/category/',
        "DEFAULT_MALE_PIC": '/public/images/male_avatar.png',
        "DEFAULT_FEMALE_PIC": '/public/images/female_avatar.png',
        "DEFAULT_MALE_WHITE_PIC": '/public/images/male_avatar_white.png',
        "DEFAULT_FEMALE_WHITE_PIC": '/public/images/female_avatar_white.png',
        "COMPANY_LOGO_DIR": '/public/uploads/logos/',
        "DEFAULT_COMPANY_LOGO": '/public/images/default_logo.png',
        "DOCUMENTS_DIR": '/uploads/'
    },
    files: {
        MAX_IMG_SIZE: 20 * 2000 * 2000
    },
    page: {
        limit: 10,
        orderBy: 'created',
        sortDirection: 'desc'
    },
    email_templates: {
        EMAIL_SUBJECT_ACCOUNT_ACTIVATION: {
            id: 1,
            template_name: 'security_code_tmpl'
        },
        EMAIL_SUBJECT_user_INVITE: {
            id: 2,
            template_name: 'ehs_user_invite_tmpl'
        },
        EMAIL_SUBJECT_REFERRAL: {
            id: 3,
            template_name: 'referral_tmpl'
        },
        EMAIL_SUBJECT_USER_MESSAGE: {
            id: 4,
            template_name: 'user_message_tmpl'
        },

        EMAIL_SUBJECT_RESET_PASSWORD_CONFIRMATION: {
            id: 5,
            template_name: 'reset_password_tmpl'
        },
        EMAIL_SUCCESSFUL_TRANSACTION: {
            id: 6,
            template_name: 'successful_transaction_tmpl',
            subject: 'Transaction Successful.'
        },       
        EMAIL_FAILED_TRANSACTION: {
            id: 7,
            template_name: 'failed_transaction_tmpl',
            subject: 'Transaction Failed.'
        },
        EMAIL_SUBJECT_ACCOUNT_ACTIVATION_PASSWORD: {
            id: 8,
            template_name: 'security_code_password_tmpl'
        },
        EMAIL_SUBJECT_ACCOUNT_ACTIVATION_CONFIRMATION: {
            id: 9
        },
        FORGOT_EMAIL_SENT: {
            id: 10,
            template_name: 'forgot_password_tmpl'
        },
        PATIENT_FORGOT_EMAIL_SENT: {
            id: 11,
            template_name: 'patient_forgot_password_tmpl'
        },
        SUPERADMIN_CREATE_CUSTOM_RESELLER: {
            id: 12,
            template_name: 'superadmin_create_custom_reseller'
        },
        EMAIL_SUBJECT_ALERT_NOTIFICATION: {
            id: 13
        },
        EMAIL_SUBJECT_MANUAL_SHIFT_NOTIFICATION: {
            id: 14
        },
        SUPER_EMAIL_SUBSCRIPTION_EXPIRY_ALERT: {
            id: 15,
            template_name: 'subscription_expiry_alert_email'
        },
        SUPER_EMAIL_SUBSCRIPTION_LIMIT_ALERT: {
            id: 16,
            template_name: 'subscription_limit_alert_email'
        },


    },
    from_account:{
        "WALLET":'1',
        "SAVINGS":'2',
    },
    txn_type:{
        "CHECKOUT":'checkout',
        "PAYOUT":'payout',
    },
    payment_method:{
        "WALLET":'1',
        "DEBIT_CREDIT_CARD":'2',
        "BANK_TRANSFER":'3'
    },
    trx_actions:{
        "DEPOSIT":'1',
        "SAVE":'2',
        "TRANSFER":'3'
    },
    scheduler: {
        "startOnlineHours": 8,
        "startOnlineMinutes": 0,
        "endOnlineHours": 17,
        "endOnlineMinutes": 59
    },
    user_status:{
        online:1,
        offline:0
    },
    loan_repayment:{
        "FULL":'Full Payment',
        "PART":'Part Payment'
    },
    loan_type:{
        'QUICK_CASH':'Quick Cash',
        'STANDARD_LOAN':'Standard Loan',
        "QUICKCASH": { id: 3, meta: "Quick Cash", name: "Quick Cash Loan"},
        "STANDARD": { id: 5, meta: "Standard Loan", name: "Standard Loan"}
    },
    guarantor_action:{
        'APPROVED':1,
        'DECLINED':2
    },
    storage: {
        'IS_MOBILE': 'rh_ism',
        'FIRST_TIMER': 'rh_f_t',
        'OTP_TOKEN': 'rh_otp_t',
        'PAGE_RELOADED':'rh_rl',
        'IS_LOGGED_IN': 'rh_login',
        'HEADER': 'rh_h',
        'ACTIVE_SESSION':'rh_ses_',
        'STRIPE_DATA':'rh_sd',
        'ACTIVE_EVENT_LINK':'rh_ael',
        'USER_LATITUDE':'rh_ulat_',
        'USER_LONGITUDE':'rh_ulong_',
        'USER_CURRENT_CURRENCYCODE':'rh_ucurc',
        'USER_CURRENT_CURRENCYSYMBOL':'rh_ucursb',
        'LONG_TIMEZONE':'rh_ltz',
        'SHORT_TIMEZONE':'rh_stz',
        'USER_CURRENT_CITY':'rh_ucc_',
        'USER_CURRENT_LONG_STATE':'rh_ucls_',
        'USER_CURRENT_SHORT_STATE':'rh_ucss_',
        'USER_CURRENT_COUNTRY':'rh_ucco_',
        'USER_CURRENT_COUNTRYCODE':'rh_uccocd_',
        'USER_CURRENT_POSTALCODE':'rh_ucpc_',
        'USER_CURRENT_NEIGHBORHOOD':'rh_ucnb_',
        'USER_CURRENT_AXIS':'rh_uca_',
        'USER_CURRENT_ZONE':'rh_ucz_',
        'EVENT_CITY':'rh_ec_',
        'EVENT_LONG_STATE':'rh_els_',
        'EVENT_SHORT_STATE':'rh_ess_',
        'EVENT_COUNTRY':'rh_eco_',
        'EVENT_COUNTRYCODE':'rh_ecocd_',
        'CHECKOUT_FEE_RATE':'rh_checkout_fee_rate',
        'PAYOUT_FEE_RATE':'rh_payout_fee_rate',
        'EVENTS_DATA':'_rh_events_data',
        'TICKET_CURRENCY':'_rh_ticket_currency',
        'TICKET_CURRENCY_CODE':'_rh_tK_curr_code',
        'REFUNDABLE':'_rh_refundable',
        'TXN_FEE_BY':'_rh_txn_fee_by',
        'GUEST_COUNTER':'_rh_guest_counter',
        'BONUS_GUEST_COUNTER':'_rh_bonus_guest_counter',
        'TOTAL_TICKET_COUNT':'rh_total_ticket_counter',
        'GUEST_LIST':'_rh_guest_list_counter',
        'BONUS_GUEST_LIST':'_rh_bonus_guest_list_counter',
        'GUESTS_DATA':'_rh_guests_data',
        'BONUS_GUEST_DATA':'_rh_bonus_guest_data',
        'USER_DATA':'_rh_user_data',
        'TICKET_DETAILS':'_rh_ticket_details',
        'USER_SOCIAL_HANDLES_DATA':'_rh_user_social_handles',
        'USER': '_rh_u_',
        'USERNAME': '_rh_uname_',
        'USER_EMAIL': '_rh_uemail_',
        'PROFILE_PIC': '_rh_u_profile_pic',
        'HAS_PROFILE_PIC': '_rh_u_has_profile_pic',
        'PERMISSIONS': '_rh_u_permissions',
        'TOKEN': '_rh_t_',
        'TOKEN_EXPIRY': '_rh_te_',
        'LOCKED': '_rh_lck_',
        'ROLE': '_rh_r_',
        'USER_ID': '_rh_ui_',
        'MOBILE': '_rh_umobile_',
        'USERFNAME': '_rh_fn_',
        'USERMNAME': '_rh_mn_',
        'USERLNAME': '_rh_ln_',
        'REMEMBER_ME':'_rh_remember_me'
    },
    load_timer:15000,
    API:{
        "TIMEOUT":10000,
        "RETRY":2,
        "DEBOUNCE_TIMEOUT":500,
        "CACHE_LATEST_RESP":1
    },
    
}