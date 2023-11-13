export default function formatAmount(amount: number) {
  return (amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2 });
}
