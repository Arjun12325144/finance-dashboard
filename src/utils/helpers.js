import { format, parseISO } from "date-fns";

export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);

export const formatDate = (dateStr) => {
  try {
    return format(parseISO(dateStr), "MMM d, yyyy");
  } catch {
    return dateStr;
  }
};

export const formatShortDate = (dateStr) => {
  try {
    return format(parseISO(dateStr), "MMM d");
  } catch {
    return dateStr;
  }
};

export const getMonthYear = (dateStr) => {
  try {
    return format(parseISO(dateStr), "MMM yyyy");
  } catch {
    return dateStr;
  }
};

export const getSummary = (transactions) => {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expenses,
    balance: income - expenses,
    savings: income > 0 ? ((income - expenses) / income) * 100 : 0,
  };
};

export const getMonthlyData = (transactions) => {
  const monthMap = {};

  transactions.forEach((t) => {
    const key = getMonthYear(t.date);
    if (!monthMap[key]) {
      monthMap[key] = { month: key, income: 0, expenses: 0, balance: 0 };
    }
    if (t.type === "income") monthMap[key].income += t.amount;
    else monthMap[key].expenses += t.amount;
    monthMap[key].balance = monthMap[key].income - monthMap[key].expenses;
  });

  return Object.values(monthMap)
    .sort((a, b) => new Date("01 " + a.month) - new Date("01 " + b.month))
    .slice(-6);
};

export const getCategoryBreakdown = (transactions) => {
  const catMap = {};
  const expenses = transactions.filter((t) => t.type === "expense");
  const total = expenses.reduce((s, t) => s + t.amount, 0);

  expenses.forEach((t) => {
    if (!catMap[t.category]) catMap[t.category] = 0;
    catMap[t.category] += t.amount;
  });

  return Object.entries(catMap)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
};

export const exportToCSV = (transactions) => {
  const headers = ["Date", "Description", "Category", "Type", "Amount"];
  const rows = transactions.map((t) => [
    formatDate(t.date),
    `"${t.description}"`,
    t.category,
    t.type,
    t.amount.toFixed(2),
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToJSON = (transactions) => {
  const json = JSON.stringify(transactions, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.json";
  a.click();
  URL.revokeObjectURL(url);
};
