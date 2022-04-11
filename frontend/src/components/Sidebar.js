import React from "react";
import { NavLink, Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";

import secondaryLogo from "../assets/secondaryLogo.svg";

const isNotActiveStyles =
  "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize";

const isActiveStyles =
  "flex items-center px-5 py-2 gap-3 font-bold border-r-4 border-primary transition-all duration-200 ease-in-out capitalize";

const categories = [
  { name: "Animals" },
  { name: "Photography" },
  { name: "Gaming" },
  { name: "Wallpapers" },
  { name: "Coding" },
  { name: "Others" },
];
const Sidebar = ({ user, closeToggle }) => {
  const handleCloseSidebars = () => {
    if (closeToggle) closeToggle(false);
  };
  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <Link to="/" className="flex px-5 gap-2 my-6 pt-1 w-190 items-center ">
          <img
            src={secondaryLogo}
            alt="logo"
            className="w-full"
            onClick={handleCloseSidebars}
          />
        </Link>
        <div className="flex flex-col gap-5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            onClick={handleCloseSidebars}
          >
            <AiOutlineHome />
            Home
          </NavLink>
          <h3 className="mt-2 px-5 text-lg ">Discover Categories</h3>
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              to={`/category/${category.name}`}
              className={({ isActive }) =>
                isActive ? isActiveStyles : isNotActiveStyles
              }
              onClick={handleCloseSidebars}
              key={category.name}
            >
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
      {user && (
        <Link
          to={`user-profile/${user._id}`}
          className="flex my-5 mb-3 p-2 gap-2 items-center mx-3 bg-white"
          onClick={handleCloseSidebars}
        >
          <img
            src={user.image}
            className="w-10 h-10 rounded-full"
            alt="user-profile"
          />
          <p>{user.userName}</p>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
