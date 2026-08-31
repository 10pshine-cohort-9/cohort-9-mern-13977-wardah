import { render, screen } from "@testing-library/react";
import Toast from "../toast";

describe("Toast Component", () => {
  it("renders message when show is true", () => {
    render(
      <Toast show={true} message="Note created successfully" type="success" />,
    );

    expect(screen.getByText("Note created successfully")).toBeInTheDocument();
  });

  it("renders nothing when show is false", () => {
    const { container } = render(
      <Toast show={false} message="Note created successfully" type="info" />,
    );
    expect(container.firstChild).toBeNull();
  });
});
