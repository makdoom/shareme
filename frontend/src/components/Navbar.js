import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { IoAddOutline } from "react-icons/io5";

const Navbar = ({ serachTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="flex gap-2 md:gap-5 w-full mt-5">
      <div className="flex justify-start items-center w-full px-2 rounded-md  border-none outline-none bg-white focus-within:shadow-sm">
        <AiOutlineSearch fontSize={20} className="ml-1" />
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          value={serachTerm}
          onFocus={() => navigate("/search")}
          className="w-full p-3 outline-none"
        />
      </div>
      <div className="flex gap-3 items-center">
        <Link
          to="create-pin"
          className="bg-primary text-white w-14 h-12  flex items-center justify-center rounded-md "
        >
          <IoAddOutline fontSize={30} />
        </Link>
        <Link to={`user-profile/${user?._id}`} className="hidden md:block">
          <img src={user.image} alt="user" className="w-14 h-13 rounded-full" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
