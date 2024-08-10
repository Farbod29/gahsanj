// utils/DeletePreviousDayShowsSevenComingEvents.js
export function deletePreviousDayShowsSevenComingEvents(
  data,
  referenceDate = new Date()
) {
  // Ensure referenceDate is a Date object
  referenceDate = new Date(referenceDate);

  // Get the start of the reference date (removing time component)
  const startOfToday = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );

  // Filter out events before the start of the reference date (includes today's events)
  const upcomingEvents = data.filter((item) => {
    const [day, month] = item.Georgian.split(',');
    const eventDate = new Date(referenceDate.getFullYear(), month - 1, day);
    return eventDate >= startOfToday; // Include today's events and future events
  });

  // Sort events by date
  upcomingEvents.sort((a, b) => {
    const dateA = new Date(
      referenceDate.getFullYear(),
      a.Georgian.split(',')[1] - 1,
      a.Georgian.split(',')[0]
    );
    const dateB = new Date(
      referenceDate.getFullYear(),
      b.Georgian.split(',')[1] - 1,
      b.Georgian.split(',')[0]
    );
    return dateA - dateB;
  });

  // Keep only the next 7 events (fixed the slice count to 7)
  const nextSevenEvents = upcomingEvents.slice(0, 7);

  return nextSevenEvents;
}
