import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import MorePage from "../page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock next/link
jest.mock("next/link", () => {
  const Link = ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  );
  Link.displayName = "Link";
  return Link;
});

describe("MorePage", () => {
  const mockLinks = [
    { name: "All Accounts", href: "/accounts" },
    { name: "Transaction History", href: "/transactions" },
    { name: "Profile", href: "/profile" },
    { name: "Send Money", href: "/send" },
    { name: "Friends", href: "/friends" },
  ];

  beforeEach(() => {
    // Reset the mock before each test
    (usePathname as jest.Mock).mockReset();
  });

  it("displays header and description", () => {
    (usePathname as jest.Mock).mockReturnValue("/more");
    render(<MorePage />);

    expect(screen.getByText("More")).toBeInTheDocument();
    expect(
      screen.getByText("Quick access to all your account features")
    ).toBeInTheDocument();
  });

  it("displays account management section", () => {
    (usePathname as jest.Mock).mockReturnValue("/more");
    render(<MorePage />);

    expect(screen.getByText("Account Management")).toBeInTheDocument();
    mockLinks.forEach((link) => {
      expect(screen.getByText(link.name)).toBeInTheDocument();
    });
  });

  it("highlights active link based on current path", () => {
    // Set up the pathname mock before rendering
    (usePathname as jest.Mock).mockReturnValue("/transactions");

    // Render the component
    render(<MorePage />);

    // Get all links
    const links = screen.getAllByRole("link");

    // Find the active link by href
    const activeLink = links.find(
      (link) => link.getAttribute("href") === "/transactions"
    );
    const inactiveLink = links.find(
      (link) => link.getAttribute("href") === "/profile"
    );

    // Debug output
    console.log("Active link element:", activeLink?.outerHTML);
    console.log("Active link classes:", activeLink?.className);
    console.log("Inactive link element:", inactiveLink?.outerHTML);
    console.log("Inactive link classes:", inactiveLink?.className);

    // Check if the active link has the correct classes
    expect(activeLink).toHaveClass("bg-purple-50");
    expect(activeLink).toHaveClass("text-purple-600");

    // Check if the inactive link does not have the active classes
    expect(inactiveLink).not.toHaveClass("bg-purple-50");
    expect(inactiveLink).not.toHaveClass("text-purple-600");
  });

  it("renders all links with correct hrefs", () => {
    (usePathname as jest.Mock).mockReturnValue("/more");
    render(<MorePage />);

    mockLinks.forEach((link) => {
      const linkElement = screen.getByText(link.name).closest("a");
      expect(linkElement).toHaveAttribute("href", link.href);
    });
  });

  it("renders chevron icons for all links", () => {
    (usePathname as jest.Mock).mockReturnValue("/more");
    render(<MorePage />);

    const chevronIcons = screen.getAllByTestId("chevron-icon");
    expect(chevronIcons).toHaveLength(mockLinks.length);
    chevronIcons.forEach((icon) => {
      expect(icon).toHaveClass("w-5", "h-5");
    });
  });
});
