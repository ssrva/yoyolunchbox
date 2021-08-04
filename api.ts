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

export const getUserWalletBalance = async (username: string) => {
  const response = await axios.get(`/user/balance/${username}`)
  return response.data
}

export const getUserOrders = async (username: string, page: number) => {
  const response = await axios.get(`/user/orders/${username}/${page}`);
  return response.data
}

export const getMenu = async (dates: string[]) => {
  const response = await axios.post("/menu", { dates: dates.join(",") })
  return response.data
}

export const getFoodimage = async (imageKey: string) => {
  const cachedResults = {}
  return async function () {
    if (cachedResults[imageKey] == null) {
      try {
        const response = await axios.get(`/food/image/${imageKey}`)
        cachedResults[imageKey] = response.data
      } catch(e) {
        console.log("call errored ", e.message)
        throw e
      }
    }
    return cachedResults[imageKey]
  }()
}

export const placeOrder = async (username: string, orders: Object[]) => {
  const response = await axios.post("/orders", { username, orders })
  return response.data
}