import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ClubInfo } from "@/public/ClubInfo";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import {
  useAuthState,
  useSignInWithGoogle,
  useSignOut,
} from "react-firebase-hooks/auth";
import {message, Image, TimePicker, ConfigProvider, theme, DatePicker, Popconfirm } from "antd";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {doc, setDoc, getFirestore} from 'firebase/firestore'
import {uuidv4} from '@firebase/util'


export async function getServerSideProps() {
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

const schema = Yup.object().shape({
  EventName: Yup.string().required("Required"),
  EventDescription: Yup.string().required("Required"),
  EventVenue: Yup.string().required("Required"),
  Contact1: Yup.number()
    .min(1000000000, "Number is not 10 characters")
    .required("Required"),
  Contact2: Yup.number()
    .min(1000000000, "Number is not 10 characters")
    .required("Required"),
  EventRegistrationLink: Yup.string()
    .url("Enter a valid URL")
    .required("Required"),
});

let EventDetails = {};

const Home = ({ data }) => {
  const router = useRouter();
  const firebaseApp = initializeApp(data);
  const auth = getAuth(firebaseApp);
  const storage = getStorage(firebaseApp);
  const db = getFirestore(firebaseApp);
  const docRef = doc(db, "events", uuidv4());



  const [user, loading, error] = useAuthState(auth);
  const [disableSignIn, setDisableLogin] = useState(true);
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const [signOut] = useSignOut(auth);
  const [showNotification, setshowNotification] = useState(false);
  const [notficationType, setnotficationType] = useState("alert-error");
  const [notificationInfo, setnotificationInfo] = useState("Checking Message");
  const [UploadImage, setUploadImage] = useState(null);
  const [showPoster, setshowPoster] = useState(false);
  const [EventDate, setEventDate] = useState(null);
  const [EventTime, setEventTime] = useState(
    dayjs("12:00:am", "h:mm:a").format("h:mm a")
  );
  const [messageApi, contextHolder] = message.useMessage()
  const firstEventTime = dayjs("12:00:am", "h:mm:a");
  const { darkAlgorithm } = theme;

  function notificationMessage({ type, message }) {
    setnotficationType(type);
    setnotificationInfo(message);
    setshowNotification(true);
    setTimeout(() => {
      setshowNotification(false);
    }, 4000);
  }
  const formik = useFormik({
    initialValues: {
      EventName: "",
      EventDescription: "",
      EventVenue: "",
      Contact1: "",
      Contact2: "",
      EventRegistrationLink: "",
    },
    onSubmit: formikSubmit,
    validationSchema: schema,
  });
  function formikSubmit(e) {
      handleUpload(e)
      formik.resetForm();
      setUploadImage(null);
      setEventDate(null);
      setEventTime(dayjs("12:00:am", "h:mm:a").format("h:mm a"))
  }
  function handleUpload(e) {
    if (UploadImage === null) {
      alert("Please upload an image");
    } else {
      const imageId = uuidv4()
      const storageRef = ref(storage, `images/${imageId}`);
      const uploadTask = uploadBytesResumable(storageRef, UploadImage);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          ); // update progress
          messageApi.open({
            content: `Uploading `,
            key: "uploading",
            duration: 0,
            type: 'loading',
          })
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            EventDetails = {
              ...formik.values,
              EventDate: EventDate,
              EventTime: EventTime,
              UploadImage: url,
              imageId: imageId,
              postingEmail: user.email,
            };
            setDoc(docRef, EventDetails).then(()=>{
            messageApi.destroy("uploading")
            messageApi.success("Event Posted Successfully")
            router.push("/")
            formik.resetForm();
            setUploadImage(null);
            })
            .catch((err) => 
            {
              console.log(err)
            }
            );
          });
        }
      );
    }
  }
  return (
    <>
    <div
    className="btn"
    onClick={() => {
     
    }}
    >
      Check
    </div>
    {contextHolder}
    <ConfigProvider
                      theme={{
                        algorithm: darkAlgorithm,
                      }}
                    >
      <div
        className={`hero min-h-screen`}
        style={{ backgroundImage: `url("/jjk.jpg")` }}
      >
        <div className="hero-overlay bg-opacity-60"></div>

        {user ? (
          <div>
            <div className="hero-content flex-col ">
              <div className="text-center m-4 lg:text-left">
                <h1 className="text-5xl font-bold">Post Event</h1>
              </div>
              <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                <div className="card-body ">
                  <div className="form-control ">
                    <label className="label ">
                      <span className="label-text">Event Name</span>
                      <span className="label-text text-error">
                        {formik.errors.EventName}
                      </span>
                    </label>
                    <input
                      name="EventName"
                      value={formik.EventName}
                      onChange={formik.handleChange}
                      type="text"
                      placeholder="Enter Event name..."
                      className="input input-bordered"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Event Description</span>
                      <span className="label-text text-error">
                        {formik.errors.EventDescription}
                      </span>
                    </label>
                    <textarea
                      name="EventDescription"
                      value={formik.EventDescription}
                      onChange={formik.handleChange}
                      className="textarea textarea-bordered"
                      placeholder="Enter Event Description..."
                    ></textarea>
                  </div>
                  {UploadImage ? (
                    <Image
                      src={URL.createObjectURL(UploadImage)}
                      alt="image"
                      className="m-1"
                    />
                  ) : null}
                  <div className="form-control ">
                    <label className="label">
                      <span className="label-text">Poster</span>
                    </label>
                    <div className="flex flex-row items-center gap-1">
                      <input
                        onChange={(e) => {
                          setUploadImage(e.target.files[0]);
                        }}
                        type="file"
                        className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                      />
                      <button
                        className="btn btn-sm btn-circle"
                        onClick={() => {
                          setUploadImage(null);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Time</span>
                    </label>
                    <ConfigProvider
                      theme={{
                        algorithm: darkAlgorithm,
                      }}
                    >
                      <TimePicker
                        className="mt-2 mb-4  border-gray-500 "
                        onChange={(e) => {
                          setEventTime(dayjs(e).format("h:mm:a"));
                        }}
                        defaultValue={firstEventTime}
                        format="h:mm:a"
                      />
                    </ConfigProvider>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Date</span>
                    </label>
                    <ConfigProvider theme={{ algorithm: darkAlgorithm }}>
                    <DatePicker
                      className="mt-2 mb-4"
                      format="DD/MM/YYYY"
                      onChange={(e) => {
                        setEventDate(dayjs(e).format("DD/MM/YYYY"));
                      }}
                    />
                    </ConfigProvider>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Venue</span>
                      <span className="label-text text-error">
                        {formik.errors.EventVenue}
                      </span>
                    </label>
                    <input
                      name="EventVenue"
                      value={formik.EventVenue}
                      type="text"
                      onChange={formik.handleChange}
                      placeholder="Enter the Venue..."
                      className="input input-bordered"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Contact 1</span>
                      <span className="label-text text-error">
                        {formik.errors.Contact1}
                      </span>
                    </label>
                    <input
                      name="Contact1"
                      value={formik.Contact1}
                      type="text"
                      placeholder="Enter Contact 1..."
                      onChange={formik.handleChange}
                      className="input input-bordered"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Contact 2</span>
                      <span className="label-text text-error">
                        {formik.errors.Contact2}
                      </span>
                    </label>
                    <input
                      name="Contact2"
                      value={formik.Contact2}
                      type="text"
                      placeholder="Enter Contact 2..."
                      onChange={formik.handleChange}
                      className="input input-bordered"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Registration Link</span>
                      <span className="label-text text-error">
                        {formik.errors.EventRegistrationLink}
                      </span>
                    </label>
                    <input
                      name="EventRegistrationLink"
                      onChange={formik.handleChange}
                      value={formik.EventRegistrationLink}
                      type="text"
                      placeholder="Enter Registration Link..."
                      className="input input-bordered"
                    />
                  </div>
                  <div className="form-control mt-6">
                  <Popconfirm
              title="Are you sure to upload this event?"
              description="Make sure all the details are correct."
              onConfirm={formikSubmit}
              key="popconfirm"
            >
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                      }}
                    >
                      Post
                    </button>
                    </Popconfirm>
                    <button
                      className="btn my-4 btn-primary"
                      onClick={() => {
                        signOut();
                        messageApi.success("Logged Out Successfully");
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
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
                        signInWithGoogle().then((res)=>{
                          if(res){
                            for(const clubs of ClubInfo){
                              if(clubs.ClubEmailID == res.user.email || clubs.ClubLeaderEmailId == res.user.email || clubs.SecondLeaderEmail == res.user.email){
                                messageApi.success('Logged In Successfully');
                                return;
                              }
                           }
                           for(const clubs of ClubInfo){
                            if(clubs.ClubEmailID !== res.user.email || clubs.ClubLeaderEmailId !== res.user.email || clubs.SecondLeaderEmail !== res.user.email){
                              messageApi.error('This Email is not allowed to login');
                              signOut();
                              return;
                            }
                          }
                          }
                          })
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
        )}
      </div>
      </ConfigProvider>
    </>
  );
};

export default Home;
