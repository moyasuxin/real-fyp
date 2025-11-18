"use client";
import React, { useState, useEffect } from "react";

interface Comment {
  id: number;
  student_id: number;
  commenter_id: string;
  commenter_name: string;
  content: string;
  created_at: string;
}

interface AnalysisResult {
  sentiment_score: number;
  is_useful: boolean;
  summary: string;
  average_score: number;
}

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
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );

  // Fetch comments
  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/comments?studentId=${studentId}`);
      const data = await res.json();

      if (res.ok) {
        setComments(data.comments || []);
      } else {
        console.error("Failed to fetch comments:", data.error);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  // Submit new comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !currentUserId || !currentUserName) {
      alert("Please enter a comment");
      return;
    }

    try {
      setSubmitting(true);
      setAnalysisResult(null);

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          commenter_id: currentUserId,
          commenter_name: currentUserName,
          content: newComment,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setNewComment("");
        await fetchComments();

        // Show AI analysis result
        if (data.analysis) {
          setAnalysisResult(data.analysis);
          setTimeout(() => setAnalysisResult(null), 5000);
        }
      } else {
        alert(`Failed to submit comment: ${data.error}`);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete comment
  const handleDelete = async (commentId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this comment? It will be marked as '[Comment deleted]'"
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `/api/comments?commentId=${commentId}&commenterId=${currentUserId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        await fetchComments();
      } else {
        const data = await res.json();
        alert(`Failed to delete comment: ${data.error}`);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return null; // Don't show to non-authenticated users
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
