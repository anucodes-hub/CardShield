const {
    isOTPExpired,
    isMaximumAttemptsReached
} = require("../services/otpService");


function verifyOtp(req, res) {

    const {
        transaction_id,
        otp
    } = req.body;


    if (
        transaction_id === undefined ||
        otp === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: "Transaction ID and OTP are required"
        });
    }


    /*
       Database integration will be added later.

       At that stage:
       1. Get OTP record from OTP_VERIFICATION.
       2. Check expiry.
       3. Check attempts.
       4. Compare OTP.
       5. Increase Attempts if incorrect.
       6. Block after 3 incorrect attempts.
       7. Approve transaction if OTP is correct.
    */


    return res.status(501).json({
        success: false,
        message: "OTP verification API structure created. Database integration is pending."
    });
}


module.exports = {
    verifyOtp
};