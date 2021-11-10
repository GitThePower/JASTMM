module.exports = {
    MFA_TOKEN_PATTERN: /^[0-9]{6}$/,

    // Success Messages
    SCHEDULED_EXECUTION: 'scheduled execution',
    SNS_EVENT_RECEIVED: 'sns event received',
    SECRET_RETRIEVED: 'secret successfully retried from secrets manager',
    RH_CONNECTION_SUCCESS: 'connected to rh',
    EXECUTION_SUCCESS: 'success',

    // Error Messages
    INVALID_SNS_MESSAGE: 'invalid sns event',
    SECRETS_MANANGER_ERROR: 'unable to get secret value',
    RH_CONNECTION_ERROR: 'unable to connect to rh'
}