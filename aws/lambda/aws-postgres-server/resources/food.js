const AWS = require('aws-sdk')
const { dbClient } = require("./database-client")

const client = dbClient()
var s3 = new AWS.S3()

module.exports.getFoodImage = async (event) => {
  const key = event.pathParameters.key
  var params = {
    "Bucket": "yoyo-food-images",
    "Key": key
  }
  try {
    const data = await s3.getObject(params).promise()
    return {
      body: data.Body.toString('base64'),
      headers: {
        'Content-Length': data.ContentLength,
        'Content-Type': data.ContentType,
      },
      statusCode: 200,
      isBase64Encoded: true,
    }
  } catch(e) {
    console.log(e)
    return {
      statusCode: 400,
      body: e.message,
    }
  }
}

module.exports.addFood = async (event) => {
  const {title, description, price, image} = JSON.parse(event.body)
  const query = `
    INSERT INTO
    food (
      title, description, price, image
    )
    VALUES (
      '${title}', '${description}', ${price}, '${image}'
    )
  `

  try {
    const res = await client.query(query)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: "Food added"
    }
  } catch(e) {
    console.error(e.message)
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: e.message
    }
  }
}

module.exports.getFood = async (event) => {
  const query = `
    SELECT * FROM food
  `

  try {
    const res = await client.query(query)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(res.rows)
    }
  } catch(e) {
    console.error(e.message)
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: e.message
    }
  }
}
