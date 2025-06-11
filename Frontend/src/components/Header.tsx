import { NavLink, useNavigate } from "react-router-dom";
import { Setting } from "./setting";
//import { useAppSelector } from "@/reduxThunkRTK/Hooks";

export default function Header() {
  const navigate = useNavigate();
  //const { token: signupToken } = useAppSelector((state) => state.signup);
  //const { token: loginToken } = useAppSelector((state) => state.login);

  const token = localStorage.getItem("token");
  return (
    <header className="bg-blue-500 p-4 text-white flex items-center w-full fixed top-0 left-0 z-1">
      <h1
        onClick={() => navigate("/")}
        className="text-xl font-bold cursor-pointer"
      >
        My Website Rest API
      </h1>
      <nav className="flex items-center space-x-8 ml-auto">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive
              ? "text-yellow-300 font-bold underline"
              : "text-white hover:underline"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive
              ? "text-yellow-300 font-bold underline"
              : "text-white hover:underline"
          }
        >
          Login
        </NavLink>
        <NavLink
          to="/signup"
          className={({ isActive }) =>
            isActive
              ? "text-yellow-300 font-bold underline"
              : "text-white hover:underline"
          }
        >
          Sign Up
        </NavLink>
        {token && <Setting />}
      </nav>
    </header>
  );
}
