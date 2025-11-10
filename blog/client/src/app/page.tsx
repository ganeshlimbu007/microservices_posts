"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import PostItem from "@/components/comment";

interface Post {
  title: string;
  id?: string;
}
type PostReq = Record<string, Post>;

const AddPostForm: React.FC = () => {
  const [post, setPost] = useState<Post>({ title: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post("http://localhost:4000/posts", post);
      setMessage(`✅ Post created: ${res.data.title}`);
      setPost({ title: "" });
      fetchPosts(); // Refresh the posts list
    } catch (err: any) {
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch all posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get<Post[]>("http://localhost:4000/posts");
      setPosts(res.data);
    } catch (err: any) {
      console.error("Error fetching posts:", err.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-black">
      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto mt-10 p-4 border rounded-lg shadow-md space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Add New Post</h2>

        <input
          type="text"
          name="title"
          value={post.title}
          onChange={handleChange}
          placeholder="Enter title..."
          className="w-full p-2 border-2 rounded focus:outline-none focus:ring"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 border hover:bg-blue-600 text-white font-semibold py-2 rounded"
        >
          {loading ? "Adding..." : "Add Post"}
        </button>

        {message && (
          <p className="text-center text-sm text-gray-700 mt-2">{message}</p>
        )}
      </form>
      {/* ✅ Display Posts */}
      <div className="w-full max-w-md mt-8 p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-center">All Posts</h3>

        {Object.keys(posts).length === 0 ? (
          <p className="text-gray-500 text-center">No posts found.</p>
        ) : (
          <ul className="space-y-2">
            {Object.entries(posts).map(([key, p]) => (
              <PostItem key={key} postId={key} title={p.title} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddPostForm;
