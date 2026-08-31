import { render, screen, fireEvent } from "@testing-library/react";
import TopAppBar from "../topappbar";

describe("TopAppBar Component", () => {
  const defaultProps = {
    user: { name: "Wardah", email: "wardah@example.com" },
    notesCount: 5,
    showSearchInput: false,
    searchTerm: "",
    setSearchTerm: jest.fn(),
    searchInputRef: { current: null },
    onToggleSearch: jest.fn(),
    isProfileOpen: false,
    setIsProfileOpen: jest.fn(),
    onLogout: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders logo and default action buttons", () => {
    render(<TopAppBar {...defaultProps} />);

    expect(screen.getByText("Notely")).toBeInTheDocument();
    expect(screen.getByTitle("Search")).toBeInTheDocument();
    expect(screen.getByTitle("Profile")).toBeInTheDocument();
    expect(screen.getByTitle("Logout")).toBeInTheDocument();
  });

  it("toggles search input visibility and accepts input", () => {
    render(
      <TopAppBar {...defaultProps} showSearchInput={true} searchTerm="React" />,
    );

    const searchInput = screen.getByPlaceholderText("Search notes...");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput.value).toBe("React");

    fireEvent.change(searchInput, { target: { value: "Node" } });
    expect(defaultProps.setSearchTerm).toHaveBeenCalledWith("Node");
  });

  it("calls onToggleSearch when search icon button is clicked", () => {
    render(<TopAppBar {...defaultProps} />);

    fireEvent.click(screen.getByTitle("Search"));
    expect(defaultProps.onToggleSearch).toHaveBeenCalledTimes(1);
  });

  it("toggles profile menu when profile button is clicked", () => {
    render(<TopAppBar {...defaultProps} isProfileOpen={false} />);

    fireEvent.click(screen.getByTitle("Profile"));
    expect(defaultProps.setIsProfileOpen).toHaveBeenCalledWith(true);
  });

  it("renders profile dropdown with user details and handles dropdown logout", () => {
    render(<TopAppBar {...defaultProps} isProfileOpen={true} />);

    expect(screen.getByText("Wardah")).toBeInTheDocument();
    expect(screen.getByText("wardah@example.com")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    const dropdownLogout = screen.getByRole("button", { name: /log out/i });
    fireEvent.click(dropdownLogout);
    expect(defaultProps.onLogout).toHaveBeenCalledTimes(1);
  });

  it("closes profile dropdown when clicking the backdrop", () => {
    const { container } = render(
      <TopAppBar {...defaultProps} isProfileOpen={true} />,
    );

    const backdrop = container.querySelector(".dropdown-invisible-backdrop");
    expect(backdrop).toBeInTheDocument();

    fireEvent.click(backdrop);
    expect(defaultProps.setIsProfileOpen).toHaveBeenCalledWith(false);
  });

  it("handles fallback values when user is undefined or missing name/email", () => {
    render(<TopAppBar {...defaultProps} user={null} isProfileOpen={true} />);

    expect(screen.getByText("U")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("No email available")).toBeInTheDocument();
  });

  it("calls onLogout when direct app bar logout icon is clicked", () => {
    render(<TopAppBar {...defaultProps} />);

    fireEvent.click(screen.getByTitle("Logout"));
    expect(defaultProps.onLogout).toHaveBeenCalledTimes(1);
  });
});
