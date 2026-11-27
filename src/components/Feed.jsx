import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import CardStack from "./CardStack";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      //TODO: handle error
    }
  };

  useEffect(() => {
    getFeed();
  }, []);
  return (
    <>
      <div className="mx-auto mt-5 text-center">
        <Link to="/card-preview" className="link link-hover">Try sample cards</Link>
      </div>
      {feed?.length > 0 && <CardStack profiles={feed} />}
      {feed?.length === 0 && <h1 className="my-10 text-center">No new users found.</h1>}
    </>
  );
};
export default Feed;
