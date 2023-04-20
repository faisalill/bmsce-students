import Link from "next/link";
import React from "react";
import { BsFillPersonFill } from "react-icons/bs";
const Navbar = () => {

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              {" "}
              <Link href="/">Events</Link>{" "}
            </li>
            <li>
              <Link href="/notes">Notes</Link>
            </li>
            <li>
              <Link href="/post-event">Post Event</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          <img
            src="/logos/logo11.png"
            alt="bmsce-logo"
            className="h-16 relative bottom-2"
          />
        </Link>
      </div>
      <div className="navbar-end">
        <Link href='/post-event'>
      <button className="btn-circle btn">
      <div className="indicator">
            <BsFillPersonFill className="scale-[1.7]" />
          </div>
        </button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
