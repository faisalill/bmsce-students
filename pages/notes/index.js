import React from "react";
import dayjs from "dayjs";
const Home = () => {
  return (
    <>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: `url("/isagi.jpg")`,
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Coming Soon...</h1>
            <p className="mb-5">
            Notes || Completed Assignments || Records
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
