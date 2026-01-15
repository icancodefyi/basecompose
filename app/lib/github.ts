export async function fetchGithubStars(
  owner: string,
  repo: string
): Promise<number> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers: { Accept: "application/vnd.github+json" } }
  );

  if (!res.ok) throw new Error("GitHub API failed");

  const data = await res.json();
  return data.stargazers_count;
}
