export const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Housing",
  "Utilities",
  "Education",
  "Travel",
  "Salary",
  "Freelance",
  "Investment",
  "Other",
];

export const CATEGORY_COLORS = {
  "Food & Dining": "#FF6B6B",
  Transportation: "#4ECDC4",
  Shopping: "#FFE66D",
  Entertainment: "#A78BFA",
  Healthcare: "#F472B6",
  Housing: "#FB923C",
  Utilities: "#60A5FA",
  Education: "#34D399",
  Travel: "#FBBF24",
  Salary: "#10B981",
  Freelance: "#06B6D4",
  Investment: "#8B5CF6",
  Other: "#6B7280",
};

export const CATEGORY_ICONS = {
  "Food & Dining": "🍜",
  Transportation: "🚗",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Healthcare: "💊",
  Housing: "🏠",
  Utilities: "⚡",
  Education: "📚",
  Travel: "✈️",
  Salary: "💰",
  Freelance: "💻",
  Investment: "📈",
  Other: "📦",
};

let idCounter = 1;
const mkId = () => String(idCounter++);

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateTransactions = () => {
  const txns = [];
  const now = new Date(2025, 2, 31); // March 31 2025

  // 6 months of data
  for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
    const month = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);

    // Salary
    txns.push({
      id: mkId(),
      date: new Date(month.getFullYear(), month.getMonth(), 1).toISOString(),
      description: "Monthly Salary",
      category: "Salary",
      type: "income",
      amount: rand(78000, 82000) / 100,
    });

    // Freelance some months
    if (monthOffset % 2 === 0) {
      txns.push({
        id: mkId(),
        date: new Date(month.getFullYear(), month.getMonth(), rand(5, 15)).toISOString(),
        description: "Freelance Project",
        category: "Freelance",
        type: "income",
        amount: rand(15000, 35000) / 100,
      });
    }

    // Investment returns
    txns.push({
      id: mkId(),
      date: new Date(month.getFullYear(), month.getMonth(), rand(1, 28)).toISOString(),
      description: "Investment Returns",
      category: "Investment",
      type: "income",
      amount: rand(2000, 8000) / 100,
    });

    // Housing
    txns.push({
      id: mkId(),
      date: new Date(month.getFullYear(), month.getMonth(), 1).toISOString(),
      description: "Rent Payment",
      category: "Housing",
      type: "expense",
      amount: rand(14000, 15000) / 100,
    });

    // Utilities
    txns.push({
      id: mkId(),
      date: new Date(month.getFullYear(), month.getMonth(), rand(3, 7)).toISOString(),
      description: pick(["Electricity Bill", "Water Bill", "Internet Bill"]),
      category: "Utilities",
      type: "expense",
      amount: rand(1500, 4000) / 100,
    });

    // Food
    for (let i = 0; i < rand(6, 12); i++) {
      txns.push({
        id: mkId(),
        date: new Date(month.getFullYear(), month.getMonth(), rand(1, 28)).toISOString(),
        description: pick(["Grocery Store", "Restaurant", "Food Delivery", "Café", "Lunch"]),
        category: "Food & Dining",
        type: "expense",
        amount: rand(800, 6000) / 100,
      });
    }

    // Transportation
    for (let i = 0; i < rand(3, 6); i++) {
      txns.push({
        id: mkId(),
        date: new Date(month.getFullYear(), month.getMonth(), rand(1, 28)).toISOString(),
        description: pick(["Uber", "Gas Station", "Metro Pass", "Parking"]),
        category: "Transportation",
        type: "expense",
        amount: rand(500, 4000) / 100,
      });
    }

    // Shopping
    for (let i = 0; i < rand(2, 5); i++) {
      txns.push({
        id: mkId(),
        date: new Date(month.getFullYear(), month.getMonth(), rand(1, 28)).toISOString(),
        description: pick(["Amazon", "Nike Store", "Electronics", "Clothing Store", "Online Shopping"]),
        category: "Shopping",
        type: "expense",
        amount: rand(2000, 15000) / 100,
      });
    }

    // Entertainment
    for (let i = 0; i < rand(2, 4); i++) {
      txns.push({
        id: mkId(),
        date: new Date(month.getFullYear(), month.getMonth(), rand(1, 28)).toISOString(),
        description: pick(["Netflix", "Spotify", "Cinema", "Gaming", "Concert Tickets"]),
        category: "Entertainment",
        type: "expense",
        amount: rand(500, 5000) / 100,
      });
    }

    // Healthcare (occasional)
    if (rand(0, 1)) {
      txns.push({
        id: mkId(),
        date: new Date(month.getFullYear(), month.getMonth(), rand(1, 28)).toISOString(),
        description: pick(["Pharmacy", "Doctor Visit", "Gym Membership"]),
        category: "Healthcare",
        type: "expense",
        amount: rand(1000, 8000) / 100,
      });
    }

    // Education (occasional)
    if (rand(0, 1)) {
      txns.push({
        id: mkId(),
        date: new Date(month.getFullYear(), month.getMonth(), rand(1, 28)).toISOString(),
        description: pick(["Online Course", "Books", "Workshop"]),
        category: "Education",
        type: "expense",
        amount: rand(2000, 12000) / 100,
      });
    }
  }

  return txns.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const INITIAL_TRANSACTIONS = generateTransactions();
