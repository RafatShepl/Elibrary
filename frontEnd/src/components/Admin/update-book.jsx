import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateBook() {
  const navigate = useNavigate();
  const { id } = useParams(); // if id exists, edit mode
   const URI = "http://localhost:3000"

  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    price: 0,
    stock: 0,
    discountPercentage: 0,
    isOnSale: true,
    isFeature: false,
    coverImage: null,
    category: ""
  });

  // -----------------------
  // Load book if editing
  // -----------------------
  useEffect(() => {
    if (!id) return; // create mode

    const fetchBook = async () => {
      try {
        const res = await fetch(`http://localhost:3000/admin/book/${id}`, {
          method: "GET",
          credentials: "include" // send cookie
        });

        const data = await res.json();
        const book = data?.data
        console.log(data)
        if (res.ok) {
          setForm({
            title: book.title || "",
            author: book.author || "",
            description: book.description || "",
            price: book.price || 0,
            stock: book.stock || 0,
            discountPercentage: book.discountPercentage || 0,
            isOnSale: book.isOnSale || false,
            isFeature: book.isFeature || false,
            coverImage:book.coverImage || null,
            category: book.category || ""
          });
          
          setPreview(`${URI}/public/Images/${book?.coverImage}` || null);
        } else {
          setError(data.message || "Failed to load book.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBook();
  }, [id]);

  // -----------------------
  // Load categories
  // -----------------------
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await fetch("http://localhost:3000/category/", { credentials: "include" });
        const data = await res.json();
        if (res.ok) setCategories(data.data || []);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  // -----------------------
  // Handle input change
  // -----------------------
  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files?.[0] || null;
      setForm((prev) => ({ ...prev, coverImage: file }));
      setPreview(file ? URL.createObjectURL(file) : preview);
      return;
    }

    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // -----------------------
  // Submit form (update only)
  // -----------------------
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!id) {
      setError("Book ID missing. Cannot update.");
      return;
    }

    if (!form.title || !form.author || !form.price || !form.stock) {
      setError("Title, Author, Price, and Stock are required.");
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null) formData.append(key, form[key]);
    });

    try {
      const res = await fetch(`http://localhost:3000/admin/book/${id}`, {
        method: "PUT",
        credentials: "include",
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to update book.");
        return;
      }

      setMessage(data.message || "Book updated successfully!");
      navigate("/admin/books"); // redirect after update
    } catch (err) {
      setError("Something went wrong: " + err.message);
    }
  };

  return (
    <div className="p-4">
      {message && <h1 className="text-green-600 font-bold">{message}</h1>}
      {error && <h1 className="text-red-600 font-bold">{error}</h1>}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Title & Author */}
        <div className="flex gap-3">
          <div className="w-full flex flex-col">
            <label className="font-bold text-slate-700">Title</label>
            <input type="text" name="title" value={form.title} onChange={onChange} className="p-2 bg-white rounded" required />
          </div>
          <div className="w-full flex flex-col">
            <label className="font-bold text-slate-700">Author</label>
            <input type="text" name="author" value={form.author} onChange={onChange} className="p-2 bg-white rounded" required />
          </div>
        </div>

        {/* Price & Stock */}
        <div className="flex gap-3">
          <div className="w-full flex flex-col">
            <label className="font-bold text-slate-700">Price</label>
            <input type="number" name="price" value={form.price} onChange={onChange} className="p-2 bg-white rounded" min={0} required />
          </div>
          <div className="w-full flex flex-col">
            <label className="font-bold text-slate-700">Stock</label>
            <input type="number" name="stock" value={form.stock} onChange={onChange} className="p-2 bg-white rounded" min={0} required />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="font-bold text-slate-700">Description</label>
          <textarea name="description" value={form.description} onChange={onChange} className="p-2 bg-white rounded h-24 resize-none" />
        </div>

        {/* Category & Discount */}
        <div className="flex gap-3">
          <div className="w-full flex flex-col">
            <label className="font-bold text-slate-700">Category</label>
            <select name="category" value={form.category} onChange={onChange} className="p-2 bg-white rounded">
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="w-full flex flex-col">
            <label className="font-bold text-slate-700">Discount Percentage</label>
            <input type="number" name="discountPercentage" value={form.discountPercentage} onChange={onChange} className="p-2 bg-white rounded" min={0} />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isOnSale" checked={form.isOnSale} onChange={onChange} />
            <span>On Sale</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isFeature" checked={form.isFeature} onChange={onChange} />
            <span>Featured</span>
          </label>
        </div>

        {/* File Upload */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <label className="font-bold text-slate-700">Cover Image</label>
            <input type="file" name="coverImage" onChange={onChange} className="p-2 bg-white rounded cursor-pointer" />
          </div>
          {preview && <img src={preview} alt="preview" className="w-24 h-24 object-cover rounded" />}
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Update Book
        </button>
      </form>
    </div>
  );
}
