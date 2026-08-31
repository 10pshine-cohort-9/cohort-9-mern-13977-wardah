import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "../sidebar";

describe("Sidebar Component", () => {
  const defaultProps = {
    user: { name: "Wardah" },
    activeTab: "all",
    setActiveTab: jest.fn(),
    onOpenCreate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders workspace title with user name and default fallback", () => {
    const { rerender } = render(<Sidebar {...defaultProps} />);
    expect(screen.getByText("Wardah")).toBeInTheDocument();
    expect(screen.getByText("Personal Workspace")).toBeInTheDocument();

    rerender(<Sidebar {...defaultProps} user={null} />);
    expect(screen.getByText("My")).toBeInTheDocument();
  });

  it('calls onOpenCreate when "+ New Note" button is clicked', () => {
    render(<Sidebar {...defaultProps} />);

    const createBtn = screen.getByRole("button", { name: /\+ New Note/i });
    fireEvent.click(createBtn);

    expect(defaultProps.onOpenCreate).toHaveBeenCalledTimes(1);
  });

  it("switches tabs and calls setActiveTab on navigation click", () => {
    render(<Sidebar {...defaultProps} />);

    const starredTab = screen.getByRole("button", { name: /starred/i });
    fireEvent.click(starredTab);

    expect(defaultProps.setActiveTab).toHaveBeenCalledWith("starred");

    const notesTab = screen.getByRole("button", { name: /notes/i });
    fireEvent.click(notesTab);

    expect(defaultProps.setActiveTab).toHaveBeenCalledWith("all");
  });

  it("applies the active class according to activeTab prop", () => {
    const { rerender } = render(<Sidebar {...defaultProps} activeTab="all" />);
    const notesBtn = screen.getByRole("button", { name: /notes/i });
    const starredBtn = screen.getByRole("button", { name: /starred/i });

    expect(notesBtn.className).toContain("active");
    expect(starredBtn.className).not.toContain("active");

    rerender(<Sidebar {...defaultProps} activeTab="starred" />);
    expect(notesBtn.className).not.toContain("active");
    expect(starredBtn.className).toContain("active");
  });
});
