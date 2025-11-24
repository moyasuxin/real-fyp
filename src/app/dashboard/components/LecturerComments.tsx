"use client";
import React, { useState } from "react";
import { useComments } from "../hooks";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Loader } from "@/components/ui/Loader";

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
    <Card className="glass border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
          Lecturer Comments
          <Badge variant="primary" size="sm" className="ml-auto">
            {comments.length}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Add Comment Form */}
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <TextArea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your feedback about this student... (AI will analyze sentiment and usefulness)"
            className="glass text-white placeholder-white/60 border-white/30 focus:border-white focus:ring-white/30 min-h-[120px]"
            disabled={submitting}
            rows={4}
          />

          {analysisResult && (
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg animate-slide-down space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-white">
                  AI Analysis:
                </span>
                <Badge
                  variant={analysisResult.is_useful ? "success" : "warning"}
                  size="sm"
                >
                  {analysisResult.is_useful ? "Useful" : "Generic"}
                </Badge>
                <Badge variant="primary" size="sm">
                  Sentiment: {analysisResult.sentiment_score}/100
                </Badge>
              </div>
              <p className="text-sm text-white/80">{analysisResult.summary}</p>
              <p className="text-xs text-white/60">
                New average score: {analysisResult.average_score}/100
              </p>
            </div>
          )}

          <Button
            type="submit"
            loading={submitting}
            disabled={!newComment.trim()}
            className="bg-white text-primary hover:bg-white/90"
          >
            {submitting ? "Analyzing & Submitting..." : "Submit Comment"}
          </Button>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-white/80 flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Comment History
          </h4>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader variant="spinner" size="md" className="text-white" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <svg
                className="w-12 h-12 mx-auto mb-3 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-sm italic">
                No comments yet. Be the first to provide feedback!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-4 rounded-lg border transition-all ${
                    comment.content === "[Comment deleted]"
                      ? "bg-white/5 border-white/10"
                      : "bg-white/10 border-white/20 hover:bg-white/15"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-white flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {comment.commenter_name}
                      </span>
                      <span className="text-xs text-white/50">
                        {new Date(comment.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>

                    {comment.commenter_id === currentUserId &&
                      comment.content !== "[Comment deleted]" && (
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-xs text-red-300 hover:text-red-200 transition-colors flex items-center gap-1"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      )}
                  </div>

                  <p
                    className={`text-sm ${
                      comment.content === "[Comment deleted]"
                        ? "text-white/40 italic"
                        : "text-white/90"
                    }`}
                  >
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LecturerComments;
