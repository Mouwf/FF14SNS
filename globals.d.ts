export {};
declare global {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    PORT: string;
    FIREBASE_API_KEY: string | undefined;
  }
  interface Process {
    env: ProcessEnv;
  }
  let process: Process;
}
