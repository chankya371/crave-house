import { useState } from "react";
import API from "../api/api";
import "../styles/AdminCategory.css";
import { toast } from "react-toastify";
import { FaArrowLeft, FaCloudUploadAlt } from "react-icons/fa";

function EditCategory({
  category,
  onBack,
  onUpdate,
}) {
  const [name, setName] = useState(
    category?.name || ""
  );
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(
    category?.image || ""
  );
  const [loading, setLoading] = useState(false);

  // IMAGE CHANGE
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

  // UPDATE CATEGORY
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);

      if (image) {
        formData.append("image", image);
      }

      const res = await API.put(
        `/category/${category._id}`,
        formData
      );

      // UPDATE PARENT CATEGORY LIST
      if (onUpdate) {
        onUpdate(res.data);
      }

      toast.success(
        "Category updated successfully ✅"
      );

      // GO BACK TO CATEGORY LIST
      setTimeout(() => {
        onBack();
      }, 1000);

    } catch (err) {
      console.log(err);
      toast.error("Error updating category ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-page">
      {/* HEADER */}
      <div className="category-header">
        <div>
          <h2>Edit Category</h2>
          <p>Update category details</p>
        </div>

        <button
          type="button"
          className="category-back-btn"
          onClick={onBack}
        >
          <FaArrowLeft />
          Back
        </button>
      </div>

      {/* FORM */}
      <div className="category-form-card">
        <form
          className="category-form"
          onSubmit={handleSubmit}
        >
          {/* NAME */}
          <div className="form-group">
            <label>Category Name</label>

            <input
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

          {/* IMAGE */}
          <div className="form-group">
            <label>Change Category Image</label>

            <label className="upload-box">
              <FaCloudUploadAlt />

              <span>
                Click to upload new image
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

          {/* BUTTON */}
          <button
            type="submit"
            className="category-submit-btn"
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Update Category"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditCategory;