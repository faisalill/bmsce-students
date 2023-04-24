import React, { useEffect, useState } from "react";
import {
  collection,
  getFirestore,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { useCollection } from "react-firebase-hooks/firestore";
import { initializeApp } from "firebase/app";
import dayjs from "dayjs";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  ConfigProvider,
  theme,
  Badge,
  Button,
  Card,
  Empty,
  Image,
  Popover,
  QRCode,
  Typography,
  message,
} from "antd";
import { ImQrcode } from "react-icons/im";
export function getServerSideProps() {
  const data = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId,
  };
  return {
    props: {
      data,
    },
  };
}

var itemData = [];

const Home = ({ data }) => {
  const eventDate = "13/03/2023";
  const app = initializeApp(data);
  const storage = getStorage(app);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const [user] = useAuthState(auth);
  const [messageApi, contextHolder] = message.useMessage();
  const [eventFilter, setEventFilter] = useState("Today");
  const [EventList, setEventList] = useState([]);
  const collectionRef = collection(db, "events");
  const [value, loading] = useCollection(collectionRef);
  const { Text } = Typography;
  const { darkAlgorithm } = theme;
  useEffect(() => {
    if (value) {
      var temp = [];
      value.docs.forEach((doc) => {
        temp.push(doc.data());
      });
      itemData = temp;
      setEventList(
        itemData.filter((item) => {
          const dateString = item.EventDate;
          const [day, month, year] = dateString.split("/");
          const isoDateString = `${year}-${month}-${day}`;
          return (
            dayjs().format("YYYY-MM-DD") === dayjs(isoDateString, "YYYY-MM-DD").format("YYYY-MM-DD")
          );
        })
      );
    }
  }, [value]);
  return (
    <>
    {/* <div
    className="btn"
    onClick={()=>{
      // for testing
    }}
    >
     Check
    </div> */}
      <ConfigProvider
        theme={{
          algorithm: darkAlgorithm,
        }}
      >
        {contextHolder}
        <div className="btn-group flex justify-center m-4">
          <button
            className={`btn btn-sm ${
              eventFilter === "Previous" ? "btn-active" : ""
            }`}
            onClick={() => {
              setEventFilter("Previous");
              setEventList(
                itemData.filter((item) => {
                  const dateString = item.EventDate;
                  const [day, month, year] = dateString.split("/");
                  const isoDateString = `${year}-${month}-${day}`;
                  
                  return (
                    dayjs().format("YYYY-MM-DD") > dayjs(isoDateString, "YYYY-MM-DD").format("YYYY-MM-DD")
                  );
                })
              );
            }}
          >
            Previous
          </button>
          <button
            className={`btn btn-sm ${
              eventFilter === "Today" ? "btn-active" : ""
            }`}
            onClick={() => {
              setEventFilter("Today");
              setEventList(
                itemData.filter((item) => {
                  const dateString = item.EventDate;
                  const [day, month, year] = dateString.split("/");
                  const isoDateString = `${year}-${month}-${day}`;
                  return (
                    dayjs().format("YYYY-MM-DD") === dayjs(isoDateString, "YYYY-MM-DD").format("YYYY-MM-DD")
                  );
                })
              );
            }}
          >
            Today
          </button>
          <button
            className={`btn btn-sm ${
              eventFilter === "Upcoming" ? "btn-active" : ""
            }`}
            onClick={() => {
              setEventFilter("Upcoming");
              setEventList(
                itemData.filter((item) => {
                  const dateString = item.EventDate;
                  const [day, month, year] = dateString.split("/");
                  const isoDateString = `${year}-${month}-${day}`;
                  return (
                    dayjs().format("YYYY-MM-DD") < dayjs(isoDateString, "YYYY-MM-DD").format("YYYY-MM-DD")
                  );
                })
              );
            }}
          >
            Upcoming
          </button>
        </div>
        {loading ? (
          <div className=" flex justify-center items-center h-60">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center h-full">
            {value && EventList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
                {EventList.map((item) => {
                  const dateString = item.EventDate;
                  const [day, month, year] = dateString.split("/");
                  const isoDateString = `${year}-${month}-${day}`;
                  return (
                    <div key={Math.random()} className="m-4 inline-block ">
                      <Badge.Ribbon
                        text={`${dayjs(isoDateString, "YYYY/MM/DD").format("dddd")} ${item.EventTime} `}
                        color="darkcyan"
                      >
                        <Card
                          style={{ width: 300 }}
                          cover={
                            <Image
                              className="w-full h-full"
                              src={item.UploadImage}
                            />
                          }
                          actions={[
                            <div
                              key="QRCode"
                              className="flex justify-center align-middle "
                            >
                              <Popover
                                content={
                                  <QRCode value={item.EventRegistrationLink} />
                                }
                              >
                                <ImQrcode className="relative top-2" />
                              </Popover>{" "}
                            </div>,
                            <div key="Apply">
                              <Button
                                href={item.EventRegistrationLink}
                                target="_blank"
                                type="link"
                              >
                                Apply
                              </Button>
                            </div>,
                            <div key="Delete">
                              <Button
                                type="link"
                                disabled={
                                  user && user.email === item.postingEmail
                                    ? false
                                    : true
                                }
                                onClick={() => {
                                  messageApi.loading({
                                    content: "Deleting",
                                    key: "delete",
                                    type: "loading",
                                    duration: 0,
                                  });
                                  const q = query(
                                    collectionRef,
                                    where("imageId", "==", item.imageId)
                                  );
                                  getDocs(q).then((doc) => {
                                    if (doc) {
                                      doc.docs.map((doc) =>
                                        deleteDoc(doc.ref).then(() => {
                                          deleteObject(
                                            ref(
                                              storage,
                                              `images/${item.imageId}`
                                            )
                                          ).then(() => {
                                            messageApi.destroy("delete");
                                            messageApi.success("Deleted");
                                          });
                                        })
                                      );
                                    }
                                  });
                                }}
                                danger={true}
                              >
                                Delete
                              </Button>
                            </div>,
                          ]}
                        >
                          <div className="flex flex-col">
                            <Text className="text-xl  text-center  font-bold">
                              {item.EventName}
                            </Text>
                            <Text className=" text-left mb-1 mt-1  ">
                              {item.EventDescription &&
                                item.EventDescription.split("\n").map(
                                  (line, i) => (
                                    <div key={i}>
                                      {line}
                                      <br />
                                    </div>
                                  )
                                )}
                            </Text>
                            <Text className="font-bold">
                              Venue:{" "}
                              <span className="font-normal">
                                {item.EventVenue}
                              </span>{" "}
                            </Text>
                            <Text className="font-bold">
                              Date:{" "}
                              <span className="font-normal">
                                {item.EventDate}
                              </span>
                            </Text>
                            <Text
                              copyable={{
                                text: item.Contact1,
                              }}
                            >
                              <span className="font-bold">Contact 1:</span>{" "}
                              {item.Contact1}
                            </Text>
                            <Text
                              copyable={{
                                text: item.Contact2,
                              }}
                            >
                              <span className="font-bold">Contact 2:</span>{" "}
                              {item.Contact2}
                            </Text>
                            {/* <Text 
                       copyable={{
                        text: item.EventRegistrationLink,
                      }}
                      >Link: {item.EventRegistrationLink}</Text> */}
                          </div>
                        </Card>
                      </Badge.Ribbon>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-60 justify-center ">
                <Empty
                  className="relative top-10"
                  description={<Text className="font-bold ">No Events</Text>}
                />
              </div>
            )}
          </div>
        )}
      </ConfigProvider>
    </>
  );
};

export default Home;
