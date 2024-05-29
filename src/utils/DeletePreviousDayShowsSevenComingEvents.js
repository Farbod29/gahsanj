// utils/DeletePreviousDayShowsSevenComingEvents.js
export function deletePreviousDayShowsSevenComingEvents(
  data,
  referenceDate = new Date()
) {
  // Ensure referenceDate is a Date object
  referenceDate = new Date(referenceDate);

  // Filter out events before the reference date
  const upcomingEvents = data.filter((item) => {
    const [day, month] = item.Georgian.split(',');
    const eventDate = new Date(referenceDate.getFullYear(), month - 1, day);
    return eventDate >= referenceDate;
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

  // Keep only the next 7 events
  const nextSevenEvents = upcomingEvents.slice(0, 6);

  return nextSevenEvents;
}
