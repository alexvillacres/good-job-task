"use client";

import { useEffect, useState, useCallback } from "react";
import { useSupabaseBrowser } from "@/lib/supabaseClient";
import { useUser } from "@clerk/nextjs";

interface Task {
  id: number;
  title: string;
  is_complete: boolean;
}

export default function TasksList() {
  const supabase = useSupabaseBrowser();
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("id, title, is_complete")
      .order("inserted_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      setTasks(data);
    }
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    fetchTasks();

    const channel = supabase
      .channel("tasks-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchTasks]);

  const toggleTask = async (id: number, currentStatus: boolean) => {
    await supabase
      .from("tasks")
      .update({ is_complete: !currentStatus })
      .eq("id", id);
  };

  const deleteTask = async (id: number) => {
    await supabase.from("tasks").delete().eq("id", id);
  };

  if (loading) return <p className="text-gray-500">Loading tasks...</p>;
  if (tasks.length === 0)
    return <p className="text-gray-500">No tasks yet. Add one above!</p>;

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
        >
          <span
            className={`flex-grow cursor-pointer ${
              task.is_complete ? "line-through text-gray-400" : ""
            }`}
            onClick={() => toggleTask(task.id, task.is_complete)}
          >
            {task.title}
          </span>
          <button
            onClick={() => deleteTask(task.id)}
            className="text-red-500 hover:text-red-700 ml-4 text-sm"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}