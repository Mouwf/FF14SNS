import { AppLoadContext } from "@remix-run/node";
import { productionAppLoadContext, postgresClientProvider as productionPostgresClientProvider } from "./production-app-load-context";
import { unitTestAppLoadContext } from "../../tests/dependency-injector/unit-test-app-load-context";
import PostgresClientProvider from "../repositories/common/postgres-client-provider";

export let appLoadContext: AppLoadContext;
if (process.env.RUN_UNIT_TESTS === "true") {
    appLoadContext = unitTestAppLoadContext;
} else {
    appLoadContext = productionAppLoadContext;
}

export const postgresClientProvider: PostgresClientProvider = productionPostgresClientProvider;