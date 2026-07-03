export function formatToman(amount: number) {
  return `${amount.toLocaleString("fa-IR")} تومان`;
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(
    new Date(date)
  );
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}
