import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Spinner from "./Spinner";
import { client, urlFor } from "../client";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import { FiDownload } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
import MasonaryLayout from "./MasonryLayout";

const PinDetails = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams();

  const fetchPinsDetails = () => {
    const query = pinDetailQuery(pinId);
    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);

        if (data[0]) {
          let query = pinDetailMorePinQuery(data[0]);
          client.fetch(query).then((response) => setPins(response));
        }
      });
    }
  };

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          fetchPinsDetails();
          setComment("");
          setAddingComment(false);
        });
    }
  };

  useEffect(() => {
    fetchPinsDetails();
  }, [pinId]);

  if (!pinDetail) return <Spinner message="Loading pins..." />;

  return (
    <>
      <div
        className="flex xl:flex-row flex-col m-auto bg-white"
        style={{ maxWidth: "1600px", borderRadius: "32px" }}
      >
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetail?.image && urlFor(pinDetail.image).url()}
            alt="user-post"
            className="rounded-t-3xl rounded-b-lg w-full sm:w-full lg:max-w-[450px]"
          />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail.image.asset.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-8 h-8 text-dark flex items-center justify-center rounded-full text-xl opacity-75 hover:opacity-100 hover:shadow-md transition-all duration-75 ease-in-out outline-none"
              >
                <FiDownload />
              </a>
            </div>
            <a href={pinDetail.destination} target="_blank" rel="noreferrer">
              {pinDetail.destination}
            </a>
          </div>

          <div>
            <h1 className="text-4xl font-bold break-words mt-3">
              {pinDetail.title}
            </h1>
            <p className="mt-3">{pinDetail.about}</p>
          </div>
          <Link
            to={`user-profile/${pinDetail.postedBy?._id}`}
            className="flex gap-2 items-center mt-5 bg-white rounded-lg"
          >
            <img
              src={pinDetail.postedBy?.image}
              className="h-8 w-8 rounded-full object-cover"
              alt="user-profile"
            />
            <p className="font-semibold capitalize text-sm">
              {pinDetail.postedBy?.userName}
            </p>
          </Link>
          <h2 className="mt-5 text-2xl">Comments</h2>
          <div className="max-h-370 overflow-y-auto">
            {pinDetail?.comments?.map((comment, index) => (
              <div
                className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                key={index}
              >
                <img
                  src={comment.postedBy.image}
                  alt="user-profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{comment.postedBy.userName}</p>
                  <p className="">{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center flex-wrap mt-6 gap-3">
            <Link to={`user-profile/${pinDetail.postedBy?._id}`}>
              <img
                src={pinDetail.postedBy?.image}
                className="h-10 w-10 rounded-full cursor-pointer"
                alt="user-profile"
              />
            </Link>
            <input
              type="text"
              className="flex-1 border-gray-100 outline-none border-2 p-2 px-3  rounded-2xl focus:border-gray-200"
              placeholder="Add a Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="button"
              className="bg-primary text-white rounded-full px-5 py-2 font-semibold text-base outline-none"
              onClick={addComment}
            >
              {addingComment ? "Posting..." : "Posted"}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-5">
        {pins?.length > 0 ? (
          <>
            <h2 className="text-center font-bold text-2xl mt-8 mb-4 ">
              More like this
            </h2>
            {console.log(pins)}
            <MasonaryLayout pins={pins} />
          </>
        ) : (
          <Spinner message="Loading more pins..." />
        )}
      </div>
    </>
  );
};

export default PinDetails;
