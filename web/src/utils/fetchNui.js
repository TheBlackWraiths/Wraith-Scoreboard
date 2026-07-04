const resourceName = window.GetParentResourceName
  ? window.GetParentResourceName()
  : 'w-scoreboard';

export async function fetchNui(eventName, data = {}) {
  const response = await fetch(`https://${resourceName}/${eventName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(data),
  });

  return response.json();
}
