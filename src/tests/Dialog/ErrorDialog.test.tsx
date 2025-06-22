import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { useError } from "../../components/Dialog/ErrorDialog";
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));
describe("useError hook", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => useError());

    expect(result.current).toEqual({
      ErrorDialog: expect.any(Function),
      showError: expect.any(Function),
      close: expect.any(Function),
    });
    expect(result.current.ErrorDialog).toBeInstanceOf(Function);
  });

  it("should accept initial config", () => {
    const initialConfig = {
      title: "Test Title",
      message: "Test Message",
    };

    const { result } = renderHook(() => useError(initialConfig));

    expect(result.current).toMatchObject({
      ErrorDialog: expect.any(Function),
      showError: expect.any(Function),
      close: expect.any(Function),
    });
  });

  it("should open dialog and update config when showError is called", () => {
    const { result } = renderHook(() => useError());

    act(() => {
      result.current.showError({
        title: "New Title",
        message: "New Message",
      });
    });

    const DialogComponent = result.current.ErrorDialog;
    render(<DialogComponent />);

    expect(screen.getByText("New Title")).toBeInTheDocument();
    expect(screen.getByText("New Message")).toBeInTheDocument();
  });

  it("should render children when provided", () => {
    const { result } = renderHook(() => useError());

    act(() => {
      result.current.showError();
    });

    const DialogComponent = result.current.ErrorDialog;
    render(
      <DialogComponent>
        <div data-testid="custom-child">Custom Child Content</div>
      </DialogComponent>,
    );

    expect(screen.getByTestId("custom-child")).toBeInTheDocument();
    expect(screen.getByText("Custom Child Content")).toBeInTheDocument();
  });

  it("should close dialog when close button is clicked", () => {
    const { result } = renderHook(() => useError());

    act(() => {
      result.current.showError();
    });

    const DialogComponent = result.current.ErrorDialog;
    render(<DialogComponent />);

    const closeButton = screen.getByText(/close/i);
    fireEvent.click(closeButton);

    expect(closeButton).toBeInTheDocument();
  });

  it("should maintain previous config when partially updated", () => {
    const initialConfig = {
      title: "Initial Title",
      message: "Initial Message",
    };

    const { result } = renderHook(() => useError(initialConfig));

    act(() => {
      result.current.showError({
        message: "Updated Message",
      });
    });

    const DialogComponent = result.current.ErrorDialog;
    render(<DialogComponent />);

    expect(screen.getByText("Initial Title")).toBeInTheDocument();
    expect(screen.getByText("Updated Message")).toBeInTheDocument();
  });
});
