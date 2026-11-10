import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ContactPage } from "../routes/contact";

describe("contact form validation", () => {
  it("does not show field errors before submit or blur", () => {
    render(<ContactPage />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-invalid",
      "false",
    );
  });

  it("shows one email error on blur and connects it accessibly", async () => {
    const user = userEvent.setup();
    render(<ContactPage />);
    const email = screen.getByLabelText("Email");

    await user.click(email);
    await user.tab();

    expect(screen.getAllByRole("alert")).toHaveLength(1);
    expect(screen.getByText("Enter a valid email address.")).toBeVisible();
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email.getAttribute("aria-describedby")?.split(" ")).toContain(
      "contact-email-error",
    );
  });

  it("shows validation errors after submit", async () => {
    const user = userEvent.setup();
    render(<ContactPage />);

    await user.click(screen.getByRole("button", { name: "Submit message" }));

    expect(screen.getByText("Enter your name.")).toBeVisible();
    expect(screen.getAllByText("Enter a valid email address.")).toHaveLength(1);
    expect(screen.getByText("Enter a message.")).toBeVisible();
  });
});
