import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user, onDecision }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const decide = onDecision ?? handleSendRequest;

  return (
    <div className="card bg-base-300 w-96 max-w-full shadow-xl">
      <figure>
        {photoUrl ? (
          <img src={photoUrl} alt="photo" />
        ) : (
          <div aria-hidden="true" className="grid h-48 w-full place-items-center bg-primary/15 text-5xl font-semibold">
            {firstName?.[0]}{lastName?.[0]}
          </div>
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        {age && gender && <p>{age + ", " + gender}</p>}
        <p>{about}</p>
        <div className="card-actions justify-center my-4">
          <button
            className="btn btn-primary"
            onClick={() => decide("Ignored", _id)}
          >
            Ignore
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => decide("Interested", _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};
export default UserCard;
