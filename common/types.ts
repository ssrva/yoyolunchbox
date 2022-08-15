export type TOrderListItemProps = {
  id: number,
  title: string,
  type: string,
  date: string,
  image: string,
  description: string,
  price: string,
  quantity: number,
  hideDate: boolean,
  cancellable: boolean,
  disabled: boolean,
  status: string,
  onChange: Function,
  onCancel: Function,
  grayOut: boolean,
  grayOutDescription: string,
  source: string
}

export type TSubscription = {
  id?: number,
  start_date?: string,
  end_date?: string,
  plan?: string,
  free_deliveries_left?: number,
  active: boolean
}