import { useState } from "react";
import API from "../api/api";
import "../styles/AdminCategory.css";
import { toast } from "react-toastify";
import { FaArrowLeft, FaCloudUploadAlt } from "react-icons/fa";

function AddCategory({ onBack }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !image) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);

      await API.post("/category", formData);

      toast.success("Category added successfully ✅");

      setName("");
      setImage(null);
      setPreview("");

      setTimeout(() => {
        onBack();
      }, 1200);

    } catch (err) {
      console.log(err);
      toast.error("Error adding category ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-page">
      {/* HEADER */}
      <div className="category-header">
        <div>
          <h2>Add Category</h2>
          <p>Create a new food category</p>
        </div>

        <button
          className="category-back-btn"
          onClick={onBack}
        >
          <FaArrowLeft />
          Back
        </button>
      </div>

      {/* FORM CARD */}
      <div className="category-form-card">
        <form
          className="category-form"
          onSubmit={handleSubmit}
        >
          {/* CATEGORY NAME */}
          <div className="form-group">
  <label>Category Name</label>

  <input
    type="text"
    placeholder="Enter category name"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
</div>

          {/* IMAGE */}
          <div className="form-group">
            <label>Upload Category Image</label>

            <label className="upload-box">
              <FaCloudUploadAlt />

              <span>
                Click to upload category image
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>
          </div>

          {/* PREVIEW */}
          {preview && (
            <div className="preview-wrapper">
              <img
                src={preview}
                alt="preview"
                className="category-preview"
              />
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            className="category-submit-btn"
            disabled={loading}
          >
            {loading
              ? "Adding Category..."
              : "Add Category"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCategory;