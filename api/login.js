export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://www.ezzloc.net/gpsapi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cmd: 'login',
        token: '',
        language: 1,
        params: {
          UserCode: process.env.USER_CODE,
          Password: process.env.PASSWORD,
        },
      }),
    });

    const json = await response.json();

    if (json.result !== 1 || !json.detail?.token) {
      return res.status(401).json({ error: 'Login failed', detail: json });
    }

    const token = json.detail.token;
    const expiresAt = Date.now() + 1000 * 60 * 60 * 24;

    res.status(200).json({ token, expiresAt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
