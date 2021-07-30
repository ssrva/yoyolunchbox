import axios from "axios"

export const getMenu = async (dates: string[]) => {
  const response = await axios.post("/menu", { dates: dates.join(",") })
  return response.data
}

export const placeOrder = async () => {
  
}