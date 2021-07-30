const { dbClient } = require("./database-client")

const client = dbClient()

module.exports.placeOrder = async (event) => {
  // each order is expected to have the fields
  // username, quantity, menu_id.
  const { orders } = JSON.parse(event.body)

  const usernames = orders.map(order => `'${order.username}'`)
  const quantities = orders.map(order => order.quantity)
  const menu_ids = orders.map(order => order.menu_id)
  const query = `
    INSERT INTO
    orders (username, quantity, menu_id)
    VALUES (
      UNNEST(ARRAY[${usernames.join(",")}]),
      UNNEST(ARRAY[${quantities.join(",")}]),
      UNNEST(ARRAY[${menu_ids.join(",")}])
    )
  `
  try {
    const res = await client.query(query)
    return {
      statusCode: 200,
      body: JSON.stringify(res)
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