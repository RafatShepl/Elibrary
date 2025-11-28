import { useEffect, useState } from "react";

export default function CategoryList({setCategory}) {
  const URI = "http://localhost:3000";
  const [categoryList, setCategoryList] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${URI}/category`);
      if (res.ok) {
        const categories = await res.json();
        setCategoryList(categories?.data || []);
      } else {
        console.log("Failed to fetch categories:", res.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Function to generate random green or blue color
  const getRandomGreenBlue = () => {
    const colors = [
      "#2E8B57", // sea green
      "#3CB371", // medium sea green
      "#20B2AA", // light sea green
      "#1E90FF", // dodger blue
      "#4682B4", // steel blue
      "#00CED1", // dark turquoise
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Function to get contrasting text color (black/white)
  const getContrastColor = (bgColor) => {
    // Convert hex to RGB
    const r = parseInt(bgColor.substr(1, 2), 16);
    const g = parseInt(bgColor.substr(3, 2), 16);
    const b = parseInt(bgColor.substr(5, 2), 16);
    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? "#000" : "#fff";
  };

  return (
    <div className="flex flex-wrap justify-end items-center gap-3 p-2">
      <p className="text-gray-600 font-medium">See more:</p>
      {categoryList.map((cat) => {
        const bgColor = getRandomGreenBlue();
        const textColor = getContrastColor(bgColor);
        return (
          <button
            key={cat._id}
            style={{ backgroundColor: bgColor, color: textColor }}
            className="px-5 py-3 rounded-lg shadow-md hover:scale-105 transition-transform cursor-pointer font-semibold"
            onClick={()=>setCategory(cat._id)}
          >
            {cat?.name}
          </button>
        );
      })}
    </div>
  );
}
