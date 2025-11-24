// src/app/studentmanager/components/CocurricularSection.tsx
"use client";
import React, { useState } from "react";
import { useCocurricular } from "../hooks/useCocurricular";
import MLLoadingModal from "./MLLoadingModal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Props {
  studentId: number;
}

export default function CocurricularSection({ studentId }: Props) {
  const { activities, loading, addActivity, deleteActivity } =
    useCocurricular(studentId);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlStage, setMlStage] = useState("Initializing...");
  const [analyzing, setAnalyzing] = useState(false);
  const [newActivity, setNewActivity] = useState({
    event_name: "",
    organization_name: "",
    organization_type: "Computing Club",
    position: "",
    responsibilities: "",
    start_date: "",
    end_date: "",
  });

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.event_name) return alert("Enter event name!");
    if (!newActivity.organization_name)
      return alert("Enter organization name!");
    if (!newActivity.responsibilities)
      return alert("Enter responsibilities/duties!");

    setAnalyzing(true);
    setMlLoading(true);
    setMlStage("Analyzing activity with AI...");

    try {
      // Format activity period from dates
      let activity_period = null;
      if (newActivity.start_date) {
        const startFormatted = new Date(
          newActivity.start_date
        ).toLocaleDateString("en-US", { month: "short", year: "numeric" });
        if (
          newActivity.end_date &&
          newActivity.end_date !== newActivity.start_date
        ) {
          const endFormatted = new Date(
            newActivity.end_date
          ).toLocaleDateString("en-US", { month: "short", year: "numeric" });
          activity_period = `${startFormatted} - ${endFormatted}`;
        } else {
          activity_period = startFormatted;
        }
      }

      // Step 1: Analyze with Gemini AI
      const analysisRes = await fetch("/api/analyze-cocurricular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newActivity, activity_period }),
      });

      if (!analysisRes.ok) {
        const errorData = await analysisRes.json();
        console.error("AI analysis failed:", errorData);

        // Provide user-friendly error messages
        let errorMsg =
          errorData.details || errorData.error || analysisRes.statusText;
        if (errorData.type === "SERVICE_UNAVAILABLE") {
          errorMsg =
            "⚠️ Gemini AI is temporarily busy. Please wait 10 seconds and try again.";
        } else if (errorData.type === "RATE_LIMIT") {
          errorMsg =
            "⚠️ Too many requests. Please wait a minute and try again.";
        }

        throw new Error(errorMsg);
      }
      const aiScores = await analysisRes.json();
      console.log("AI Scores received:", aiScores);

      setMlStage("Saving activity...");

      // Step 2: Add activity with AI scores
      await addActivity({
        student_id: studentId,
        event_name: newActivity.event_name,
        organization_name: newActivity.organization_name,
        organization_type: newActivity.organization_type || null,
        position: newActivity.position || null,
        responsibilities: newActivity.responsibilities || null,
        activity_period: activity_period,
        ai_impact_score: aiScores.impact_score,
        ai_leadership_score: aiScores.leadership_score,
        ai_relevance_score: aiScores.relevance_score,
        ai_summary: aiScores.summary,
      });

      setMlStage("Updating ML scores...");
      await new Promise((r) => setTimeout(r, 1000));

      // Step 3: Retrain ML
      const res = await fetch(`/api/ml/retrain?studentId=${studentId}`, {
        method: "POST",
      });

      if (!res.ok) {
        const mlError = await res.text();
        console.error("ML retrain failed:", mlError);
        throw new Error(`ML retrain failed: ${mlError}`);
      }

      setMlStage("✅ Done!");
      await new Promise((r) => setTimeout(r, 800));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      alert(`Error: ${errorMessage}\n\nCheck browser console for details.`);
      console.error("Full error details:", err);
    } finally {
      setAnalyzing(false);
      setMlLoading(false);
      setNewActivity({
        event_name: "",
        organization_name: "",
        organization_type: "Computing Club",
        position: "",
        responsibilities: "",
        start_date: "",
        end_date: "",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this activity?")) return;

    setMlLoading(true);
    setMlStage("Deleting activity...");

    try {
      await deleteActivity(id);

      setMlStage("Updating ML scores...");
      const res = await fetch(`/api/ml/retrain?studentId=${studentId}`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("ML failed");

      setMlStage("✅ Done!");
      await new Promise((r) => setTimeout(r, 800));
    } catch (err) {
      alert("Error during update.");
      console.error(err);
    } finally {
      setMlLoading(false);
    }
  };

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
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Co-curricular Activities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <p>Loading...</p>
        ) : activities.length === 0 ? (
          <p className="text-gray-400 italic">No activities yet</p>
        ) : (
          <ul className="space-y-3">
            {activities.map((a) => (
              <li
                key={a.id}
                className="border border-gray-700 p-4 rounded-md space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <strong className="text-lg">{a.event_name}</strong>
                      {a.organization_type && (
                        <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">
                          {a.organization_type}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-300">
                      <span className="font-semibold">
                        {a.organization_name}
                      </span>
                      {a.position && <span> • {a.position}</span>}
                      {a.activity_period && <span> • {a.activity_period}</span>}
                    </div>
                    {a.responsibilities && (
                      <p className="text-sm text-gray-400 mt-2">
                        {a.responsibilities}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="text-red-400 hover:text-red-600 ml-4"
                  >
                    Delete
                  </button>
                </div>

                {/* AI Analysis Scores */}
                <div className="flex gap-4 pt-2 border-t border-gray-700">
                  <div className="text-center">
                    <div className="text-xs text-gray-400">Impact</div>
                    <div className="text-sm font-semibold text-blue-400">
                      {a.ai_impact_score}/100
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400">Leadership</div>
                    <div className="text-sm font-semibold text-green-400">
                      {a.ai_leadership_score}/100
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400">Relevance</div>
                    <div className="text-sm font-semibold text-purple-400">
                      {a.ai_relevance_score}/100
                    </div>
                  </div>
                </div>
                {a.ai_summary && (
                  <div className="text-xs text-gray-400 italic pt-1">
                    💡 {a.ai_summary}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Add New Activity */}
        <form
          onSubmit={handleAddActivity}
          className="space-y-3 pt-2 border-t border-gray-700"
        >
          <div className="text-sm text-gray-400 mb-2">
            ℹ️ AI will analyze your activity and automatically score its impact,
            leadership, and relevance
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Event Name *
            </label>
            <input
              className="w-full bg-gray-700 p-2 rounded-md"
              placeholder="e.g. Hackathon 2023, Leadership Workshop, Charity Run"
              value={newActivity.event_name}
              onChange={(e) =>
                setNewActivity({
                  ...newActivity,
                  event_name: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Organization/Club Name *
            </label>
            <input
              className="w-full bg-gray-700 p-2 rounded-md"
              placeholder="e.g. Computing Club, School Basketball Team, Red Cross"
              value={newActivity.organization_name}
              onChange={(e) =>
                setNewActivity({
                  ...newActivity,
                  organization_name: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Organization Type
            </label>
            <select
              className="w-full bg-gray-700 p-2 rounded-md"
              value={newActivity.organization_type}
              onChange={(e) =>
                setNewActivity({
                  ...newActivity,
                  organization_type: e.target.value,
                })
              }
            >
              <option value="Computing Club">Computing Club</option>
              <option value="School Club">School Club</option>
              <option value="Outside Organization">Outside Organization</option>
              <option value="Sports Team">Sports Team</option>
              <option value="NGO/Charity">NGO/Charity</option>
              <option value="Competition Team">Competition Team</option>
              <option value="Student Society">Student Society</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Your Position
              </label>
              <input
                className="w-full bg-gray-700 p-2 rounded-md"
                placeholder="e.g. President, Member, Volunteer"
                value={newActivity.position}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, position: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                className="w-full bg-gray-700 p-2 rounded-md"
                value={newActivity.start_date}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, start_date: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                End Date (optional)
              </label>
              <input
                type="date"
                className="w-full bg-gray-700 p-2 rounded-md"
                value={newActivity.end_date}
                min={newActivity.start_date}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, end_date: e.target.value })
                }
              />
              <p className="text-xs text-gray-400 mt-1">
                Leave empty for single day event
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Responsibilities & Achievements *
            </label>
            <textarea
              className="w-full bg-gray-700 p-2 rounded-md"
              rows={4}
              placeholder="Describe what you did, your contributions, and any achievements. Be specific!&#10;&#10;Example: Led a team of 10 members to organize 3 coding workshops with 100+ participants. Developed the club website using React and managed social media presence. Won 1st place in inter-university hackathon."
              value={newActivity.responsibilities}
              onChange={(e) =>
                setNewActivity({
                  ...newActivity,
                  responsibilities: e.target.value,
                })
              }
            />
            <p className="text-xs text-white/60 mt-1">
              💡 Include: team size, events organized, projects completed,
              awards won, skills used
            </p>
          </div>

          <Button
            type="submit"
            loading={analyzing}
            disabled={analyzing}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            {analyzing ? "🤖 AI Analyzing..." : "🚀 Add & Analyze Activity"}
          </Button>
        </form>
        <MLLoadingModal show={mlLoading} stage={mlStage} />
      </CardContent>
    </Card>
  );
}
