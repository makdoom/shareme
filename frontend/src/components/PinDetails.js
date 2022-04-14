import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "./Spinner";
import { client } from "../client";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";

const PinDetails = () => {
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

  useEffect(() => {
    fetchPinsDetails();
  }, [pinId]);

  if (!pinDetail) return <Spinner message="Loading pins..." />;

  return <div>PinDetails</div>;
};

export default PinDetails;
