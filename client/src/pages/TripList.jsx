import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const TripList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user?._id); // Safe access
  const tripList = useSelector((state) => state.user?.tripList || []); // Default to empty array
  const dispatch = useDispatch();

  const getTripList = async () => {
    if (!userId) return; // Safeguard API call
    try {
      const response = await fetch(
        `https://dream-nest-n68v.onrender.com/users/${userId}/trips`,
        { method: "GET" }
      );
      const data = await response.json();
      dispatch(setTripList(data));
    } catch (err) {
      console.error("Fetch Trip List failed!", err.message);
      dispatch(setTripList([])); // Set empty trip list on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTripList();
  }, [userId]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Trip List</h1>
      <div className="list">
        {tripList.length > 0 ? (
          tripList.map(({ listingId, hostId, startDate, endDate, totalPrice, booking = true }) => (
            <ListingCard
              key={listingId?._id}
              listingId={listingId?._id}
              creator={hostId?._id}
              listingPhotoPaths={listingId?.listingPhotoPaths}
              city={listingId?.city}
              province={listingId?.province}
              country={listingId?.country}
              category={listingId?.category}
              startDate={startDate}
              endDate={endDate}
              totalPrice={totalPrice}
              booking={booking}
            />
          ))
        ) : (
          <p>No trips found!</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default TripList;
