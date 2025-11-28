import { useEffect, useState } from "react";
import { useCart } from "../cart/cartContext";
import { useAuth } from "../auth/authContext";
import { Link, useNavigate } from "react-router-dom";
import { Book, HardHat, Heart, ShoppingCartIcon } from "lucide-react";

export default function FeatureBooks() {
    const URI = "http://localhost:3000"
    const [books, setBooks] = useState([]);
    const { addToCart, cartData } = useCart()
    const { isAuthenticated,
        isAdmin } = useAuth()



    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await fetch(`${URI}/book?isFuture=true`);
                if (res.ok) {
                    const featuredBooks = await res.json();
                    setBooks(featuredBooks?.pagination?.data);

                    console.log(featuredBooks?.pagination?.data);
                } else {
                    console.log("Failed to fetch books:", res.status);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchBooks();

    }, [cartData]);

    return (
        <div className="p-3">  <h2>Featured Books</h2><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-3 ">

            {books.length > 0 ? (
                books.map((book) => (
                    <div
                        key={book._id}
                        className="rounded p-4 flex flex-col items-center shadow-xl bg-sky-50 hover:cursor-pointer overflow-hidden group"
                    >
                        <img
                            src={`${URI}/public/Images/${book?.coverImage}`}
                            alt={book.title}
                            className="w-full h-48 object-cover rounded mb-3 transition duration-500 group-hover:scale-110"
                        />

                        <h3 className="text-lg font-bold">{book.title}</h3>
                        <p className="text-sm text-gray-600">{book.description}</p>
                        <p className="text-green-600 font-semibold mt-2">${book.price}</p>
                        <p className="text-green-600 font-semibold mt-2">stock: {book.stock}</p>

                        {/* Icons */}
                        <div className="flex justify-evenly items-center w-full translate-y-80 
                    transition-all duration-500 group-hover:translate-y-0 bg-sky-100 opacity-80 p-3 *:hover:text-green-500 ">
                        <button onClick={() => addToCart(book._id, 1)} className={` hover:cursor-pointer  ${(!isAuthenticated) ? "hidden" : "block"}`}><ShoppingCartIcon /></button> 
                            <Link to={`/book-details/${book._id}`}><Book /></Link>
                            <Link><Heart /></Link>
                        </div>
                    </div>

                ))
            ) : (
                <p className="text-sm text-gray-500">no futurte books yet</p>
            )}
        </div></div>

    );
}
