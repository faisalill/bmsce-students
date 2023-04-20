import React, {useState} from 'react'
import { BsFillPersonFill } from 'react-icons/bs';

const SignIn = () => {
    const [doNotAllowSignIn, setDoNotAllowSignIn] = useState(true)
    const [email, setEmail] = useState('')
    const [emaiInputLoading, setemaiInputLoading] = useState(false)
  return (
    <>
     {/* The button to open modal */}
     <label htmlFor="my-modal-3" className="btn btn-circle">
          <div className="indicator">
            <BsFillPersonFill className="scale-[1.7]" />
          </div>
        </label>

        {/* Put this part before </body> tag */}
        <input type="checkbox" id="my-modal-3" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box relative">
            <label
              htmlFor="my-modal-3"
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </label>
            <div className="flex flex-col items-center">
              <h1 className="text-2xl text-center font-bold">Sign In</h1>
              <div className="m-3 alert alert-warning shadow-lg">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current flex-shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>Only Select Club Emails are allowed to login and post events. Enter your email to check whether you are allowed to login or not.</span>
                </div>
              </div>
             <div className="flex flex-row  items-center">
             <input 
             type="email"
             value={email}
             onChange={(e)=>{
              setEmail(e.target.value)
              console.log("Email: ", e.target.value);
          }}
             ></input>
             <button 
             onClick={()=>{
              console.log("Email: ", email)
             }}
             disabled={!doNotAllowSignIn} >Sign In</button>
             </div>
            </div>
          </div>
        </div> 
    </>
  )
}

export default SignIn