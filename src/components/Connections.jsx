import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/conectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
      console.log(res.data.data);
    } catch (err) {
      // Handle Error Case
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;

  if (connections.length === 0) return <h1> No Connections Found</h1>;

  return (
    <div className="mx-auto my-10 w-full max-w-lg space-y-4 px-4 sm:w-fit">
      <h1 className="text-center text-3xl font-bold text-white">Connections</h1>

      {connections.map((connection) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } =
          connection;

        return (
          <article
            key={_id}
            className="grid max-w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 rounded-lg bg-base-300 p-4 sm:w-fit sm:items-center"
          >
            <img
              alt=""
              className="h-14 w-14 rounded-full object-cover sm:h-20 sm:w-20"
              src={photoUrl}
            />
            <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="min-w-0 max-w-full break-words">
                <h2 className="font-bold text-xl">
                  {firstName + " " + lastName}
                </h2>
                {age && gender && <p>{age + ", " + gender}</p>}
                <p>{about}</p>
              </div>
              <Link to={"/chat/" + _id} className="btn btn-primary shrink-0">
                Chat
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
};
export default Connections;
