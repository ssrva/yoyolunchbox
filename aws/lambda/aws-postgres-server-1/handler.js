"use strict";
const { Client } = require('pg')
 
// If 'client' variable doesn't exist
if (typeof client === 'undefined') {
  // Connect to Postgres
  var client = new Client({
    user: 'root',
    host: 'yoyolunchbox-1.ccnjt7j5gwxy.us-east-1.rds.amazonaws.com',
    database: 'yoyolunchbox',
    password: 'getshitdone',
    port: 8000,
  })
  client.connect()
}

module.exports.getUser = async (event) => {
  console.log(event)
  const userId = event.pathParameters.id
  const query = `
    SELECT name, phone, address
    FROM users
    WHERE id = ${userId}
  `

  try {
    const res = await client.query(query)
    if(res.rows.length < 1) {
      throw "User not found"
    }
    return {
      statusCode: 200,
      body: JSON.stringify(res.rows[0])
    }
  } catch(e) {
    return {
      statusCode: 400,
      body: e.message
    }
  }
};