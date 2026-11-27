import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";

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
  if (!feed) return;

  if (feed.length <= 0)
    return <h1 className="flex justify-center my-10">No new users founds!</h1>;

  return (
    <div className="px-8 pb-12 pt-16">
      <div className="relative isolate mx-auto w-full max-w-sm">
        {feed.slice(1, 3).map((profile, index) => (
          <div
            key={profile._id}
            aria-hidden="true"
            className={`card pointer-events-none absolute inset-0 max-h-[28rem] overflow-hidden border border-base-content/20 bg-base-200 shadow-md ${index === 0
              ? "-z-10 -translate-x-2 -translate-y-3 -rotate-3"
              : "-z-20 translate-x-2 -translate-y-5 rotate-3"}`}
          >
            {profile.photoUrl && (
              <img src={profile.photoUrl} alt="" className="h-2/3 w-full object-cover opacity-60" />
            )}
          </div>
        ))}
        <UserCard key={feed[0]._id} user={feed[0]} />
      </div>
    </div>
  );
};
export default Feed;
