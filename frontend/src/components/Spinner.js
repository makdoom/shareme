import React from "react";
import { Bars } from "react-loader-spinner";

const Spinner = ({ message }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full ">
      <Bars color="#7C3AED" height={50} width={50} className="mt-5" />
      <p className="text-base mt-2 text-center px-2">{message}</p>
    </div>
  );
};

export default Spinner;
