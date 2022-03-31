import * as React from 'react';
import { TOrderListItemProps } from 'common/types';
import OrderListItem from './OrderListItem';
import { useSelector, useDispatch } from 'react-redux';
import { updateCart } from "store/actions"

/**
 * This is a wrapper around OrderListItem. In case the given menu id
 * item is present in cart (in redux store), it overrides the given
 * props with the data from redux store cart. If not it just passes
 * along the given props to OrderListItem.
 */
const ConnectedOrderListItem = (props: TOrderListItemProps) => {
    const { id } = props
    let cart = useSelector(store => store.cart)
    const cartItem = cart[id] || {}
    const dispatch = useDispatch()

    const onChange = (updateCartPayload) => {
        dispatch(updateCart(updateCartPayload))
    }

    const updatedProps = {
        ...props,
        ...cartItem
    }

    return (
        <OrderListItem
            {...updatedProps}
            onChange={onChange} />
    );
}

export default ConnectedOrderListItem
