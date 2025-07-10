import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const categoriesList = [
  "Engineering",
  "Medical & NEET Preparation",
  "JEE & Engineering Entrance Prep",
  "UPSC & Civil Services Prep",
  "Government & Banking Exams",
  "Science & Technology",
  "Computer Science & IT",
  "Fiction (General)",
  "Fantasy & Science Fiction",
  "Thriller, Mystery & Suspense",
  "Romance",
  "Motivational & Self-Help",
  "Biography & Autobiography",
  "Literature & Classics",
  "Mythology & Spirituality",
  "History & Politics",
  "Geography & Environment",
  "Economics & Finance",
  "Philosophy & Ethics",
  "Psychology & Mental Health",
  "Poetry",
  "Art, Design & Photography",
  "Travel & Adventure",
  "Children’s Books",
  "Young Adult (YA)",
  "Language Learning & Communication",
  "Law & Legal Studies",
  "Data Science, AI & Machine Learning",
  "Comics & Graphic Novels",
  "Cookbooks & Food Culture",
  "Other",
];

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    desc: "",
    url: "",
    language: "",
    category: "",
    editionOrPublishYear: "",
    stock: "",
  });

  const [previewMode, setPreviewMode] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/add-book",
        formData,
        {
          headers: {
            id: localStorage.getItem("id"),
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(response.data.message);
      navigate("/admin/books");
    } catch (err) {
      console.error(err);
      alert("Failed to add book. Try again.");
    }
  };

  const placeholders = {
    title: "Enter book title (e.g., Atomic Habits)",
    author: "Enter author's full name",
    price: "Set price in ₹ (e.g., 499)",
    desc: "Provide a brief book summary",
    url: "Paste cover image URL",
    language: "Specify language (e.g., English)",
    category: "Select book category",
    editionOrPublishYear: "e.g., 1st Edition or 2022",
    stock: "Total available copies",
  };

  const isFormValid = Object.entries(formData).every(([key, value]) => !!value);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white px-4 sm:px-8 py-10 flex justify-center">
      <div className="w-full max-w-7xl bg-zinc-900/50 rounded-3xl px-6 sm:px-12 py-10 shadow-xl border border-zinc-700">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-yellow-400 tracking-wide">
          📘 Add a New Book to BookBalcony
        </h1>

        {!previewMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <label className="block mb-2 capitalize text-sm text-yellow-300 font-semibold tracking-wide">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                {key === "category" ? (
                  <select
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
                  >
                    <option value="" disabled>
                      -- Select a Category --
                    </option>
                    {categoriesList.map((cat, idx) => (
                      <option key={idx} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={key === "price" || key === "stock" ? "number" : "text"}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholders[key]}
                    className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-600 placeholder:text-zinc-400 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
                  />
                )}
              </div>
            ))}

            <div className="md:col-span-2 flex justify-end mt-6">
              <button
                onClick={() => isFormValid ? setPreviewMode(true) : alert("Please fill all fields before previewing")}
                className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition-all duration-300 shadow-lg"
              >
                👀 Preview Book
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-800 p-6 rounded-2xl border border-yellow-500 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-yellow-300">📖 Preview Book Details</h2>

            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={formData.url || "https://via.placeholder.com/150"}
                alt="Book Cover"
                className="w-48 h-64 object-cover border-4 border-yellow-400 rounded-lg shadow-md"
              />

              <div className="flex-1 space-y-2 text-sm">
                {Object.entries(formData).map(([key, value]) => (
                  <p key={key}>
                    <span className="text-yellow-300 font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1")}:
                    </span>{" "}
                    <span className="text-white">{value || "N/A"}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setPreviewMode(false)}
                className="px-6 py-2 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 transition-all duration-300"
              >
                ✏️ Edit Info
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 transition-all duration-300"
              >
                ✅ Submit Book
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBook;
