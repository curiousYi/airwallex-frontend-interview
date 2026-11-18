import React, { useEffect, useRef, useState } from "react";

const styles: Record<string, React.CSSProperties> = {
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    maxWidth: 480,
    fontFamily: "system-ui, sans-serif",
    fontSize: 14,
  },
  label: {
    fontWeight: 600,
  },
  input: {
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: 4,
    fontSize: 14,
  },
};

type ReceiptSearchBarProps = {
  onSearch: (term: string) => void;
  /** Debounce delay in ms before `onSearch` fires. */
  delay?: number;
};

export default function ReceiptSearchBar({
  onSearch,
  delay = 200,
}: ReceiptSearchBarProps) {
  // The input updates immediately; only the callback to the parent is debounced.
  const [value, setValue] = useState("");

  // Keep the latest callback in a ref so a new function identity from the
  // parent doesn't restart the debounce timer.
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  // Skip the initial mount: the parent already starts with an empty term.
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const timeoutId = setTimeout(() => onSearchRef.current(value), delay);
    // Cancels the pending call on the next keystroke and on unmount.
    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return (
    <div style={styles.field}>
      <label htmlFor="receipt-search" style={styles.label}>
        Search
      </label>
      <input
        id="receipt-search"
        type="search"
        placeholder="Filter by name"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        style={styles.input}
      />
    </div>
  );
}
