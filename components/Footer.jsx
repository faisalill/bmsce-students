import React from "react";
import { GiIciclesAura } from "react-icons/gi";
import { AiFillFacebook, AiFillInstagram, AiFillTwitterCircle } from "react-icons/ai";
const Footer = () => {
  return (
    <footer className="footer footer-center p-10 bg-primary text-primary-content">
      <div>
        <GiIciclesAura className="h-10 w-10 m-1 text-cyan-500" />
        <p className="font-bold">
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            IIC{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-indigo-500 to-cyan-500">
              5.0
            </span>
          </span>{" "}
          <br />{" "}
          <span className="bg-gradient-to-r from-teal-500 via-lime-500 to-red-500 bg-clip-text text-transparent">
            BMSCE
          </span>{" "}
          Institution Innovation Cell
        </p>
        <p>Pirated © 2023 - 🔥 🚀 🔥 </p>
      </div>
      <div>
        <div className="grid grid-flow-col gap-4">
          <div className="tooltip" data-tip="Instagram">
            <a target="_blank" href="https://www.instagram.com/iic_bmsce/?hl=en">
          <AiFillInstagram className="text-[40px] text-pink-500 " />
            </a>
          </div>
          <div className="tooltip" data-tip="Facebook">
          <a target="_blank" href="https://www.facebook.com/bmsceiic/">
          <AiFillFacebook className="text-[40px] text-cyan-500 " />
            </a>
          </div>
          <div className="tooltip" data-tip="Twitter">
          <a target="_blank" href="https://twitter.com/bmsceiic?lang=en">
          <AiFillTwitterCircle className="text-[40px] text-blue-500 " />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
