import appInsights from "applicationinsights";

export interface AppInsightsConfig {
  cloudName: string;
  connectionString: string;
}

export function initializeAppInsights(
  config: AppInsightsConfig,
): appInsights.TelemetryClient | null {
  if (!config.connectionString) {
    return null;
  }

  appInsights.setup(config.connectionString);

  if (appInsights.defaultClient) {
    const cloudRoleKey = appInsights.defaultClient.context.keys.cloudRole;
    appInsights.defaultClient.context.tags[cloudRoleKey] = config.cloudName;
  }

  appInsights.start();

  return appInsights.defaultClient;
}
