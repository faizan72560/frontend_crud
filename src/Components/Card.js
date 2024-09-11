import React from "react";

const Card = ({ postData }) => {
  return (
    <div className="card">
      <img
        src={postData.imageUrl}
        style={{ height: "300px", width: "250px" }}
      ></img>
      <h3>{postData.title}</h3>
      <p>{postData.description}</p>
    </div>
  );
};

export default Card;
