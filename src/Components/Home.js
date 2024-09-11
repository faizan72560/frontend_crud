import React, { useState } from "react";
import Card from "./Card";
import { useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [post, setPost] = useState([]);
  useEffect(() => {
    async function get() {
      const { data } = await axios.get("http://localhost:5000/api/v1/items");
      setPost(data.post);
    }
    get();
  }, []);
  return (
    <div
      style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
    >
      {post &&
        post.map((elem) => {
          return (
            <div key={elem._id}>
              <Card postData={elem} />
            </div>
          );
        })}
    </div>
  );
};

export default Home;
