const AWS = require('aws-sdk')
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