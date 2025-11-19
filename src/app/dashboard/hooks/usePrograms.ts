"use client";
import { useState, useEffect } from "react";
import type { Program, GroupedPrograms } from "../types";

export function usePrograms() {
  const [groups, setGroups] = useState<GroupedPrograms[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        setLoading(true);
        const res = await fetch("/api/programs");
        if (!res.ok) {
          console.error("Failed to fetch programs:", res.statusText);
          return;
        }
        const programs: Program[] = await res.json();

        const grouped = programs.reduce<GroupedPrograms[]>((acc, program) => {
          const existingGroup = acc.find((g) => g.name === program.group_name);
          if (existingGroup) {
            existingGroup.programs.push(program);
          } else {
            acc.push({ name: program.group_name, programs: [program] });
          }
          return acc;
        }, []);

        setGroups(grouped);
      } finally {
        setLoading(false);
      }
    }

    fetchPrograms();
  }, []);

  return { groups, loading };
}
