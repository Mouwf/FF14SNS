export {};
declare global {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    PORT: string;
    RUN_UNIT_TESTS: string;
    RUN_INFRA_TESTS: string;
    SESSION_SERCRET_KEY: string | undefined;
    FIREBASE_API_KEY: string | undefined;
    DATABASE_URL: string | undefined;
    TEST_FIREBASE_API_KEY: string | undefined;
    TEST_DATABASE_URL: string | undefined;
  }
  interface Process {
    env: ProcessEnv;
  }
  let process: Process;
}
