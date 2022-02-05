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

export const cancelOrder = async(orderId: number, username: string) => {
  const response = await axios.delete("/orders", {
    data: {
      order_id: orderId,
      username: username
    }
  });
  return response.data
}

export const getMenu = async (dates: string[], username?: string) => {
  // should not pass jwt token for getMenu call. Hence using new instance of axios.
  const uninterceptedAxiosInstance = axios.create();
  const response = await uninterceptedAxiosInstance.post("/menu", {
    username,
    dates: dates.join(","),
  })
  return response.data
}

export const getFoodimage = async (imageKey: string) => {
  const response = await axios.get(`/food/image/${imageKey}`)
  return response.data
}

export const placeOrder = async (username: string, charges: Object, orders: Object[]) => {
  const response = await axios.post("/orders", { username, charges, orders })
  return response.data
}

export const getCashfreeOrderToken = async (orderId: string, amount: string) => {
  const response = await axios.post("/payments/order", {
    id: orderId,
    amount: amount
  })
  return response.data
}

export const updateUserWalletBalance = async (
  username: string,
  amount: string,
  metadata: Object
) => {
  const response = await axios.post("/payments/user/wallet", {
    username, amount, metadata
  })
  return response.data
}

export const getCurrentTime = async () => {
  const response = await axios.get("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  return response.data;
}
