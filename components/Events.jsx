import {useState} from "react";



const Events = () => {
    const [eventFilter, setEventFilter] = useState('Today')
  return (
    <>
    <div className="flex justify-center">
      <div className="btn-group m-4">
        <button className={`btn btn-sm ${eventFilter === 'Previous' ? "btn-active" : "" }`}
        onClick={()=>{
            setEventFilter('Previous')
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
    </div>
    </>
  );
};

export default Events;
