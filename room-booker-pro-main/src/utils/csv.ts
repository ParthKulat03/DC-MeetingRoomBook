export type CsvRow = Record<string, string | number | null | undefined>;

const escapeCell = (value: string | number | null | undefined) => {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const toCsv = (rows: CsvRow[]): string => {
  if (rows.length === 0) return "";
  const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const lines = [
    headers.map(escapeCell).join(","),
    ...rows.map((row) => headers.map((header) => escapeCell(row[header])).join(",")),
  ];
  return lines.join("\r\n");
};

export const downloadCsv = (rows: CsvRow[], filename: string) => {
  // BOM keeps Excel happy with UTF-8 content.
  const blob = new Blob(["\uFEFF", toCsv(rows)], { type: "text/csv;charset=utf-8;" });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
};
