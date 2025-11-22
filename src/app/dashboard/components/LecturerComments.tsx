"use client";
import React, { useState } from "react";
import { useComments } from "../hooks";

interface LecturerCommentsProps {
  studentId: number;
  currentUserId: string | null;
  currentUserName: string | null;
  isAuthenticated: boolean;
}

const LecturerComments: React.FC<LecturerCommentsProps> = ({
  studentId,
  currentUserId,
  currentUserName,
  isAuthenticated,
}) => {
  const [newComment, setNewComment] = useState("");
  const {
    comments,
    loading,
    submitting,
    analysisResult,
    submitComment,
    deleteComment,
  } = useComments({ studentId });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !currentUserId || !currentUserName) {
      alert("Please enter a comment");
      return;
    }

    try {
      await submitComment(newComment, currentUserId, currentUserName);
      setNewComment("");

      // Refresh the page to update AI summary and chart after analysis
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Wait 2 seconds to show analysis result first
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to submit comment";
      alert(errorMsg);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this comment? It will be marked as '[Comment deleted]'"
      )
    ) {
      return;
    }

    try {
      if (!currentUserId) return;
      await deleteComment(commentId, currentUserId);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to delete comment";
      alert(errorMsg);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="text-gray-100">
      <h3 className="text-blue-400 font-semibold mb-4 flex items-center gap-2">
        💬 Lecturer Comments
        <span className="text-sm text-gray-400">({comments.length})</span>
      </h3>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add your feedback about this student... (AI will analyze sentiment and usefulness)"
          className="w-full bg-zinc-700 text-white p-3 rounded-lg border border-zinc-600 focus:border-blue-500 focus:outline-none min-h-[100px] resize-y"
          disabled={submitting}
        />

        {analysisResult && (
          <div className="mt-2 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-blue-300">
                AI Analysis:
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  analysisResult.is_useful ? "bg-green-600" : "bg-yellow-600"
                }`}
              >
                {analysisResult.is_useful ? "Useful" : "Generic"}
              </span>
              <span className="text-xs text-gray-300">
                Sentiment: {analysisResult.sentiment_score}/100
              </span>
            </div>
            <p className="text-xs text-gray-300">{analysisResult.summary}</p>
            <p className="text-xs text-gray-400 mt-1">
              New average score: {analysisResult.average_score}/100
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !newComment.trim()}
          className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "🤖 Analyzing & Submitting..." : "Submit Comment"}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-400 mb-2">
          Comment History:
        </h4>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-400 text-sm italic">
            No comments yet. Be the first to provide feedback!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3 rounded-lg border ${
                comment.content === "[Comment deleted]"
                  ? "bg-zinc-900/50 border-zinc-700"
                  : "bg-zinc-700/50 border-zinc-600"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-blue-300">
                    {comment.commenter_name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {comment.commenter_id === currentUserId &&
                  comment.content !== "[Comment deleted]" && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-xs text-red-400 hover:text-red-300 transition"
                    >
                      Delete
                    </button>
                  )}
              </div>

              <p
                className={`text-sm ${
                  comment.content === "[Comment deleted]"
                    ? "text-gray-500 italic"
                    : "text-gray-200"
                }`}
              >
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LecturerComments;
