// userApi.test.ts

import {login, updateUser, userProfile} from "common/api/auth-api";
import api from "common/api/axios";
import {GeneralUser} from "common/model";


jest.mock('common/api/axios');

describe('User API functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should call api.post with correct params and return data', async () => {
            const mockData = { token: '123abc' };
            (api.post as jest.Mock).mockResolvedValue({ data: mockData });

            const result = await login('testuser', 'password123');

            expect(api.post).toHaveBeenCalledWith('/login', {
                username: 'testuser',
                password: 'password123',
                admin: true,
            });
            expect(result).toEqual(mockData);
        });
    });

    describe('updateUser', () => {
        it('should call api.put with correct url and user data', async () => {
            const user: GeneralUser = {
                username: 'johndoe',
                phone: '123-456-7890',
                customerAccountId: "42",
            };
            const mockData = { success: true };
            (api.put as jest.Mock).mockResolvedValue({ data: mockData });

            const result = await updateUser(user);

            expect(api.put).toHaveBeenCalledWith('/user/updateContact', user);
            expect(result).toEqual(mockData);
        });
    });

    describe('userProfile', () => {
        it('should call api.get with correct URL and return data', async () => {
            const username = 'testuser';
            const mockData = { username, email: 'test@example.com' };
            (api.get as jest.Mock).mockResolvedValue({ data: mockData });

            const result = await userProfile(username);

            expect(api.get).toHaveBeenCalledWith('/user/profile?username=testuser');
            expect(result).toEqual(mockData);
        });

        it('should handle undefined username gracefully', async () => {
            const mockData = { username: undefined, email: 'test@example.com' };
            (api.get as jest.Mock).mockResolvedValue({ data: mockData });

            const result = await userProfile(undefined);

            expect(api.get).toHaveBeenCalledWith('/user/profile?username=undefined');
            expect(result).toEqual(mockData);
        });
    });
});