import {renderHook} from "@testing-library/react-hooks";
import {useSubscription} from "react-stomp-hooks";
import useRefresher from "../../hooks/use-refresher";

// Mock react-stomp-hooks
jest.mock("react-stomp-hooks", () => ({
    useSubscription: jest.fn(),
}));

describe("useRefresher hook", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("initial refresh state is false", () => {
        // Mock useSubscription to do nothing
        (useSubscription as jest.Mock).mockImplementation(() => {});

        const { result } = renderHook(() => useRefresher());

        expect(result.current.refresh).toBe(false);
    });

    test("toggles refresh state on multiple messages", () => {
        let callbackFn: () => void = () => {};
        (useSubscription as jest.Mock).mockImplementation((topic, callback) => {
            callbackFn = callback;
        });

        const { result } = renderHook(() => useRefresher());

        // Simulate first message
        callbackFn();
        expect(result.current.refresh).toBe(true);

        // Simulate second message
        callbackFn();
        expect(result.current.refresh).toBe(false);
    });
});