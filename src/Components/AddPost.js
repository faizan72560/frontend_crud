

import React, { useEffect, useState } from 'react';
import axios from "axios"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Card from './Card';


function AddPostBox() {
    const [postContent, setPostContent] = useState({ title: "", description: "" });
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(false)
    const [posts, setPost] = useState([])
    const [updateId, setUpdateId] = useState('')

    useEffect(() => {
        async function get() {
            const { data } = await axios.get("http://localhost:5000/api/v1/items")
            setPost(data.post)
        }
        get()


    }, [])

    const handleSubmit = async (e) => {
        try {
            setError(false)
            e.preventDefault();
            if (postContent.title == "" || postContent.description == "" || imagePreview == null) {
                setError(true)
                return
            }
            let post = { ...postContent, image: imagePreview }
            if (updateId) {
                post = { ...postContent, image: imagePreview, _id: updateId }
                const { data } = await axios.put(`http://localhost:5000/api/v1/items/${updateId}`, post)
                if (data.success) {
                    toast.success(data.message);
                }

                const updatedPosts = posts.map(elem => {
                    if (elem._id === updateId) {
                        return post;
                    }
                    return elem;
                });
                setPost(updatedPosts)
                setPostContent({ title: "", description: "" });
                setImagePreview(null)
                setUpdateId("")
                return
            }
            const { data } = await axios.post("http://localhost:5000/api/v1/items", post)
            setPost([data.post, ...posts])
            if (data.success) {
                toast.success(data.message);
            }
            setPostContent({ title: "", description: "" });
            setImagePreview(null)
        }
        catch (err) {
            console.error(err)
            toast.error("something went wrong")
        }

    };
    const imageHandler = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setImagePreview(reader.result);
            }
        }
        reader.readAsDataURL(e.target.files[0])
    };

    async function deleteHandler(id) {
        try {
            const { data } = await axios.delete(`http://localhost:5000/api/v1/items/${id}`)
            if (data.success) {
                toast.success(data.message);
            }
            let postData = posts.filter((elem) => {
                return elem._id != id
            })
            setPost(postData)
        } catch (err) {
            console.error(err)
            toast.error("something went wrong")
        }

    }

    async function updateHandler(post) {
        try {
            window.scroll(0, 0);
            setPostContent({ title: post.title, description: post.description })
            setImagePreview(post.imageUrl)
            setUpdateId(post._id)
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    }


    return (
        <>
            <div className="add-post-box">
                <ToastContainer />
                <h3>Add a New Post</h3>
                <form onSubmit={handleSubmit}>
                    <input type='text' onChange={(e) => { setPostContent({ ...postContent, title: e.target.value }) }} value={postContent.title} placeholder='Add title'></input>
                    {error && postContent.title == "" && <div style={{ color: "red" }}> title is required</div>}
                    <textarea
                        value={postContent.description}
                        onChange={(e) => { setPostContent({ ...postContent, description: e.target.value }) }}
                        placeholder="Add description"
                    ></textarea>
                    {error && postContent.description == "" && <div style={{ color: "red" }}> description is required</div>}

                    <div style={{ display: "flex", justifyContent: "center" }}>
                        {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: "200px" }} />}
                    </div>
                    <input type='file' accept="image/*" onChange={imageHandler} />
                    {error && imagePreview == null && <div style={{ color: "red" }}> image is required</div>}

                    {updateId ? <button type="submit">Update Post</button> : <button type="submit">Add Post</button>}
                </form>

            </div>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                {posts && posts.map((elem) => {
                    return (
                        <div className="card1" key={elem._id}>
                            <img src={elem.imageUrl || elem.image} style={{ height: "300px", width: "250px" }}></img>
                            <h3>{elem.title}</h3>
                            <p>{elem.description}</p>
                            <button className="btn btn-delete" onClick={() => { deleteHandler(elem._id) }}>Delete</button>
                            <button className="btn btn-update" onClick={() => { updateHandler(elem) }}>Update</button>

                        </div>
                    )
                })
                }
            </div>
        </>
    );
}

export default AddPostBox;
