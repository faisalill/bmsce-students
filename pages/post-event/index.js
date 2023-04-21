import React, { useEffect, useState } from "react";
import { ClubInfo } from "@/public/ClubInfo";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  useAuthState,
  useSignInWithGoogle,
  useSignOut,
} from "react-firebase-hooks/auth";
export async function getServerSideProps() {
  // Fetch data from external API
  const data = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId,
  };

  // Pass data to the page via props
  return { props: { data } };
}



const index = ({ data }) => {
  const firebaseApp = initializeApp(data);
  const auth = getAuth(firebaseApp);
  const [user, loading, error] = useAuthState(auth);
  const [disableSignIn, setDisableLogin] = useState(true);
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const [signOut] = useSignOut(auth);
  const [showNotification, setshowNotification] = useState(false);
  const [notficationType, setnotficationType] = useState("alert-error")
  const [notificationInfo, setnotificationInfo] = useState("Checking Message")
  function notificationMessage ({type, message}){
    setnotficationType(type)
    setnotificationInfo(message)
    setshowNotification(true)
    setTimeout(() => {
      setshowNotification(false)
    }, 4000);
  }
  return (
    <>
      <div
        className="hero min-h-screen"
        style={{ backgroundImage: `url("/jjk.jpg")` }}
      >
        <div className= {`${showNotification ? "" : "hidden"} notification  alert ${notficationType} shadow-lg z-50 absolute top-20`}>
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
            <span>{notificationInfo}</span>
          </div>
        </div>
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
                      <span>Only select emails are allowed !!!</span>
                    </div>
                  </div>
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your email"
                    className="input input-bordered"
                    onChange={(e) => {
                      for (const club of ClubInfo) {
                        if (
                          club.ClubEmailID == e.target.value ||
                          club.ClubLeaderEmailId == e.target.value ||
                          club.SecondLeaderEmail == e.target.value
                        ) {
                          setDisableLogin(false);
                        }
                      }
                    }}
                  />
                </div>
                <div className="form-control mt-6">
                  <button
                    className={`btn btn-primary `}
                    disabled={disableSignIn}
                    onClick={() => {
                      signInWithGoogle().then((res) => {
                        if (res) {
                          for (const clubs of ClubInfo) {
                            if (
                              clubs.ClubEmailID == res.user.email ||
                              clubs.ClubLeaderEmailId == res.user.email ||
                              clubs.SecondLeaderEmail == res.user.email
                            ) {
                              notificationMessage({type: "alert-success", message: "Login Successfull"})
                              return;
                            }
                          }
                          for (const clubs of ClubInfo) {
                            if (
                              clubs.ClubEmailID !== res.user.email ||
                              clubs.ClubLeaderEmailId !== res.user.email ||
                              clubs.SecondLeaderEmail !== res.user.email
                            ) {
                              notificationMessage({type: "alert-error", message: "Email Not ALlowed"})
                              signOut();
                              return;
                            }
                          }
                        }
                      });
                    }}
                  >
                    Sign In
                  </button>
                  {/* <button
                    className={`btn btn-primary `}
                    onClick={() => {
                      notificationMessage({type: "alert-error", message: "Checking Message"})
                    }}
                  >
                    Check
                  </button>
                  <button
                    className={`btn btn-primary `}
                    onClick={() => {
                      signOut();
                    }}
                  >
                    Sign Out
                  </button> */}
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
