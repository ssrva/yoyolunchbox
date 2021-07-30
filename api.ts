import axios from "axios"

export const getMenu = async (dates: string[]) => {
  const response = await axios.post("/menu", { dates: dates.join(",") })
  return response.data
}

export const getUserWalletBalance = async (username: string) => {
  const response = await axios.get(`/user/balance/${username}`)
  return response.data
}

export const getUserOrders = async (username: string, page: number) => {
  const response = await axios.get(`/user/orders/${username}/${page}`);
  return response.data
}

export const placeOrder = async (orders: Object[]) => {
  const response = await axios.post("/orders", { orders })
  return response.data
}