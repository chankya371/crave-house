import { useEffect, useState } from "react";
import { FaEdit, FaSearch, FaUtensils } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import API from "../api/api";
import "../styles/food.css";

function FoodList({
  setPage,
  setSelectedFood,
}) {
  const [food, setFood] = useState([]);
  const [filteredFood, setFilteredFood] = useState([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFood, setTotalFood] = useState(0);

  const limit = 5;

  // FETCH FOOD
  const fetchFood = async (pageNumber = 1) => {
    try {
      const res = await API.get(
        `/food?page=${pageNumber}&limit=${limit}`
      );

      const foodData = res.data.data || [];

      setFood(foodData);
      setFilteredFood(foodData);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.page || 1);
      setTotalFood(res.data.total || 0);

    } catch (error) {
      console.error(error);
      toast.error("Error fetching food");
    }
  };

  useEffect(() => {
    fetchFood(currentPage);
  }, [currentPage]);

  // SEARCH
  useEffect(() => {
    const filtered = food.filter((item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredFood(filtered);
  }, [search, food]);

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this food item?")) return;

    try {
      await API.delete(`/food/${id}`);

      toast.success("Food deleted successfully");

      if (food.length === 1 && currentPage > 1) {
        fetchFood(currentPage - 1);
      } else {
        fetchFood(currentPage);
      }

    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  // IMAGE URL
  const getImageUrl = (item) => {
    if (item.images?.length > 0) {
      const img = item.images[0];

      return img.startsWith("http")
        ? img
        : `http://localhost:5000${img}`;
    }

    if (item.image) {
      return item.image.startsWith("http")
        ? item.image
        : `http://localhost:5000${item.image}`;
    }

    return "https://via.placeholder.com/100";
  };

  return (
    <div className="food-container">
      {/* HEADER */}
      <div className="food-top">
        

        <div className="food-count">
          <FaUtensils />
          <span>{totalFood} Food Items</span>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="food-actions-bar">
        <div className="food-search">
          <FaSearch />

          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* WORKING ADD BUTTON */}
        <button
          className="food-add-btn"
          onClick={() => setPage("addFood")}
        >
          + Add Food
        </button>
      </div>

      {/* TABLE */}
      <div className="food-table-wrapper">
        <table className="food-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Image</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredFood.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="food-empty"
                >
                  No food found
                </td>
              </tr>
            ) : (
              filteredFood.map((item, index) => (
                <tr key={item._id}>
                  <td>
                    {(currentPage - 1) * limit +
                      index +
                      1}
                  </td>

                  <td className="food-name">
                    {item.name}
                  </td>

                  <td className="food-price">
                    ₹{item.price}
                  </td>

                  <td>
                    {item.category?.name || "N/A"}
                  </td>

                  <td>
                    <img
                      src={getImageUrl(item)}
                      alt={item.name}
                      className="food-image"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/100";
                      }}
                    />
                  </td>

                  <td className="food-description">
                    {item.description || "N/A"}
                  </td>

                  <td>
                    <div className="food-btns">
                      {/* EDIT */}
                      <button
                        className="food-btn edit-btn"
                        onClick={() => {
                          setSelectedFood(item);
                          setPage("editFood");
                        }}
                      >
                        <FaEdit />
                      </button>

                      {/* DELETE */}
                      <button
                        className="food-btn delete-btn"
                        onClick={() =>
                          handleDelete(item._id)
                        }
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

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(currentPage - 1)
            }
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={
                currentPage === i + 1
                  ? "active-page"
                  : ""
              }
              onClick={() =>
                setCurrentPage(i + 1)
              }
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              setCurrentPage(currentPage + 1)
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default FoodList;