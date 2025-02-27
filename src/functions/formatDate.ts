export const formatDate = (dateString: string): string => {
  const dateParts = dateString.match(/(\d{1,2})\s*([A-Za-z]+)\s*(\d{4})/);
  if (!dateParts) return "";

  const [, day, monthStr, year] = dateParts;

  const monthNames: { [key: string]: string } = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };

  const month = monthNames[monthStr] || "01"; // Default to "01" if not found

  return `${year}-${month}-${day.padStart(2, "0")}`; // Format: YYYY-MM-DD
};
