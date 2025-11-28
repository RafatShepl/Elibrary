import { useEffect, useState } from "react";
import { useCart } from "../cart/cartContext";
import { useAuth } from "../auth/authContext";
import { Link, } from "react-router-dom";
import { Book, Heart, ShoppingCartIcon } from "lucide-react";
import CategoryList from "../components/categoryList";

export default function AllBooks() {
    const URI = "http://localhost:3000"
    const [books, setBooks] = useState([]);
    const { addToCart, cartData } = useCart()
    const { isAuthenticated } = useAuth()

    const [ filterData, setFilterData ] = useState({
        auther: '',
        title: '',
        price: 0
    })
    const [category,setCategory]=useState('')
  const fetchBooks = async () => {
            const querystring = new URLSearchParams()
            if(filterData.title) querystring.append("title",filterData.title)
            if(filterData.auther) querystring.append("author",filterData.auther)
            if(filterData.price) querystring.append("price",filterData.price)
            if(category) querystring.append("categoryId",category)
            try {
                const res = await fetch(`${URI}/book?${querystring.toString()}`);
                if (res.ok) {
                    const featuredBooks = await res.json();
                    setBooks(featuredBooks?.pagination?.data);

                    console.log(featuredBooks?.pagination?.data);
                } else {
                    console.log("Failed to fetch books:", res.status);
                }
            } catch (error) {
                console.log(error);
            }finally{
                setFilterData({
                      auther: '',
        title: '',
        price: 0
                })
            }

        };


    useEffect(() => {
      

        fetchBooks();

    }, [cartData,category]);

    return (

<div>
    <div className="m-5 px-4 w-auto">
    <CategoryList setCategory ={setCategory}/>

    </div>

        <div className="p-3 flex-col md:flex-row w-full gap-24">
         
                <div className="flex flex-col flex-1  gap-1  m-3 self-start px-6 shadow-md">
                    <div className="w-full flex flex-col">
                        <label className="font-bold text-slate-700 ">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={filterData?.title}
                            onChange={(e) => setFilterData((p) => ({ ...p, [e.target.name]: e.target.value }))}
                            className="p-2 bg-amber-50 rounded shadow"

                        />
                    </div>

                    <div className="w-full flex flex-col">
                        <label className="font-bold text-slate-700">Author</label>
                        <input
                            type="text"
                            name="auther"
                            value={filterData?.auther}
                            onChange={(e) => setFilterData((p) => ({ ...p, [e.target.name]: e.target.value }))}
                            className="p-2 bg-amber-50 rounded shadow"
                        />
                    </div>

                    <div className="w-full flex flex-col">
                        <label className="font-bold text-slate-700">price:{filterData?.price}</label>
          

                        <input
                        min={0}
                        start={0}
                            type="range"
                            name="price"
                            value={filterData?.price}
                            onChange={(e) => setFilterData((p) => ({ ...p, [e.target.name]: e.target.value }))}
                            className="p-2 rounded "
                        />
                    </div>
                    <button onClick={()=> fetchBooks()} className="p-2 rounded bg-sky-400 self-end cursor-pointer m-2 hover:bg-sky-500" >search</button>
                </div>
     

            <div className="flex-4 grid grid-cols-1 md:grid-cols-2  gap-5 m-3 ">

                {books.length > 0 ? (
                    books.map((book) => (
                        <div
                            key={book._id}
                            className="rounded p-4 md:w-[80%] flex flex-col items-center shadow-xl bg-sky-50 hover:cursor-pointer overflow-hidden group"
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
                    <p className="text-sm text-gray-500">There is no book</p>
                )}
            </div>
        </div>
</div>





    );
}
