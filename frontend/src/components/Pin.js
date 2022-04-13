import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { client, urlFor } from "../client";
import { FiDownload } from "react-icons/fi";
import { fetchUser } from "../utils/fetchUser";
import { v4 as uuidv4 } from "uuid";
import { AiOutlineLink, AiOutlineDelete, AiOutlineUser } from "react-icons/ai";

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  const navigate = useNavigate();
  const user = fetchUser();

  const alreadySaved = !!save?.filter(
    (item) => item.postedBy._id === user?.googleId
  )?.length;

  console.log(postedBy);
  const savePin = (id) => {
    console.log("saving");
    if (!alreadySaved) {
      setSavingPost(true);
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user.googleId,
            postedBy: {
              _type: "postedBy",
              _ref: user.googleId,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
          setSavingPost(false);
        });
    }
  };

  const deletePin = (id) => {
    client.delete(id).then(() => window.location.reload());
  };
  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img
          src={urlFor(image).width(250).url()}
          alt="user-post"
          className="rounded-lg w-full"
        />
        {postHovered && (
          <div
            className="absolute top-0 left-0 w-full h-full flex flex-col justify-between p-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-8 h-8 text-dark flex items-center justify-center rounded-full text-xl opacity-75 hover:opacity-100 hover:shadow-md transition-all duration-75 ease-in-out outline-none"
                >
                  <FiDownload />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-primary opacity-70 hover:opacity-100 text-white font-semibold px-3 py-2 text-sm rounded-3xl hover:shadow-md outline-none flex items-center justify-between gap-2"
                >
                  <AiOutlineUser />
                  {save?.length} Saved
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  className="bg-primary opacity-70 hover:opacity-100 text-white font-semibold px-5 py-2 text-sm rounded-3xl hover:shadow-md outline-none"
                >
                  {savingPost ? "Saving.." : "Save"}
                </button>
              )}
            </div>
            <div className="flex justify-between items-center w-full gap-2">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreffer"
                  className="bg-white flex items-center gap-2 text-black font-semibold px-3 py-2 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                >
                  <AiOutlineLink />
                  {destination.length > 20
                    ? destination.slice(8, 20)
                    : destination.slice(8)}
                </a>
              )}
              {postedBy?._id === user.googleId && (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-semibold px-5 py-2 text-sm rounded-3xl hover:shadow-md outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                >
                  <AiOutlineDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`user-profile/${postedBy?._id}`}
        className="flex gap-2 items-center mt-2"
      >
        <img
          src={postedBy?.image}
          className="h-8 w-8 rounded-full object-cover"
          alt="user-profile"
        />
        <p className="font-semibold capitalize text-sm">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
