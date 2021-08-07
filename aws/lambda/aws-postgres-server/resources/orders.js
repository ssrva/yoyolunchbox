const { siloDbClient } = require("./database-client")

module.exports.placeOrder = async (event) => {
  const client = siloDbClient();
  // each order is expected to have the fields
  // quantity, menu_id.
  const { username, charges, orders } = JSON.parse(event.body)

  const usernames = Array(orders.length).fill(`'${username}'`)
  const quantities = orders.map(order => order.quantity)
  const menu_ids = orders.map(order => order.menu_id)
  const itemTotal = orders.map(order => order.amount).reduce((acc, val) => {
    return acc + val
  }, 0)
  const otherCharges = Object.values(charges).reduce((acc, val) => {
    return acc + val
  }, 0)

  const placeOrderQuery = `
    INSERT INTO
    orders (username, quantity, menu_id)
    VALUES (
      UNNEST(ARRAY[${usernames.join(",")}]),
      UNNEST(ARRAY[${quantities.join(",")}]),
      UNNEST(ARRAY[${menu_ids.join(",")}])
    )
  `
  const updateBalanceQuery = `
    UPDATE users
    SET balance = users.balance - ${itemTotal + otherCharges}
    WHERE username = '${username}'
  `

  try {
    await client.query("BEGIN")
    await client.query(placeOrderQuery)
    await client.query(updateBalanceQuery)
    await client.query("COMMIT")
    await client.end()
    return {
      statusCode: 200,
      body: "Order placed successfully"
    }
  } catch(e) {
    console.error(e.message)
    await client.query("ROLLBACK")
    await client.end()
    return {
      statusCode: 400,
      body: e.message
    }
  }
}

module.exports.cancelOrder = async (event) => {
  const client = siloDbClient();
  const { username, order_id } = JSON.parse(event.body)
  const cancelOrderQuery = `
    UPDATE orders
    SET status = 'cancelled'
    WHERE id = ${order_id}
  `
  const updateBalanceQuery = `
    UPDATE users
    SET balance = (
      SELECT food.price * orders.quantity
      FROM orders
      INNER JOIN menu ON menu.id = orders.menu_id
      INNER JOIN food ON menu.food_id = food.id
      WHERE orders.id = ${order_id}
    ) + users.balance
    WHERE username = '${username}'
  `

  try {
    await client.query("BEGIN")
    await client.query(cancelOrderQuery)
    await client.query(updateBalanceQuery)
    await client.query("COMMIT")
    await client.end()
    return {
      statusCode: 200,
      body: "Order cancelled successfully"
    }
  } catch(e) {
    console.error(e.message)
    await client.query("ROLLBACK")
    await client.end()
    return {
      statusCode: 400,
      body: e.message
    }
  }
}