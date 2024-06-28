export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString;
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};
