const { dbClient } = require("./database-client")

const client = dbClient()

module.exports.getMenu = async (event) => {
  const { dates } = JSON.parse(event.body)
  const query = `
    SELECT menu.id,
           menu.date,
           menu.type,
           menu.title,
           menu.description,
           menu.price,
           menu.image
    FROM menu
    WHERE date = ANY('{${dates}}');
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

module.exports.addMenu = async (event) => {
  const { date, title, description, image, price, type } = JSON.parse(event.body)
  const query = `
    INSERT INTO
    menu (
      date, title, description, image, price, type
    )
    VALUES (
      '${date}', '${title}', '${description}', '${image}', ${price}, '${type}'
    )
  `

  try {
    const res = await client.query(query)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: "Menu added"
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

module.exports.deleteMenu = async (event) => {
  const id = event.pathParameters.id
  const query = `
    DELETE FROM menu WHERE id = ${id}
  `

  try {
    await client.query(query)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: "Menu deleted"
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
