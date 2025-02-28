export const formatDateIdCard = (dateString: string): string => {
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

export const formatDatePassport = (rawDate: string): string => {
  if (!rawDate) return "";

  // Define month mapping
  const monthMap: Record<string, string> = {
    JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
    JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12"
  };

  // Split the input date
  const parts = rawDate.split(" ");
  if (parts.length !== 3) return ""; // Invalid format check

  const [day, monthAbbr, year] = parts;
  const month = monthMap[monthAbbr.toUpperCase()] || "";

  return year && month && day ? `${year}-${month}-${day.padStart(2, "0")}` : "";
};
