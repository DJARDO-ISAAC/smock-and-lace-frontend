"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/stores/auth";

/** Load and mutate a customer's own rows, e.g. /me/addresses/ (users app). */
export function useOwned<T extends { id: number }>(path: string) {
  const authFetch = useAuth((s) => s.authFetch);
  const status = useAuth((s) => s.status);
  const [items, setItems] = useState<T[] | null>(null);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    try {
      setItems(await authFetch<T[]>(path));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setItems([]);
    }
  }, [authFetch, path]);

  useEffect(() => {
    if (status !== "authenticated") return;
    let live = true;
    authFetch<T[]>(path).then(
      (rows) => {
        if (!live) return;
        setItems(rows);
        setError("");
      },
      (e) => {
        if (!live) return;
        setError((e as Error).message);
        setItems([]);
      },
    );
    return () => {
      live = false;
    };
  }, [status, authFetch, path]);

  const save = async (values: Partial<T>, id?: number) => {
    await authFetch<T>(id ? `${path}${id}/` : path, { method: id ? "PATCH" : "POST", body: values });
    await reload();
  };
  const remove = async (id: number) => {
    await authFetch(`${path}${id}/`, { method: "DELETE" });
    await reload();
  };

  return { items, error, save, remove, reload };
}
