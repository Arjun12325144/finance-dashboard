import React, { useState, useEffect } from "react";
import useStore from "./store/useStore";
import Topnav from "./components/Topnav";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import Insights from "./components/Insights";
import TransactionModal from "./components/TransactionModal";
import TickerBar from "./components/TickerBar";

export default function App() {
  const { darkMode, activePage, modal } = useStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <>
      <Topnav />
      <TickerBar />
      <main className="page">
        {activePage === "dashboard"    && <Dashboard />}
        {activePage === "transactions" && <Transactions />}
        {activePage === "insights"     && <Insights />}
      </main>
      {modal && <TransactionModal />}
    </>
  );
}
