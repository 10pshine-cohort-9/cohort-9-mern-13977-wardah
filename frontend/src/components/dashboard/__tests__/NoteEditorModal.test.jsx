import { render, screen, fireEvent } from "@testing-library/react";
import NoteEditorModal from "../noteeditormodal";

// Mock react-quill-new to avoid JSDOM compatibility issues
jest.mock("react-quill-new", () => {
  return function MockQuill({ value, onChange, placeholder }) {
    return (
      <textarea
        data-testid="quill-editor"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };
});

describe("NoteEditorModal Component", () => {
  const defaultProps = {
    title: "Initial Title",
    content: "<p>Initial content</p>",
    modalError: "",
    isSaving: false,
    setTitle: jest.fn(),
    setContent: jest.fn(),
    onSave: jest.fn((e) => e.preventDefault()),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders inputs with title and content values", () => {
    render(<NoteEditorModal {...defaultProps} />);

    const titleInput = screen.getByPlaceholderText("Title");
    const editor = screen.getByTestId("quill-editor");

    expect(titleInput).toBeInTheDocument();
    expect(titleInput.value).toBe("Initial Title");
    expect(editor.value).toBe("<p>Initial content</p>");
  });

  it("calls setTitle on title input change", () => {
    render(<NoteEditorModal {...defaultProps} />);

    const titleInput = screen.getByPlaceholderText("Title");
    fireEvent.change(titleInput, { target: { value: "Updated Title" } });

    expect(defaultProps.setTitle).toHaveBeenCalledWith("Updated Title");
  });

  it("calls setContent on editor content change", () => {
    render(<NoteEditorModal {...defaultProps} />);

    const editor = screen.getByTestId("quill-editor");
    fireEvent.change(editor, { target: { value: "<p>Updated content</p>" } });

    expect(defaultProps.setContent).toHaveBeenCalledWith(
      "<p>Updated content</p>",
    );
  });

  it("displays modal error message when modalError is passed", () => {
    render(
      <NoteEditorModal {...defaultProps} modalError="Title cannot be empty" />,
    );

    expect(screen.getByText("Title cannot be empty")).toBeInTheDocument();
  });

  it("calls onSave when form is submitted", () => {
    render(<NoteEditorModal {...defaultProps} />);

    const saveBtn = screen.getByRole("button", { name: "Save" });
    fireEvent.click(saveBtn);

    expect(defaultProps.onSave).toHaveBeenCalled();
  });

  it("calls onClose when Cancel button is clicked or overlay is clicked", () => {
    render(<NoteEditorModal {...defaultProps} />);

    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelBtn);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);

    const overlay = screen
      .getByPlaceholderText("Title")
      .closest(".editor-overlay");
    fireEvent.click(overlay);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(2);
  });

  it('disables buttons and shows "Saving..." when isSaving is true', () => {
    render(<NoteEditorModal {...defaultProps} isSaving={true} />);

    const saveBtn = screen.getByRole("button", { name: "Saving..." });
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });

    expect(saveBtn).toBeDisabled();
    expect(cancelBtn).toBeDisabled();
  });
});
