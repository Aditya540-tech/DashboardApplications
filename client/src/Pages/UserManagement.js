import React, { useRef, useState } from "react";
import Menubar from "../Components/Menubar";
import MenuToggle from "../Components/MenuToggle";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserManagement = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleAddUser = async () => {
    try {
      const { data } = await axios.post("http://localhost:8080/api/addUser", {
        name,
        email,
        role,
      });
      if (data.success) {
        navigate("/role-management");
      } else {
        console.log("Error in Adding user");
      }
    } catch (error) {
      console.log("Error in Adding User");
    }
  };
  return (
    <div className="flex">
      <div
        className={`w-1/4 h-auto h-screen bg-gray-200 text-gray-500 ${
          showMenu ? "" : "hidden"
        } lg:block`}
      >
        <Menubar />
      </div>
      <div className="w-3/4 h-screen">
        <Navbar pagename={"User Management"} />
        <MenuToggle showMenu={showMenu} handleMenuToggle={handleMenuToggle} />
        <p className="text-center font-bold text-2xl my-5"> ADD USER</p>

        <form
          className="w-5/12 flex- m-auto"
          onSubmit={(e) => {
            e.preventDefault();
            e.target.reset();
          }}
        >
          <input
            className="px-10 py-3 mx-2 my-3 border border-black rounded-lg"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter User Name"
            required
          />
          <input
            className="px-10 py-3 mx-2 my-3  border border-black rounded-lg"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter User Email"
            required
          />
          <input
            className="px-10 py-3 mx-2 my-3  border border-black rounded-lg"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Enter User Role"
            required
          />
          <div>
            <button
              className="text-white bg-blue-500 px-6 py-3 rounded-md m-2"
              onClick={handleAddUser}
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;
