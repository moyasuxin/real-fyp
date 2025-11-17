// src/app/studentmanager/components/CocurricularSection.tsx
"use client";
import React, { useState } from "react";
import { useCocurricular } from "../types/cocurricular";
import MLLoadingModal from "./MLLoadingModal";

interface Props {
  studentId: number;
}

export default function CocurricularSection({ studentId }: Props) {
  const { activities, loading, addActivity, deleteActivity } =
    useCocurricular(studentId);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlStage, setMlStage] = useState("Initializing...");
  const [newActivity, setNewActivity] = useState({
    activity_name: "",
    activity_type: "Club",
    activity_date: "",
    description: "",
    points: 1,
  });

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.activity_name) return alert("Enter activity name!");

    setMlLoading(true);
    setMlStage("Adding co-curricular activity...");

    try {
      await addActivity({
        student_id: studentId,
        activity_name: newActivity.activity_name,
        activity_type: newActivity.activity_type || null,
        activity_date: newActivity.activity_date || null,
        description: newActivity.description || null,
        points: newActivity.points,
      });

      setMlStage("Updating ML scores...");
      await new Promise((r) => setTimeout(r, 1000));

      const res = await fetch(`/api/ml/retrain?studentId=${studentId}`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("ML failed");

      setMlStage("✅ Done!");
      await new Promise((r) => setTimeout(r, 800));
    } catch (err) {
      alert("Error during ML retraining.");
      console.error(err);
    } finally {
      setMlLoading(false);
      setNewActivity({
        activity_name: "",
        activity_type: "Club",
        activity_date: "",
        description: "",
        points: 1,
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
    <div className="bg-zinc-800 p-4 rounded-lg space-y-3">
      <h3 className="text-lg font-semibold">Co-curricular Activities</h3>

      {loading ? (
        <p>Loading...</p>
      ) : activities.length === 0 ? (
        <p className="text-gray-400 italic">No activities yet</p>
      ) : (
        <ul className="space-y-2">
          {activities.map((a) => (
            <li
              key={a.id}
              className="flex justify-between items-center border border-gray-700 p-3 rounded-md"
            >
              <div>
                <div className="flex items-center gap-2">
                  <strong>{a.activity_name}</strong>
                  {a.activity_type && (
                    <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">
                      {a.activity_type}
                    </span>
                  )}
                  <span className="text-xs text-yellow-400">
                    {a.points} {a.points === 1 ? "point" : "points"}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  {a.activity_date &&
                    new Date(a.activity_date).toLocaleDateString()}
                  {a.description && ` — ${a.description}`}
                </div>
              </div>
              <button
                onClick={() => handleDelete(a.id)}
                className="text-red-400 hover:text-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add New Activity */}
      <form onSubmit={handleAddActivity} className="space-y-2 pt-2">
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Activity Name *
          </label>
          <input
            className="w-full bg-gray-700 p-2 rounded-md"
            placeholder="e.g. Programming Club President"
            value={newActivity.activity_name}
            onChange={(e) =>
              setNewActivity({ ...newActivity, activity_name: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Activity Type
          </label>
          <select
            className="w-full bg-gray-700 p-2 rounded-md"
            value={newActivity.activity_type}
            onChange={(e) =>
              setNewActivity({ ...newActivity, activity_type: e.target.value })
            }
          >
            <option value="Club">Club</option>
            <option value="Competition">Competition</option>
            <option value="Sports">Sports</option>
            <option value="Volunteering">Volunteering</option>
            <option value="Leadership">Leadership</option>
            <option value="Workshop">Workshop/Seminar</option>
            <option value="Project">Project</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Date</label>
          <input
            type="date"
            className="w-full bg-gray-700 p-2 rounded-md"
            value={newActivity.activity_date}
            onChange={(e) =>
              setNewActivity({ ...newActivity, activity_date: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Points (1-10)
          </label>
          <input
            type="number"
            min="1"
            max="10"
            className="w-full bg-gray-700 p-2 rounded-md"
            value={newActivity.points}
            onChange={(e) =>
              setNewActivity({
                ...newActivity,
                points: parseInt(e.target.value) || 1,
              })
            }
          />
          <p className="text-xs text-gray-400 mt-1">
            1-3: Participation • 4-6: Active role • 7-10: Leadership/Award
          </p>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Description (Optional)
          </label>
          <textarea
            className="w-full bg-gray-700 p-2 rounded-md"
            rows={2}
            placeholder="e.g. Led team of 10 students, organized 5 events"
            value={newActivity.description}
            onChange={(e) =>
              setNewActivity({ ...newActivity, description: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md w-full"
        >
          Add Activity
        </button>
      </form>
      <MLLoadingModal show={mlLoading} stage={mlStage} />
    </div>
  );
}
