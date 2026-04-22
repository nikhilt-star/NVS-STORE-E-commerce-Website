import { useDispatch, useSelector } from 'react-redux'
import {
  addItem,
  clearCart,
  removeItem,
  updateQuantity,
} from '../features/cart/cartSlice'

export const useCart = () => {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.cart.items)

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0,
  )

  return {
    items,
    totalItems,
    totalAmount,
    addToCart: (payload) => dispatch(addItem(payload)),
    removeFromCart: (productId) => dispatch(removeItem(productId)),
    changeQuantity: (payload) => dispatch(updateQuantity(payload)),
    clear: () => dispatch(clearCart()),
  }
}
