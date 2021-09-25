const axios = require("axios")

module.exports.createPaymentsOrder = async (event) => {
  const { id, amount } = JSON.parse(event.body)
  const headers = {
    "Content-Type": "application/json",
    "x-client-id": "924989d1ebeeaf3afe3c26a9c89429",
    "x-client-secret": "24839868117154ae939ef625065eb8b1f339984c",
  }
  // const prodHeaders = {
  //   "Content-Type": "application/json",
  //   "x-client-id": "140167899dad3f999080d3ff3b761041",
  //   "x-client-secret": "fb82368bf6991592259144423d5419d09898f433",
  // }
  const endpoint = "https://test.cashfree.com/api/v2/cftoken/order"

  try {
    const response = await axios.post(endpoint, {
      orderId: id,
      orderAmount: amount,
      orderCurrency: "INR"
    }, {
      headers
    })

    const result = {
      orderId: id,
      orderAmount: amount,
      orderCurrency: "INR",
      cfToken: response.data.cftoken,
    }
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    }
  } catch(e) {
    console.log(JSON.stringify(e))
    return {
      statusCode: 400,
      body: e.message
    }
  }

}