import React, {useEffect, useState} from 'react'
import {
  collection,
  getFirestore,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import {getStorage, ref, deleteObject} from 'firebase/storage'
import { useCollection } from "react-firebase-hooks/firestore";
import { initializeApp } from "firebase/app";
import dayjs from "dayjs";
export function getServerSideProps () {
  const data = {
   apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket : process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId  
  }
  return {
    props: {
      data
    }
  }
}

var itemData = [];

const index = ({data}) => {
  const app = initializeApp(data);
const storage = getStorage(app);
const db = getFirestore(app);

  const [eventFilter, setEventFilter] = useState('Today')
  const [EventList, setEventList] = useState([]);
  const collectionRef = collection(db, "events");
  const [value, loading] = useCollection(collectionRef);

  useEffect(() => {
    if (value) {
      var temp = [];
      value.docs.forEach((doc) => {
        temp.push(doc.data());
      });
      itemData = temp;
      setEventList(
        itemData.filter((item) => {
          return (
            dayjs(item.EventDate, "DD:MM:YYYY").format("DD:MM:YYYY") ===
            dayjs().format("DD:MM:YYYY")
          );
        })
      );
    }
  }, [value]);
  return (
<>
<div className="flex justify-center">
      <div className="btn-group m-4">
        <button className={`btn btn-sm ${eventFilter === 'Previous' ? "btn-active" : "" }`}
        onClick={()=>{
            setEventFilter('Previous')
            setEventList(
                itemData.filter((item) => {
                  return (
                    dayjs(item.EventDate, "DD:MM:YYYY").format("DD:MM:YYYY") <
                    dayjs().format("DD:MM:YYYY")
                  );
                }
                )
              );
        }}
        >Previous</button>
        <button className={`btn btn-sm ${eventFilter === 'Today' ? "btn-active" : "" }`}
        onClick={()=>{
            setEventFilter('Today')
        }
        }
        >Today</button>
        <button className={`btn btn-sm ${eventFilter === 'Upcoming' ? "btn-active" : "" }`}
        onClick={()=>{
            setEventFilter('Upcoming')
        }}
        >Upcoming</button>
      </div>
      <div>
       <button
       className='btn btn-sm'
       onClick={()=>{
        console.log(itemData)
       }}
       >check</button>
      </div>
    </div>
</>
    )
}

export default index