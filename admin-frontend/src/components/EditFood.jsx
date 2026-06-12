import { useState } from "react";
import API from "../api/api";
import "../styles/food.css";
import { toast } from "react-toastify";
import { FaArrowLeft, FaCloudUploadAlt } from "react-icons/fa";

function EditFood({
  food,
  categories = [],
  onBack,
  onUpdate,
}) {
  const [form, setForm] = useState({
    name: food?.name || "",
    price: food?.price || "",
    category: food?.category?._id || "",
    description: food?.description || "",
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState(
    food?.images?.length
      ? food.images.map((img) =>
          img.startsWith("http")
            ? img
            : `http://localhost:5000${img}`
        )
      : []
  );

  const [loading, setLoading] = useState(false);

  // IMAGE CHANGE
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const validFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length !== files.length) {
      toast.error("Only image files allowed");
    }

    setImages(validFiles);

    const previewUrls = validFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviews(previewUrls);
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.price ||
      !form.category
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (Number(form.price) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", form.name);
      data.append("price", form.price);
      data.append("category", form.category);
      data.append(
        "description",
        form.description
      );

      images.forEach((img) => {
        data.append("image", img);
      });

      const res = await API.put(
        `/food/${food._id}`,
        data
      );

      toast.success("Food updated successfully ✅");

      if (onUpdate) {
        onUpdate(res.data);
      }

      setTimeout(() => {
        onBack();
      }, 1000);

    } catch (error) {
      console.error(error);
      toast.error("Error updating food ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="food-page">
      {/* HEADER */}
      <div className="food-page-header">
        <div>
          <h2>Edit Food</h2>
          <p>Update menu item details</p>
        </div>

        <button
          className="food-back-btn"
          onClick={onBack}
        >
          <FaArrowLeft />
          Back
        </button>
      </div>

      {/* FORM CARD */}
      <div className="food-form-card">
        <form
          className="food-form"
          onSubmit={handleSubmit}
        >
          {/* NAME */}
          <div className="food-form-group">
            <label>Food Name</label>
            <input
              type="text"
              placeholder="Enter food name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          </div>

          {/* PRICE */}
          <div className="food-form-group">
            <label>Price</label>
            <input
              type="number"
              placeholder="Enter price"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: e.target.value,
                })
              }
            />
          </div>

          {/* CATEGORY */}
          <div className="food-form-group">
            <label>Select Category</label>

            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
            >
              <option value="">
                Select Category
              </option>

              {categories.map((cat) => (
                <option
                  key={cat._id}
                  value={cat._id}
                >
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* IMAGE */}
          <div className="food-form-group">
            <label>Change Images</label>

            <label className="food-upload-box">
              <FaCloudUploadAlt />
              <span>
                Click to upload new food images
              </span>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>
          </div>

          {/* PREVIEW */}
          {previews.length > 0 && (
            <div className="food-preview-grid">
              {previews.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="preview"
                  className="food-preview-img"
                />
              ))}
            </div>
          )}

          {/* DESCRIPTION */}
          <div className="food-form-group full-width">
            <label>Description</label>

            <textarea
              rows="5"
              placeholder="Enter food description..."
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="food-submit-btn"
            disabled={loading}
          >
            {loading
              ? "Updating Food..."
              : "Update Food"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditFood;