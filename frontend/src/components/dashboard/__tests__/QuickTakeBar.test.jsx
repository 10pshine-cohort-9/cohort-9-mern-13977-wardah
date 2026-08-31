import { render, screen, fireEvent } from "@testing-library/react";
import QuickTakeBar from "../quicktakebar";

describe("QuickTakeBar Component", () => {
  it("renders placeholder text and action icons", () => {
    render(<QuickTakeBar onOpenCreate={jest.fn()} />);

    expect(screen.getByText("Take a note...")).toBeInTheDocument();
    expect(screen.getByTitle("Checklist")).toBeInTheDocument();
    expect(screen.getByTitle("Draw")).toBeInTheDocument();
    expect(screen.getByTitle("Image")).toBeInTheDocument();
  });

  it("triggers onOpenCreate when clicked", () => {
    const mockOnOpenCreate = jest.fn();
    render(<QuickTakeBar onOpenCreate={mockOnOpenCreate} />);

    const container = screen
      .getByText("Take a note...")
      .closest(".keep-take-note-box");
    fireEvent.click(container);

    expect(mockOnOpenCreate).toHaveBeenCalledTimes(1);
  });
});
