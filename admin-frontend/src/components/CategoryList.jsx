import React, { useState } from "react";
import { FaEdit, FaSearch, FaTags } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "../styles/AdminCategory.css";
import API from "../api/api";

function CategoryList({
  categories,
  onAdd,
  setCategories,
  setPage,
  setSelectedCategory,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const itemsPerPage = 5;

  // Search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentCategories = filteredCategories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await API.delete(`/category/${id}`);
      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (err) {
      console.log(err);
      alert("Error deleting category");
    }
  };

  return (
    <div className="category-container">
      {/* Header */}
      <div className="category-top">
  <div className="category-count">
    <FaTags />
    <span>{categories.length} Categories</span>
  </div>
</div>

      {/* Search + Add */}
      <div className="category-actions-bar">
        <div className="category-search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search category..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <button className="category-add-btn" onClick={onAdd}>
          + Add Category
        </button>
      </div>

      {/* Table */}
      <div className="category-table-wrapper">
        <table className="category-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Category</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentCategories.length === 0 ? (
              <tr>
                <td colSpan="4" className="category-empty">
                  No categories found
                </td>
              </tr>
            ) : (
              currentCategories.map((cat, index) => (
                <tr key={cat._id}>
                  <td>{startIndex + index + 1}</td>

                  <td>
                    <div className="category-name">
                      {cat.name}
                    </div>
                  </td>

                  <td>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="category-image"
                    />
                  </td>

                  <td>
  <div className="category-btns">
    <button
      className="category-btn edit-btn"
      onClick={() => {
        setSelectedCategory(cat);
        setPage("editCategory");
      }}
    >
      <FaEdit />
    </button>

    <button
      className="category-btn delete-btn"
      onClick={() => handleDelete(cat._id)}
    >
      <MdDelete />
    </button>
  </div>
</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredCategories.length > itemsPerPage && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active-page" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default CategoryList;