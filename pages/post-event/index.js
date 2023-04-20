import React, {useState} from "react";
import { ClubInfo } from "@/public/ClubInfo";
const index = () => {
    const [disableSignIn, setDisableLogin] = useState(true);
  return (
    <>
      <div
        className="hero min-h-screen"
        style={{ backgroundImage: `url("/jjk.jpg")` }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold bg-gradient-to-r from-[#7FCAF6]  via-[#B9DB64] to-[#E44691] bg-clip-text text-transparent">
              Hello there
            </h1>
            <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
              <div className="card-body">
                <div className="form-control">
                  <div className="alert m-2 alert-info shadow-lg">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="stroke-current flex-shrink-0 w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span>
                        Only select emails are allowed !!!
                      </span>
                    </div>
                  </div>
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your email"
                    className="input input-bordered"
                    onChange={(e)=>{
                        for(const club of ClubInfo){
                            if(club.ClubEmailID == e.target.value || club.ClubLeaderEmailId == e.target.value || club.SecondLeaderEmail == e.target.value){
                              setDisableLogin(false);
                            }
                          }
                    }}
                  />
                </div>
                <div className="form-control mt-6">
                  <button className={`btn btn-primary `} disabled={disableSignIn}
                  onClick={()=>{
                    console.log("allowed")
                  }}
                  >Sign In</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
