import api from "../../common/api/axios";
import {
  forgotPassword,
  resetPassword,
} from "../../common/api/forgot-password-api";

jest.mock("../../common/api/axios");

describe("Auth API Functions", () => {
  const API_URL = "/user";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("forgotPassword", () => {
    it("should call POST /user/forgot-password with email", async () => {
      const mockEmail = "user@example.com";
      const mockResponse = { data: { message: "Email sent" } };

      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await forgotPassword(mockEmail);

      expect(api.post).toHaveBeenCalledTimes(1);
      expect(api.post).toHaveBeenCalledWith(
        `${API_URL}/forgot-password?email=${mockEmail}`,
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle errors", async () => {
      const mockEmail = "user@example.com";
      const mockError = new Error("Network error");

      (api.post as jest.Mock).mockRejectedValue(mockError);

      await expect(forgotPassword(mockEmail)).rejects.toThrow("Network error");
    });
  });

  describe("resetPassword", () => {
    it("should call PUT /user/reset-password with password and token", async () => {
      const mockPassword = "newPass123";
      const mockToken = "token123";
      const mockResponse = { data: { message: "Password updated" } };

      (api.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await resetPassword(mockPassword, mockToken);

      expect(api.put).toHaveBeenCalledTimes(1);
      expect(
        api.put,
      ).toHaveBeenCalledWith(
        `${API_URL}/reset-password?resetToken=${mockToken}`,
        { password: mockPassword },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle null token", async () => {
      const mockPassword = "newPass123";
      const mockResponse = { data: { message: "Password updated" } };

      (api.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await resetPassword(mockPassword, null);

      expect(
        api.put,
      ).toHaveBeenCalledWith(`${API_URL}/reset-password?resetToken=null`, {
        password: mockPassword,
      });
    });

    it("should handle reset password errors", async () => {
      const mockPassword = "newPass123";
      const mockToken = "token123";
      const mockError = new Error("Invalid token");

      (api.put as jest.Mock).mockRejectedValue(mockError);

      await expect(resetPassword(mockPassword, mockToken)).rejects.toThrow(
        "Invalid token",
      );
    });
  });
});
