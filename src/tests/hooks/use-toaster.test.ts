import { useToaster } from "../../hooks/use-toaster";

jest.mock("react-toastify", () => {
    return {
        toast: {
            success: jest.fn(),
            error: jest.fn(),
        },
        ToastPosition: {
            BOTTOM_LEFT: "bottom-left",
        },
    };
});

describe("useToaster", () => {
    const { toast } = require("react-toastify");

    it("should call toast.success with correct arguments", () => {
        const { success } = useToaster();

        const message = "Operation successful";
        const position = "top-right";

        success(message, position);

        expect(toast.success).toHaveBeenCalledWith(message, {
            position: position,
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "colored",
        });
    });

    it("should call toast.error with correct arguments", () => {
        const { error } = useToaster();

        const message = "Error occurred";
        const position = "bottom-center";

        error(message, position);

        expect(toast.error).toHaveBeenCalledWith(message, {
            position: position,
            autoClose: 15000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "colored",
        });
    });

    it("should use default position if none is provided", () => {
        const { success, error } = useToaster();

        success("Default position");

        expect(toast.success).toHaveBeenCalledWith(
            "Default position",
            expect.objectContaining({
                position: "bottom-left",
            }),
        );

        error("Default position error");

        expect(toast.error).toHaveBeenCalledWith(
            "Default position error",
            expect.objectContaining({
                position: "bottom-left",
            }),
        );
    });
});
