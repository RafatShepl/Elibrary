import { ShoppingCartIcon, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../cart/cartContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/authContext";

export default function ShoppingCart() {
    const URI = "http://localhost:3000";
    const { cartData, updateCart, removeFromCart } = useCart();
    const {loading}=useAuth()
if(loading)return
    if (!cartData || !cartData.items || cartData.items.length === 0) {
        return (
            <div className="flex flex-col items-center mt-10 text-xl">
                <p className="text-gray-500">There are no items selected yet</p>
                <Link to="/" className="text-green-600 underline mt-2">
                    Return to home
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center p-6">
            <h1 className="text-3xl font-extrabold text-green-600 flex gap-2 items-center">
                Your Shopping Cart <ShoppingCartIcon />
            </h1>

            <div className="w-[90%] md:w-[60%] mt-6 space-y-5">

                {cartData.items.map((item) => (
                    <CartItem
                        key={item.book._id}
                        item={item}
                        URI={URI}
                        updateCart={updateCart}
                        removeFromCart={removeFromCart}
                    />
                ))}

                {/* Cart Summary */}
                <div className="p-4 bg-gray-100 rounded-xl shadow mt-4 flex justify-between text-lg font-bold">
                    <p>Total Quantity: {cartData.totalQuantity}</p>
                    <p>Total Price: ${cartData.totalPrice}</p>
                </div>
            </div>
        </div>
    );
}

function CartItem({ item, URI, updateCart, removeFromCart }) {
    const [qty, setQty] = useState(item.quantity);

    const update = async (newQty) => {
        setQty(newQty);
        await updateCart(
            item.book._id,
            newQty
        );
    };

    return (
        <div className="flex gap-4 bg-white rounded-xl shadow p-4 items-center">
            {/* IMAGE */}
            <img
                src={`${URI}/public/Images/${item.book.coverImage}`}
                alt={item.book.title}
                className="w-24 h-24 object-cover rounded-lg"
            />

            <div className="flex-1">
                <h3 className="text-xl font-semibold">{item.book.title}</h3>
                <p className="text-green-600 font-bold">${item.price}</p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-2">
                    <button
                        onClick={() => qty > 1 && update(qty - 1)}
                        className="p-1 border rounded hover:bg-gray-200 disabled:opacity-20 cursor-pointer"
                        disabled={qty <= 0}
                    >
                        <Minus />
                    </button>

                    <input
                        type="number"
                        value={qty}
                        onChange={(e) => update(Number(e.target.value))}
                        className="w-14 text-center border rounded"
                         disabled={item.book.stock ==0}
                    />

                    <button
                        onClick={() => update(qty + 1)}
                        className="p-1 border rounded hover:bg-gray-200 disabled:opacity-20 disabled:cursor-default cursor-pointer"
                       disabled={item.book.stock ==0}
                    >
                        <Plus />
                    </button>
                </div>
            </div>

            {/* DELETE */}
            <button
                onClick={() =>{ removeFromCart( item.book._id )}}
                className="text-red-600 hover:text-red-800"
            >
                <Trash2 size={30} />
            </button>
        </div>
    );
}
