const { dbClient } = require("./database-client")

const client = dbClient()

module.exports.placeOrder = async (event) => {
  const { quantity, username, menu_id } = JSON.parse(event.body)
  const query = `
    INSERT INTO
    orders (quantity, username, menu_id)
    VALUES ('${quantity}', '${username}', '${menu_id}')
    RETURNING id
  `
  try {
    const res = await client.query(query)
    return {
      statusCode: 200,
      body: JSON.stringify(res.rows[0])
    }
  } catch(e) {
    console.error(e.message)
    return {
      statusCode: 400,
      body: e.message
    }
  }
}

module.exports.cancelOrder = async (event) => {
  const { order_id } = JSON.parse(event.body)
  const query = `
    UPDATE orders
    SET cancelled = true
    WHERE id = ${order_id}
  `
  try {
    const res = await client.query(query)
    console.log(res)
    return {
      statusCode: 200,
      body: "Order cancelled successfully"
    }
  } catch(e) {
    console.error(e.message)
    return {
      statusCode: 400,
      body: e.message
    }
  }
}