import { useEffect, useState } from "react";
import { useAuth } from "../../auth/authContext";
import { Link, useNavigate } from "react-router-dom";

export default function AllBooks() {
    const URI = "http://localhost:3000"
    const [books, setBooks] = useState([]);
    const {isAdmin, isAuthenticated,loading} = useAuth()
    const navigate = useNavigate()

  useEffect(() => {
  if (loading) return; // wait for AuthProvider to finish

  if (!isAuthenticated || !isAdmin) {
    navigate("/");
    return;
  }

  const fetchBooks = async () => {
    try {
      const res = await fetch(`${URI}/admin/book`, {
        credentials: "include" // IMPORTANT
      });

      if (!res.ok) {
        console.log("Failed to fetch books:", res.status);
        return;
      }

      const data = await res.json();
      setBooks(data.pagination.data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchBooks();
}, [isAuthenticated, isAdmin, loading]);


    return (
        <div>  <h2>All Books</h2><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-3 ">

            {books.length > 0 ? (
                books.map((book) => (
                    <div key={book._id} className=" rounded  p-4 flex flex-col items-center shadow-xl  bg-sky-50">
                        <img
                            src={`${URI}/public/Images/${book?.coverImage}`} // assumes images are in public/Images
                            alt={book.title}
                            className="w-full h-48 object-cover rounded mb-3"
                        />
                        <h3 className="text-lg font-bold">{book.title}</h3>
                        <p className="text-sm text-gray-600">{book.description}</p>
                        <p className="text-green-600 font-semibold mt-2">${book.price}</p>
                        <div>
                            <Link to={`/admin/updateBook/${book._id}`}>update</Link>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-sm text-gray-500">Loading books...</p>
            )}
        </div></div>

    );
}
