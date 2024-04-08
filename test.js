const timestamp = 1710765366827; // Replace this with your actual timestamp
const date = new Date(timestamp);
const humanReadableDate = date.format('YYYY-MM-DD HH:mm:ss'); // Format to "year-month-day hours:minutes:seconds"

console.log(humanReadableDate); // Output: "3/27/2024, 12:36:06 AM" (format depends on locale)
