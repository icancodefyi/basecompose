import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { generateProject } from "@BaseCompose/engine";
import { Octokit } from "@octokit/rest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as tar from "tar";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return Response.json(
        { error: "Unauthorized - Please sign in with GitHub" },
        { status: 401 }
      );
    }

    const { stack, repoName, description } = await req.json();

    if (!repoName || !description) {
      return Response.json(
        { error: "Repository name and description are required" },
        { status: 400 }
      );
    }

    if (!stack || !stack.frontend) {
      return Response.json(
        { error: "Invalid stack configuration" },
        { status: 400 }
      );
    }

    // Get GitHub token from session
    const githubToken = (session as any).accessToken;
    if (!githubToken) {
      return Response.json(
        { error: "GitHub token not found. Please sign in with GitHub." },
        { status: 401 }
      );
    }

    console.log("[GITHUB-PUSH] Initializing Octokit with token:", githubToken.substring(0, 10) + "...");

    const octokit = new Octokit({
      auth: githubToken,
    });

    // Get authenticated user info
    console.log("[GITHUB-PUSH] Fetching authenticated user...");
    const { data: userData } = await octokit.rest.users.getAuthenticated();
    const owner = userData.login;
    console.log("[GITHUB-PUSH] Authenticated as:", owner);

    // Check if repo already exists
    console.log("[GITHUB-PUSH] Checking if repo exists:", owner, repoName);
    try {
      await octokit.rest.repos.get({
        owner,
        repo: repoName,
      });
      return Response.json(
        { error: `Repository '${repoName}' already exists` },
        { status: 409 }
      );
    } catch (error: any) {
      // Repo doesn't exist, which is what we want
      console.log("[GITHUB-PUSH] Repo check error status:", error.status);
      if (error.status !== 404) {
        throw error;
      }
    }

    // Create repository
    console.log("[GITHUB-PUSH] Creating repository:", repoName);
    let repoData;
    try {
      // Try the standard method first
      const response = await octokit.rest.repos.createForAuthenticatedUser({
        name: repoName,
        description: description,
        private: false,
        auto_init: false,
        gitignore_template: "Node",
      });
      repoData = response.data;
    } catch (e: any) {
      console.log("[GITHUB-PUSH] createForAuthenticatedUser failed, trying alternative method");
      // Fallback to direct API call
      const response = await octokit.request("POST /user/repos", {
        name: repoName,
        description: description,
        private: false,
        auto_init: false,
        gitignore_template: "Node",
      });
      repoData = response.data;
    }
    console.log("[GITHUB-PUSH] Repository created:", repoData.html_url);

    // Generate project as a zip buffer
    const zipBuffer = await generateProject(stack);
    console.log("[GITHUB-PUSH] Generated zip buffer, size:", zipBuffer.length, "bytes");

    // Extract zip to temp directory
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "BaseCompose-Upload-"));
    const zipPath = path.join(tmpDir, "project.tar.gz");
    fs.writeFileSync(zipPath, zipBuffer);

    // Extract tar.gz
    await tar.extract({
      file: zipPath,
      cwd: tmpDir,
    });

    // Get all files from the extracted project
    const projectDir = path.join(tmpDir, "project");
    const files = new Map<string, string>();

    function getAllFiles(dir: string, baseDir: string = "") {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(baseDir, entry.name);

        if (entry.isDirectory()) {
          getAllFiles(fullPath, relativePath);
        } else {
          const content = fs.readFileSync(fullPath, "utf-8");
          files.set(relativePath.replace(/\\/g, "/"), content);
        }
      }
    }

    getAllFiles(projectDir);
    console.log("[GITHUB-PUSH] Extracted files:", Array.from(files.keys()));

    // Helper function to upload file to GitHub
    async function uploadFile(
      filePath: string,
      content: string,
      message: string
    ) {
      const encoding = "utf-8";
      const fileContent = Buffer.from(content).toString("base64");

      try {
        // Try to get existing file SHA (for updating)
        let sha: string | undefined;
        try {
          const existingFile = await octokit.rest.repos.getContent({
            owner,
            repo: repoName,
            path: filePath,
          });
          if (Array.isArray(existingFile.data)) {
            console.log(`[GITHUB-PUSH] File ${filePath} is a directory, skipping`);
            return;
          }
          sha = (existingFile.data as any).sha;
        } catch (e: any) {
          // File doesn't exist, we'll create it
          if (e.status !== 404) {
            throw e;
          }
        }

        await octokit.rest.repos.createOrUpdateFileContents({
          owner,
          repo: repoName,
          path: filePath,
          message,
          content: fileContent,
          ...(sha && { sha }),
          committer: {
            name: "BaseCompose",
            email: "noreply@basecompose.dev",
          },
          author: {
            name: userData.name || userData.login,
            email: userData.email || `${userData.login}@users.noreply.github.com`,
          },
        });
      } catch (error) {
        console.error(`Failed to upload ${filePath}:`, error);
        throw error;
      }
    }

    // Upload all generated files
    const fileEntries = Array.from(files.entries());
    console.log("[GITHUB-PUSH] Uploading", fileEntries.length, "files to GitHub");
    for (const [filePath, content] of fileEntries) {
      console.log("[GITHUB-PUSH] Uploading:", filePath);
      await uploadFile(
        filePath,
        content,
        "Initial commit by BaseCompose ✨"
      );
    }
    console.log("[GITHUB-PUSH] All files uploaded successfully");

    // Cleanup temp directory
    fs.rmSync(tmpDir, { recursive: true, force: true });

    return Response.json({
      success: true,
      repository: {
        url: repoData.html_url,
        name: repoData.name,
        owner: repoData.owner.login,
      },
      message: `Repository created and code pushed successfully! 🚀`,
    });
  } catch (error: any) {
    console.error("[GITHUB-PUSH] Error:", error.message);
    console.error("[GITHUB-PUSH] Error status:", error.status);
    console.error("[GITHUB-PUSH] Error response:", error.response?.data);
    console.error("[GITHUB-PUSH] Full error:", error);

    let errorMessage = "Failed to push to GitHub";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return Response.json(
      { error: errorMessage },
      { status: error.status || 500 }
    );
  }
}
