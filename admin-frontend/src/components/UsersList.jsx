import { useEffect, useState } from "react";
import API from "../api/api";
import { FaSearch, FaUsers } from "react-icons/fa";
import "../styles/UsersList.css";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      `${user.firstName} ${user.lastName} ${user.email} ${user.mobile}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredUsers(filtered);
  }, [search, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      console.log("Token:", localStorage.getItem("token"));

      // Axios interceptor automatically sends the token
      const res = await API.get("/users");

      console.log("Users Response:", res.data);

      setUsers(res.data || []);
      setFilteredUsers(res.data || []);
    } catch (err) {
      console.error("Users fetch error:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        console.error("Unauthorized - Invalid or expired token");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="users-container">
        <div className="users-loading">
          <h2>Loading Users...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="users-container">
      {/* Top Bar */}
      <div className="users-top-bar">
        <div className="users-count">
          <FaUsers />
          <span>{users.length} Users</span>
        </div>
      </div>

      {/* Search */}
      <div className="search-box">
        <FaSearch />
        <input
          type="text"
          placeholder="Search by name, email, mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Mobile</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>

                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.firstName?.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <h4>
                          {user.firstName} {user.lastName}
                        </h4>
                        <p>User Account</p>
                      </div>
                    </div>
                  </td>

                  <td>{user.mobile || "N/A"}</td>
                  <td>{user.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty-state">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersList;