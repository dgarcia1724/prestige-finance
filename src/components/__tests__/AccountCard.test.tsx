import { render, screen, fireEvent } from "@testing-library/react";
import AccountCard from "../AccountCard";
import { useRouter } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("AccountCard", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  const mockProps = {
    id: "1",
    type: "Checking Account",
    balance: 1000,
    accountNumber: "1234567890",
  };

  it("renders account information correctly", () => {
    render(<AccountCard {...mockProps} />);

    expect(screen.getByText("Checking Account")).toBeInTheDocument();
    expect(screen.getByText("•••• 7890")).toBeInTheDocument();
    expect(screen.getByText("$1,000.00")).toBeInTheDocument();
    expect(screen.getByText("Available")).toBeInTheDocument();
  });

  it("displays correct status for negative balance", () => {
    const negativeProps = {
      ...mockProps,
      balance: -1000,
    };
    render(<AccountCard {...negativeProps} />);

    expect(screen.getByText("Due")).toBeInTheDocument();
    expect(screen.getByText("$1,000.00")).toBeInTheDocument();
  });

  it("applies correct theme based on account type", () => {
    render(<AccountCard {...mockProps} />);

    // Check if the bottom gradient bar has the correct class
    const gradientBar = screen.getByTestId("gradient-bar");
    expect(gradientBar).toHaveClass("from-blue-600");
  });

  it("navigates to profile page when clicked", () => {
    render(<AccountCard {...mockProps} />);

    const card = screen.getByRole("button");
    fireEvent.click(card);

    expect(mockRouter.push).toHaveBeenCalledWith("/profile?id=1");
  });
});
