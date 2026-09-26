function getFraudAlerts(req, res) {

    /*
       Database integration will later retrieve
       records from the FRAUD_ALERT table.
    */

    return res.status(501).json({
        success: false,
        message: "Fraud alert retrieval is pending database integration."
    });
}


module.exports = {
    getFraudAlerts
};