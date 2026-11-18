import React from "react";

export type Entry = {
  id: string;
  name: string;
  amount: number;
};

const styles: Record<string, React.CSSProperties> = {
  table: {
    borderCollapse: "collapse",
    width: "100%",
    maxWidth: 480,
    fontFamily: "system-ui, sans-serif",
    fontSize: 14,
    border: "1px solid #ddd",
  },
  th: {
    textAlign: "left",
    padding: "8px 12px",
    backgroundColor: "#f5f5f5",
    borderBottom: "2px solid #ddd",
    fontWeight: 600,
  },
  td: {
    padding: "8px 12px",
    borderBottom: "1px solid #eee",
  },
  amount: {
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
  },
  stripedRow: {
    backgroundColor: "#fafafa",
  },
  footer: {
    padding: "8px 12px",
    fontWeight: 600,
    borderTop: "2px solid #ddd",
  },
};

type TableProps = {
  entries: Entry[];
  totalAmount: number;
};

export default function ReceiptTable({ entries, totalAmount }: TableProps) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Name</th>
          <th style={{ ...styles.th, ...styles.amount }}>Amount</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, index) => (
          <tr
            key={entry.id}
            style={index % 2 === 1 ? styles.stripedRow : undefined}
          >
            <td style={styles.td}>{entry.name}</td>
            <td style={{ ...styles.td, ...styles.amount }}>
              {entry.amount.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row" style={{ ...styles.footer, textAlign: "left" }}>
            Total
          </th>
          <td style={{ ...styles.footer, ...styles.amount }}>
            {totalAmount.toFixed(2)}
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
