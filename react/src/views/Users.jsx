import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

function Users() {
  const { user, setUser, setToken, setNotification } = useStateContext();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, []);

  const onDelete = (u) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    axiosClient.delete(`/users/${u.id}`).then((_) => {
      if (u.id === user.id) {
        setToken(null);
        setUser({});
        getUsers();
      }
      setNotification("User has been successfully deleted");
      getUsers();
    });
  };

  const getUsers = (page = 1) => {
    setLoading(true);
    axiosClient
      .get(`/users?page=${page}`)
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
        setMeta(data.meta);
      })
      .catch((_) => {
        setLoading(false);
      });
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Users</h1>
        <Link to="/users/new" className="btn-add">
          Add new
        </Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Create Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          )}
          <tbody>
            {users.map((u, index) => (
              <tr key={u.id}>
                <td>
                  {meta.total -
                    ((meta.current_page - 1) * meta.per_page + index)}
                </td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.created_at}</td>
                <td>
                  <Link to={"/users/" + u.id} className="btn-edit">
                    Edit
                  </Link>
                  &nbsp;
                  <button onClick={(_) => onDelete(u)} className="btn-delete">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!loading && meta.total > 0 && (
        <div
          className="pagination"
          style={{ marginTop: "3rem", textAlign: "center" }}
        >
          {(() => {
            let buttons = [];
            for (let i = 1; i <= meta.last_page; i++) {
              buttons.push(
                <button
                  key={i}
                  style={{
                    backgroundColor:
                      meta.current_page === i ? "#00A762" : "#5b08a7",
                  }}
                  onClick={() => getUsers(i)}
                >
                  {i}
                </button>
              );
            }
            return buttons;
          })()}
        </div>
      )}
    </div>
  );
}

export default Users;
