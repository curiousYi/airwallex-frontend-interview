import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Entries from "../Entries";

describe("Entries", () => {
  test("renders Entries", () => {
    render(<Entries />);
    expect(screen.getByText("Entries")).toBeInTheDocument();
  });
});
