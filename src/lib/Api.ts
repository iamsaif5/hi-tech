export const fetchEntries = async ({ date_from, date_to, selectedDate }) => {
  const body = selectedDate
    ? {
        clock_number: '',
        date: selectedDate,
        date_from: '',
        date_to: '',
        timezone: '',
        limit: 100,
        offset: 0,
      }
    : {
        clock_number: '',
        date: '',
        date_from,
        date_to,
        timezone: '',
        limit: 100,
        offset: 0,
      };

  const response = await fetch('https://hitec-backend.intelleqt.ai/api/entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

export const fetchHours = async ({ date_from, date_to }) => {
  const body = {
    date_from,
    date_to,
    timezone: 'UTC',
    limit: 100,
    offset: 0,
  };

  const response = await fetch('https://hitec-backend.intelleqt.ai/api/entries/hours', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};
