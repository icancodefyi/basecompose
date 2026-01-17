export type StackBlueprint = {
  intent: "saas" | "api";
  frontend?: "nextjs";
  database?: "mongodb";
  auth?: "authjs";
};
