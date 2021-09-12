import axios from "axios"

export const getUserDetails = async (username: string) => {
  const response = await axios.get(`/user/${username}`)
  return response.data
}

export const updateUserDetails = async (username: string, details: Object) => {
  const response = await axios.put("/user", {
    username,
    ...details
  })
  return response.data
}

export const getUserTransactions = async (username: string) => {
  const response = await axios.get(`/user/transactions/${username}`)
  return response.data
}

export const getUserWalletBalance = async (username: string) => {
  const response = await axios.get(`/user/balance/${username}`)
  return response.data
}

export const getUserOrders = async (
  status: string,
  username: string,
  page: number
) => {
  const response = await axios.get(`/user/orders/${username}/${page}/${status}`);
  return response.data
}

export const getMenu = async (dates: string[]) => {
  const response = await axios.post("/menu", { dates: dates.join(",") })
  return response.data
}

export const getFoodimage = async (imageKey: string) => {
  const response = await axios.get(`/menu/image/${imageKey}`)
  return response.data
}

export const placeOrder = async (username: string, charges: Object, orders: Object[]) => {
  const response = await axios.post("/orders", { username, charges, orders })
  return response.data
}