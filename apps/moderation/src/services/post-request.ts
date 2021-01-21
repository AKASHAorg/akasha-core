export default async function postRequest(url = '', data = {}) {
  const rheaders = new Headers();
  rheaders.append('Content-Type', 'application/json');

  const response = await fetch(url, {
    method: 'POST',
    headers: rheaders,
    body: JSON.stringify(data),
  });
  return response.json();
}
