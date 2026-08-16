export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return "Rs. 0";
  }

  return `Rs. ${amount.toLocaleString("en-PK", { maximumFractionDigits: 2 })}`;
};

export const formatDate = (isoString: string | undefined): string => {
  if (!isoString) return "—";

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};
