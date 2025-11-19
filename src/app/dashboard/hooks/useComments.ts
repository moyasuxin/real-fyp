"use client";
import { useState, useEffect } from "react";
import type { Comment, AnalysisResult } from "../types";

interface UseCommentsProps {
  studentId: number;
}

interface UseCommentsReturn {
  comments: Comment[];
  loading: boolean;
  submitting: boolean;
  analysisResult: AnalysisResult | null;
  fetchComments: () => Promise<void>;
  submitComment: (
    content: string,
    commenterId: string,
    commenterName: string
  ) => Promise<void>;
  deleteComment: (commentId: number, commenterId: string) => Promise<void>;
}

export function useComments({
  studentId,
}: UseCommentsProps): UseCommentsReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );

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

  const submitComment = async (
    content: string,
    commenterId: string,
    commenterName: string
  ) => {
    try {
      setSubmitting(true);
      setAnalysisResult(null);

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          commenter_id: commenterId,
          commenter_name: commenterName,
          content,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        await fetchComments();

        if (data.analysis) {
          setAnalysisResult(data.analysis);
          setTimeout(() => setAnalysisResult(null), 5000);
        }
      } else {
        throw new Error(data.error || "Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = async (commentId: number, commenterId: string) => {
    try {
      const res = await fetch(
        `/api/comments?commentId=${commentId}&commenterId=${commenterId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        await fetchComments();
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  return {
    comments,
    loading,
    submitting,
    analysisResult,
    fetchComments,
    submitComment,
    deleteComment,
  };
}
