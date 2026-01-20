import appInsights from "applicationinsights";

export interface AppInsightsConfig {
  connectionString: string;
}

export function initializeAppInsights(
  config: AppInsightsConfig,
): appInsights.TelemetryClient | null {
  if (!config.connectionString) {
    console.log(
      "[AppInsights] Skipping initialization: no connection string provided",
    );
    return null;
  }

  appInsights.setup(config.connectionString).start();

  return new appInsights.TelemetryClient(config.connectionString);
}
