// src/api/client.ts
export const API_URL = 'https://quiz-platform-did7.onrender.com/api/v1';

export async function apiRequest(endpoint: string, options: any = {}): Promise<any> {
  const url = API_URL + endpoint;
  console.log("--> ŠALJEM:", url);

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: options.body || null,
      // OVO JE DODATO: Sprečava keširanje starih odgovora
      cache: 'no-store', 
    });

    console.log("<-- STATUS:", response.status);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Greška na serveru (${response.status})`);
    }

    return data;
  } catch (error: any) {
    console.log("!!! GREŠKA U MREŽI:", error.message);
    throw new Error('Nema odgovora od servera. Proverite internet ili sačekajte da se server probudi.');
  }
}