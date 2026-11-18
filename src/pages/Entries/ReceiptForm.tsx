import React, { useReducer } from "react";
import type { Entry } from "./ReceiptTable";

// Same fields as Entry (minus id), but as raw strings from the inputs.
export type ReceiptFormValues = Record<keyof Omit<Entry, "id">, string>;

export type ReceiptFormErrors = Partial<
  Record<keyof ReceiptFormValues, string>
>;

/**
 * Validates raw form input. Returns an object of field -> error message.
 * An empty object means the input is valid.
 */
export function validateEntry(values: ReceiptFormValues): ReceiptFormErrors {
  const errors: ReceiptFormErrors = {};

  if (values.name.trim() === "") {
    errors.name = "Name is required.";
  }

  if (values.amount.trim() === "") {
    errors.amount = "Amount is required.";
  } else {
    const amount = Number(values.amount);
    if (!Number.isFinite(amount)) {
      errors.amount = "Amount must be a number.";
    }
  }

  return errors;
}

type FormState = {
  values: ReceiptFormValues;
  errors: ReceiptFormErrors;
};

type FormAction =
  | { type: "change"; field: keyof ReceiptFormValues; value: string }
  | { type: "invalid"; errors: ReceiptFormErrors }
  | { type: "reset" };

const INITIAL_STATE: FormState = {
  values: { name: "", amount: "" },
  errors: {},
};

// TO-DO:
//  Stylign - 1-line the form instead of having it be separate
//  Styling - have everything fit in 1-page.
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "change": {
      // Editing a field clears that field's error.
      const { [action.field]: _cleared, ...remainingErrors } = state.errors;
      return {
        values: { ...state.values, [action.field]: action.value },
        errors: remainingErrors,
      };
    }
    case "invalid":
      return { ...state, errors: action.errors };
    case "reset":
      return INITIAL_STATE;
  }
}

const styles: Record<string, React.CSSProperties> = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    maxWidth: 480,
    fontFamily: "system-ui, sans-serif",
    fontSize: 14,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
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
  inputError: {
    borderColor: "#d93025",
  },
  error: {
    color: "#d93025",
    fontSize: 12,
  },
  button: {
    alignSelf: "flex-start",
    padding: "8px 16px",
    border: "none",
    borderRadius: 4,
    backgroundColor: "#222",
    color: "#fff",
    fontSize: 14,
    cursor: "pointer",
  },
};

type ReceiptFormProps = {
  onSubmit: (entry: Entry) => void;
};

export default function ReceiptForm({ onSubmit }: ReceiptFormProps) {
  const [{ values, errors }, dispatch] = useReducer(formReducer, INITIAL_STATE);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    dispatch({ type: "change", field: name as keyof ReceiptFormValues, value });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateEntry(values);
    if (Object.keys(validationErrors).length > 0) {
      dispatch({ type: "invalid", errors: validationErrors });
      return;
    }

    onSubmit({
      id: crypto.randomUUID(),
      name: values.name.trim(),
      amount: Number(values.amount),
    });
    dispatch({ type: "reset" });
  }

  return (
    <form style={styles.form} onSubmit={handleSubmit} noValidate>
      <div style={styles.field}>
        <label htmlFor="receipt-name" style={styles.label}>
          Name
        </label>
        <input
          id="receipt-name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "receipt-name-error" : undefined}
          style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
        />
        {errors.name && (
          <span id="receipt-name-error" style={styles.error}>
            {errors.name}
          </span>
        )}
      </div>

      <div style={styles.field}>
        <label htmlFor="receipt-amount" style={styles.label}>
          Amount
        </label>
        <input
          id="receipt-amount"
          name="amount"
          type="number"
          step="0.01"
          value={values.amount}
          onChange={handleChange}
          aria-invalid={Boolean(errors.amount)}
          aria-describedby={errors.amount ? "receipt-amount-error" : undefined}
          style={{
            ...styles.input,
            ...(errors.amount ? styles.inputError : {}),
          }}
        />
        {errors.amount && (
          <span id="receipt-amount-error" style={styles.error}>
            {errors.amount}
          </span>
        )}
      </div>

      <button type="submit" style={styles.button}>
        Add entry
      </button>
    </form>
  );
}
