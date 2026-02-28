/**
 * Export transactions to a CSV file and trigger download.
 */
export function exportTransactionsCSV(transactions, filename = 'transactions.csv') {
  const headers = ['Date', 'Description', 'Category', 'UPI App', 'Amount (INR)'];
  const rows = transactions.map((t) => [
    new Date(t.date).toLocaleDateString('en-IN'),
    `"${t.description.replace(/"/g, '""')}"`,
    t.category,
    t.upiApp || '',
    t.amount.toFixed(2),
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
