import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const navLinks = [
  { to: "/profile", label: "Profile" },
  { to: "/connections", label: "Connections" },
  { to: "/requests", label: "Requests" },
  { to: "/premium", label: "Premium" },
];

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/login");
    } catch (err) {
      // Error logic maybe redirect to error page
      console.log(err);
    }
  };

  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-1 bg-base-300 px-3 py-2 sm:px-5">
      <Link to="/" className="btn btn-ghost px-2 text-xl">
        👩‍💻 DevTinder
      </Link>
      {user && (
        <>
          <nav aria-label="Main navigation" className="order-last flex w-full flex-wrap gap-1 lg:order-none lg:w-auto">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) =>
                `btn btn-ghost btn-sm ${isActive ? "btn-active" : ""}`
              }>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden max-w-40 truncate sm:inline">Welcome, {user.firstName}</span>
            <img src={user.photoUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
            <button type="button" onClick={handleLogout} className="btn btn-ghost btn-sm">
              Logout
            </button>
          </div>
        </>
      )}
    </header>
  );
};
export default NavBar;
