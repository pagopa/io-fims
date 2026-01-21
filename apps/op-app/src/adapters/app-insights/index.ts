import appInsights from "applicationinsights";

export interface AppInsightsConfig {
  connectionString: string;
}

export function initializeAppInsights(
  config: AppInsightsConfig,
): appInsights.TelemetryClient | null {
  if (!config.connectionString) {
    return null;
  }

  appInsights.setup(config.connectionString).start();

  return new appInsights.TelemetryClient(config.connectionString);
}
