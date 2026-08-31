import { render, screen, fireEvent } from "@testing-library/react";
import NoteCard from "../notecard";

describe("NoteCard Component", () => {
  const mockNote = {
    _id: "note-123",
    title: "Meeting Notes",
    content: "<p>Discuss project roadmap</p>",
    isStarred: false,
    updatedAt: "2026-08-30T10:00:00.000Z",
  };

  const defaultProps = {
    note: mockNote,
    onEdit: jest.fn(),
    onToggleStar: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders note title and HTML body correctly", () => {
    render(<NoteCard {...defaultProps} />);

    expect(screen.getByText("Meeting Notes")).toBeInTheDocument();
    expect(screen.getByText("Discuss project roadmap")).toBeInTheDocument();
    expect(screen.getByTitle("Star note")).toBeInTheDocument();
    expect(screen.getByTitle("Delete Note")).toBeInTheDocument();
  });

  it("renders starred title when note isStarred is true", () => {
    const starredNote = { ...mockNote, isStarred: true };
    render(<NoteCard {...defaultProps} note={starredNote} />);

    expect(screen.getByTitle("Unstar note")).toBeInTheDocument();
  });

  it("calls onEdit when the note body area is clicked", () => {
    render(<NoteCard {...defaultProps} />);

    const editBtn = screen
      .getByText("Discuss project roadmap")
      .closest("button");
    fireEvent.click(editBtn);

    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockNote);
  });

  it("calls onToggleStar with event and note when star button is clicked", () => {
    render(<NoteCard {...defaultProps} />);

    const starBtn = screen.getByTitle("Star note");
    fireEvent.click(starBtn);

    expect(defaultProps.onToggleStar).toHaveBeenCalledTimes(1);
    expect(defaultProps.onToggleStar).toHaveBeenCalledWith(
      expect.any(Object),
      mockNote,
    );
  });

  it("calls onDelete with event and noteId when delete button is clicked", () => {
    render(<NoteCard {...defaultProps} />);

    const deleteBtn = screen.getByTitle("Delete Note");
    fireEvent.click(deleteBtn);

    expect(defaultProps.onDelete).toHaveBeenCalledTimes(1);
    expect(defaultProps.onDelete).toHaveBeenCalledWith(
      expect.any(Object),
      "note-123",
    );
  });
});
