"use client";
import { useEffect, useState } from "react";
import { fetchGithubStars } from "../lib/github";

export function useGithubStars(owner: string, repo: string) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetchGithubStars(owner, repo)
      .then(setStars)
      .catch(() => setStars(null));
  }, [owner, repo]);

  return stars;
}
