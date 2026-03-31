export default async function handler(req, res) {
  const { city, type } = req.query;
  const key = process.env.API_KEY;

  const base = type === "forecast"
    ? `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${key}`
    : `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${key}`;

  const response = await fetch(base);
  const data = await response.json();
  res.status(response.status).json(data);
}