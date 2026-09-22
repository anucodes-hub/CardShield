const {
    calculateRiskScore
} = require("../services/fraudService");


function pay(req, res) {

    const {
        card_id,
        amount,
        merchant,
        location
    } = req.body;


    // Basic validation
    if (
        card_id === undefined ||
        amount === undefined ||
        merchant === undefined ||
        location === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: "Card ID, amount, merchant and location are required"
        });
    }


    // Validate amount
    if (amount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Amount must be greater than 0"
        });
    }


    /*
       Database integration will be added later.

       At that stage:
       1. Store transaction in TRANSACTION table.
       2. Check the fraud rules.
       3. Calculate Risk_Score.
       4. Set Status.
       5. Approve / OTP / Block.
    */

    return res.status(501).json({
        success: false,
        message: "Payment API structure created. Database integration is pending."
    });
}


module.exports = {
    pay
};