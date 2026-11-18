import React, { useState, useMemo } from "react";
import ReceiptTableForm from "./ReceiptForm";
import Table from "./ReceiptTable";
import ReceiptSearchBar from "./ReceiptSearchBar";
import type { Entry } from "./ReceiptTable";

const INITIAL_ENTRIES: Entry[] = [
  { id: "1", name: "Coffee", amount: 4.5 },
  { id: "2", name: "Sandwich", amount: 9.25 },
  { id: "3", name: "Orange Juice", amount: 3.75 },
  { id: "4", name: "Croissant", amount: 3.2 },
  { id: "5", name: "Salad", amount: 11.0 },
];

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    maxWidth: 480,
  },
};

type EntriesState = {
  entries: Entry[];
  totalAmount: number;
};

// Runs once on load; after that the total is kept up to date incrementally.
function createInitialState(entries: Entry[]): EntriesState {
  return {
    entries,
    totalAmount: entries.reduce((sum, entry) => sum + entry.amount, 0),
  };
}

/**
 * Case-insensitive substring match on the entry name.
 * An empty (or whitespace-only) term returns every entry.
 */
export function filterEntries(entries: Entry[], term: string): Entry[] {
  const query = term.trim().toLowerCase();
  if (query === "") return entries;
  return entries.filter((entry) => entry.name.toLowerCase().includes(query));
}

export default function Entries() {
  const [{ entries, totalAmount }, setState] = useState<EntriesState>(() =>
    createInitialState(INITIAL_ENTRIES)
  );
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEntries = useMemo(
    () => filterEntries(entries, searchTerm),
    [entries, searchTerm]
  );

  function handleComplete(entry: Entry) {
    setState((previous) => ({
      entries: [...previous.entries, entry],
      totalAmount: previous.totalAmount + entry.amount,
    }));
  }
  const filteredTotal = filteredEntries.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  return (
    <div style={styles.container}>
      <ReceiptSearchBar onSearch={setSearchTerm} />
      <Table
        entries={filteredEntries}
        totalAmount={searchTerm ? filteredTotal : totalAmount}
      />
      <ReceiptTableForm onSubmit={handleComplete} />
    </div>
  );
}
