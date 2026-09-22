function getTransactions(req, res) {

    /*
       Database integration will later retrieve
       transactions from the TRANSACTION table.
    */

    return res.status(501).json({
        success: false,
        message: "Transaction retrieval is pending database integration."
    });
}


function getCustomerTransactions(req, res) {

    const customerId = req.params.id;


    if (!customerId) {
        return res.status(400).json({
            success: false,
            message: "Customer ID is required"
        });
    }


    /*
       Database integration will later retrieve
       transaction history for this Customer_ID.
    */

    return res.status(501).json({
        success: false,
        message: "Customer transaction history is pending database integration."
    });
}


module.exports = {
    getTransactions,
    getCustomerTransactions
};