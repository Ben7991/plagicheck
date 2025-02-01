import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import App from "./App";

describe("App.tsx", () => {
  it("should ensure that App component is rendered", () => {
    render(<App />);
    expect(screen.getByRole("heading")).toHaveTextContent("Testing");
  });
});
