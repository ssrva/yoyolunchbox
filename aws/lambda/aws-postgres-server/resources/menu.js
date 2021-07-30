const { dbClient } = require("./database-client")

const client = dbClient()

module.exports.getMenu = async (event) => {
  const { dates } = JSON.parse(event.body)
  const query = `
    SELECT menu.id, menu.date, menu.type, food.title, food.description, food.price
    FROM menu
    INNER JOIN food ON food.id = menu.food_id
    WHERE date = ANY('{${dates}}');
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
