import React, { useEffect, useState } from "react";
import axios from "axios";

interface Comment {
  id?: string;
  content: string;
  status: "pending" | "approved" | "rejected";
}

interface PostItemProps {
  postId: string;
  title: string;
  comments: Comment[];
  updatePosts: () => void;
}

const PostItem: React.FC<PostItemProps> = ({
  postId,
  title,
  comments,
  updatePosts,
}) => {
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Add new comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await axios.post(`http:https://chatjpt.com/${postId}/comments`, {
        type: "CommentCreated",
        data: {
          postId,
          content: newComment,
        },
      });
      setNewComment("");
      updatePosts();
    } catch (err: any) {
      console.error("Error posting comment:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderComments = () => {
    return comments.map((c) => (
      <li
        key={c.id || c.content}
        className={`text-sm border-b border-gray-100 pb-1 ${
          c.status === "pending"
            ? "italic text-gray-400"
            : c.status === "rejected"
            ? "line-through text-red-400"
            : ""
        }`}
      >
        💬{" "}
        {c.status === "pending"
          ? "Comment waiting moderation "
          : c.status === "rejected"
          ? "Comment Rejected"
          : c.content}
      </li>
    ));
  };

  return (
    <li className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition">
      <h4 className="font-semibold mb-2">{title}</h4>

      {/* ✅ Comments list */}
      <div className="mb-3">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet.</p>
        ) : (
          <ul className="space-y-1">{renderComments()}</ul>
        )}
      </div>

      {/* ✅ Add comment form */}
      <form onSubmit={handleAddComment} className="flex space-x-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 border p-1 rounded focus:outline-none focus:ring"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-3 rounded text-sm"
        >
          {loading ? "..." : "Add"}
        </button>
      </form>
    </li>
  );
};

export default PostItem;
