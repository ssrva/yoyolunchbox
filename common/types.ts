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