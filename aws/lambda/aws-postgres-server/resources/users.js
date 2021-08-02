const { siloDbClient, dbClient } = require("./database-client")

const client = dbClient()

module.exports.createUser = async (event) => {
  const username = event.userName
  const userAttributes = event.request.userAttributes
  const query = `
    INSERT INTO
    users (username, name, phone)
    VALUES ('${username}', '${userAttributes.name}', ${userAttributes.phone_number})
  `
  try {
    await client.query(query)
  } catch(e) {
    console.error(e.message)
  }
}

module.exports.getUser = async (event) => {
  const username = event.pathParameters.username
  const query = `
    SELECT * FROM users WHERE username = '${username}'
  `
  try {
    const response = await client.query(query)
    return {
      statusCode: 200,
      body: JSON.stringify(response.rows[0])
    }
  } catch(e) {
    console.error(e.message)
    return {
      statusCode: 400,
      body: e.message
    }
  }
}

module.exports.updateUser = async (event) => {
  const { username, address, coordinates } = JSON.parse(event.body)
  const query = `
    UPDATE users
    SET address = '${address}',
        coordinates = '${JSON.stringify(coordinates)}'::jsonb
    WHERE username = '${username}'
  `
  try {
    await client.query(query)
    return {
      statusCode: 200,
      body: "User updated successfully"
    }
  } catch(e) {
    console.error(e.message)
    return {
      statusCode: 400,
      body: e.message
    }
  }
}

module.exports.getUserOrders = async (event) => {
  const username = event.pathParameters.username
  const page = event.pathParameters.page
  const query = `
    SELECT orders.id,  
           orders.quantity,
           orders.created_on,
           orders.cancelled,
           menu.date,
           menu.type,
           food.price,
           food.title,
           food.description
    FROM orders
    INNER JOIN menu ON orders.menu_id = menu.id
    INNER JOIN food ON food.id = menu.food_id
    WHERE username = '${username}'
    ORDER BY orders.created_on DESC
    LIMIT 10
    OFFSET ${page};
  `

  try {
    const res = await client.query(query)
    return {
      statusCode: 200,
      body: JSON.stringify(res.rows)
    }
  } catch(e) {
    console.error(e.message)
    return {
      statusCode: 400,
      body: e.message
    }
  }
}

module.exports.getUserWalletBalance = async (event) => {
  const username = event.pathParameters.username
  const query = `
    SELECT balance
    FROM users
    WHERE username = '${username}'
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
