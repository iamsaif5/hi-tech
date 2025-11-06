export const fetchEntries = async ({ date_from, date_to }) => {
  const response = await fetch('http://18.171.58.192/api/entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clock_number: '',
      date: '',
      date_from,
      date_to,
      timezone: '',
      limit: 100,
      offset: 0,
    }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};
