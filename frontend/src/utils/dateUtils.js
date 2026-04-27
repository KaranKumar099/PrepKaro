/**
 * Calculates the time difference between two date strings.
 * @param {string} endTimeString 
 * @param {string} startTimeString 
 * @returns {object} { hours, minutes, seconds }
 */
export const getTimeDifference = (endTimeString, startTimeString) => {
  const endTime = new Date(endTimeString);
  const startTime = new Date(startTimeString);
  const diffMs = endTime - startTime;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
  const seconds = Math.floor(diffMs / 1000) % 60;
  return { hours, minutes, seconds };
};

/**
 * Formats a date string into a readable format: DD-MM-YYYY, Weekday
 * @param {string} startTimeString 
 * @returns {string} Formatted date
 */
export const formatDate = (startTimeString) => {
  const dateObj = new Date(startTimeString);
  const dayNumber = String(dateObj.getUTCDate()).padStart(2, "0");
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const year = dateObj.getUTCFullYear();
  const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
  return `${dayNumber}-${month}-${year}, ${weekday}`;
};
/**
 * Formats a date string into a short readable format: D MMM YYYY
 * @param {string} isoString 
 * @returns {string} Formatted date
 */
export const formatShortDate = (isoString) => {
  const dateObj = new Date(isoString);
  return dateObj.toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' });
};
