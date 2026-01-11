export type StackBlueprint = {
  intent: "saas" | "api";
  frontend?: "nextjs";
  backend?: "node" | "fastapi";
  database?: "postgres" | "mongodb";
  auth?: "authjs";
};
