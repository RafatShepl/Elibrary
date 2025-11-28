import { useEffect, useState } from "react";

export default function AddBook() {
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
    // Handle input change
    // -----------------------
    const onChange = (event) => {
        const { name, value, type, checked, files } = event.target;

        if (type === "file") {
            const file = files?.[0] || null;
            setForm((prev) => ({ ...prev, coverImage: file }));
            setPreview(file ? URL.createObjectURL(file) : null);
            return;
        }

        if (type === "checkbox") {
            setForm((prev) => ({ ...prev, [name]: checked }));
            return;
        }

        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // -----------------------
    // Submit the form
    // -----------------------
    const onSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");

        if (!form.title || !form.author || !form.price || !form.stock) {
            setError("Title, Author, Price, and Stock are required.");
            return;
        }

        const formData = new FormData();
        Object.keys(form).forEach((key) => {
            if (form[key] !== null) {
                formData.append(key, form[key]);
            }
        });

        try {
            const res = await fetch("http://localhost:3000/book/", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to create book.");
                return;
            }

            setMessage(data.message || "Book created successfully!");

            setForm({
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

            setPreview(null);

        } catch (err) {
            setError("Something went wrong: " + err.message);
        }
    };

    // -----------------------
    // Load categories
    // -----------------------
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoadingCategories(true);
                const res = await fetch("http://localhost:3000/category/");
                const data = await res.json();

                if (res.ok) {
                    setCategories(data.data || []);
                }
            } catch (err) {
                console.log("Error loading categories:", err.message);
            } finally {
                setLoadingCategories(false);
            }
        };

        loadCategories();
    }, []);

    return (
        <div className="p-4">
            {message && <h1 className="text-green-600 font-bold">{message}</h1>}
            {error && <h1 className="text-red-600 font-bold">{error}</h1>}

            <form onSubmit={onSubmit} className="space-y-4">

                {/* Title & Author */}
                <div className="flex gap-3">
                    <div className="w-full flex flex-col">
                        <label className="font-bold text-slate-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={onChange}
                            className="p-2 bg-white rounded"
                            required
                        />
                    </div>

                    <div className="w-full flex flex-col">
                        <label className="font-bold text-slate-700">Author</label>
                        <input
                            type="text"
                            name="author"
                            value={form.author}
                            onChange={onChange}
                            className="p-2 bg-white rounded"
                            required
                        />
                    </div>
                </div>

                {/* Price & Stock */}
                <div className="flex gap-3">
                    <div className="w-full flex flex-col">
                        <label className="font-bold text-slate-700">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={onChange}
                            className="p-2 bg-white rounded"
                            min={0}
                            required
                        />
                    </div>

                    <div className="w-full flex flex-col">
                        <label className="font-bold text-slate-700">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={form.stock}
                            onChange={onChange}
                            className="p-2 bg-white rounded"
                            min={0}
                            required
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="flex flex-col">
                    <label className="font-bold text-slate-700">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={onChange}
                        className="p-2 bg-white rounded h-24 resize-none"
                    />
                </div>

                {/* Category & Discount */}
                <div className="flex gap-3">
                    <div className="w-full flex flex-col">
                        <label className="font-bold text-slate-700">Category</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={onChange}
                            className="p-2 bg-white rounded"
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full flex flex-col">
                        <label className="font-bold text-slate-700">
                            Discount Percentage
                        </label>
                        <input
                            type="number"
                            name="discountPercentage"
                            value={form.discountPercentage}
                            onChange={onChange}
                            className="p-2 bg-white rounded"
                            min={0}
                        />
                    </div>
                </div>

                {/* Checkboxes */}
                <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isOnSale"
                            checked={form.isOnSale}
                            onChange={onChange}
                        />
                        <span>On Sale</span>
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isFeature"
                            checked={form.isFeature}
                            onChange={onChange}
                        />
                        <span>Featured</span>
                    </label>
                </div>

                {/* File Upload */}
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <label className="font-bold text-slate-700">Cover Image</label>
                        <input
                            type="file"
                            name="coverImage"
                            onChange={onChange}
                            className="p-2 bg-white rounded cursor-pointer"
                        />
                    </div>

                    {preview && (
                        <img
                            src={preview}
                            alt="preview"
                            className="w-24 h-24 object-cover rounded"
                        />
                    )}
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Create Book
                </button>
            </form>
        </div>
    );
}
