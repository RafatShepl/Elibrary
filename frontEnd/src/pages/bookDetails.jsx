import { useParams } from "react-router-dom"
import { useAuth } from "../auth/authContext"
import { useEffect, useState } from "react"
import { useCart } from "../cart/cartContext"
import { Minus, Plus } from "lucide-react"

export default function BookDetails() {
    const URI = "http://localhost:3000"
    const { id } = useParams()
    const { setMessage, setError, setLoading, loading } = useAuth()
    const [bookdetail, setBookdetail] = useState(null)

    const { addToCart, cartData, updateCart } = useCart()
    const [qty, setQty] = useState(1)

    // FIXED update function
    const update = async (newQty) => {
        setQty(newQty)

        // Prevent errors before bookdetail loads
        if (!bookdetail) return

        // If cart empty --> add item
        if (!cartData || cartData?.items?.length === 0) {
            await addToCart(bookdetail._id, newQty)
        } else {
            await updateCart(bookdetail._id, newQty)
        }
    }

    // fetch book data
    const getBookData = async () => {
        setLoading(true)
        setMessage("")
        setError("")

        try {
            const res = await fetch(`${URI}/book/${id}`, {
                method: "GET",
                credentials: "include",
            })

            if (!res.ok) throw new Error("Failed to get book data")

            const bookdata = await res.json()
            setBookdetail(bookdata.data)
            setMessage(bookdata.message)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) getBookData()
    }, [id])

    if (loading) return null

    return (
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6">
            {bookdetail && (
                <>
                    {/* LEFT: Image */}
                    <div className="w-full md:w-1/3 flex items-center justify-center">
                        <img
                            src={`${URI}/public/Images/${bookdetail.coverImage}`}
                            alt={bookdetail.title}
                            className="w-72 h-96 object-cover rounded-lg shadow-md"
                        />
                    </div>

                    {/* RIGHT: Details */}
                    <div className="flex flex-col gap-4 w-full md:w-2/3">
                        <h1 className="text-2xl font-bold">{bookdetail.title}</h1>

                        <p className="text-gray-600 leading-relaxed">
                            {bookdetail.description}
                        </p>

                        <p className="text-2xl font-semibold text-green-600">
                            ${bookdetail.price}
                        </p>

                        <p className="text-gray-700 font-medium">
                            Stock:{" "}
                            <span
                                className={
                                    bookdetail.stock > 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                }
                            >
                                {bookdetail.stock}
                            </span>
                        </p>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-3 mt-3">
                            <button
                                onClick={() => qty > 1 && update(qty - 1)}
                                className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                                disabled={qty <= 1}
                            >
                                <Minus />
                            </button>

                            <input
                                type="number"
                                value={qty}
                                onChange={(e) => update(Number(e.target.value))}
                                className="w-14 text-center border rounded-lg py-1"
                                min={1}
                                disabled={bookdetail.stock === 0}
                            />

                            <button
                                onClick={() => update(qty + 1)}
                                className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                                disabled={bookdetail.stock === 0}
                            >
                                <Plus />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
