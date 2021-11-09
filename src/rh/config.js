module.exports = {
    FUNCTION_NAME: 'rhLambda',
    MFA_TOKEN_PATTERN: /^[0-9]{6}$/,

    // Success Messages
    SCHEDULED_EXECUTION: 'scheduled execution',
    SNS_EVENT_RECEIVED: 'sns event received',
    EXECUTION_SUCCESS: 'success',

    // Error Messages
    INVALID_SNS_MESSAGE: 'invalid sns event',
    SECRETS_MANANGER_ERROR: 'unable to get secret value'
}