import { env } from "../config/env";

/**
 * Integracao opcional para dados meteorologicos.
 * Nesta fase retorna null quando a chave nao esta configurada
 * ou quando a chamada externa falha.
 */
export async function fetchWeatherForRun(
  lat: number,
  lon: number
): Promise<Record<string, unknown> | null> {
  if (!env.OPENWEATHER_API_KEY) {
    return null;
  }

  try {
    const query = new URLSearchParams({
      lat: String(lat),
      lon: String(lon),
      units: "metric",
      appid: env.OPENWEATHER_API_KEY,
    });

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?${query.toString()}`
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as Record<string, unknown>;
    return data;
  } catch {
    return null;
  }
}
