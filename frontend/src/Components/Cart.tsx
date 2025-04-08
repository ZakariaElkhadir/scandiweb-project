
const Cart = () => {
  return (
    <div className="absolute top-16 right-0 w-80 h-96 bg-white shadow-lg z-50">
        <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">My Bag 3 items</h2>
          
        </div>
          {/* for cart items with image chose size  chose color add more & less */}
          <div></div>
            {/* for total price */}
            <div></div>
            <button className="bg-green-400 w-4/5 h-5 text-white rounded-sm">Place Order</button>
    </div>
  )
}

export default Cart