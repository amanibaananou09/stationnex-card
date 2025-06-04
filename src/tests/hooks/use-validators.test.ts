import { renderHook } from '@testing-library/react-hooks';
import { useTranslation } from 'react-i18next';
import { useESSContext } from 'store/ESSContext';
import useValidators from "../../hooks/use-validators";

// Mock dependencies
jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
}));
jest.mock('store/ESSContext', () => ({
    useESSContext: jest.fn(),
}));

describe('useValidators', () => {
    const mockT = jest.fn();

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Mock translation function
        (useTranslation as jest.Mock).mockReturnValue({ t: mockT });

        // Mock ESS context
        (useESSContext as jest.Mock).mockReturnValue({ stationId: 1 });
    });

    it('validates name correctly', async () => {
        mockT.mockImplementation((key) => key); // Return key as message for simplicity

        const { result } = renderHook(() => useValidators());

        const validName = 'John';
        const invalidName = '';

        const validResult = await result.current.nameValidator(validName);
        const invalidResult = await result.current.nameValidator(invalidName);

        expect(validResult).toBe(true);
        expect(invalidResult).toContain('validation.name.required');
    });

    it('validates firstName correctly', async () => {
        mockT.mockImplementation((key) => key);
        const { result } = renderHook(() => useValidators());

        const validFirstName = 'John';
        const invalidFirstName = 'Jo';

        const resultValid = await result.current.firstNameValidator(validFirstName);
        const resultInvalid = await result.current.firstNameValidator(invalidFirstName);

        expect(resultValid).toBe(true);
        expect(resultInvalid).toContain('validation.firstName.min');
    });

    it('validates phone number', async () => {
        mockT.mockImplementation((key) => key);
        const { result } = renderHook(() => useValidators());

        const validPhone = '1234567890';
        const invalidPhone = '12345';

        const resultValid = await result.current.phoneValidator(validPhone);
        const resultInvalid = await result.current.phoneValidator(invalidPhone);

        expect(resultValid).toBe(true);
        expect(resultInvalid).toContain('validation.phone.min');
    });

    it('validates address', async () => {
        mockT.mockImplementation((key) => key);
        const { result } = renderHook(() => useValidators());

        const validAddress = '123 Main St';
        const invalidAddress = 'ab';

        const resultValid = await result.current.addressValidator(validAddress);
        const resultInvalid = await result.current.addressValidator(invalidAddress);

        expect(resultValid).toBe(true);
        expect(resultInvalid).toContain('validation.address.min');
    });

    it('validates rotationName', async () => {
        mockT.mockImplementation((key) => key);
        const { result } = renderHook(() => useValidators());

        const validRotation = 'Rotation 1';
        const invalidRotation = 'Ro';

        const resultValid = await result.current.rotationNameValidator(validRotation);
        const resultInvalid = await result.current.rotationNameValidator(invalidRotation);

        expect(resultValid).toBe(true);
        expect(resultInvalid).toContain('validation.rotation.min');
    });

    it('validates start and end validity dates', async () => {
        mockT.mockImplementation((key) => key);
        const { result } = renderHook(() => useValidators());

        const validDate = new Date().toISOString();
        const invalidDate = '';

        const startResult = await result.current.startValidityDateValidator(validDate);
        const endResult = await result.current.endValidityDateValidator(invalidDate);

        expect(startResult).toBe(true);
        expect(endResult).toContain('validation.date.required');
    });

    it('validates postName', async () => {
        mockT.mockImplementation((key) => key);
        const { result } = renderHook(() => useValidators());

        const validPost = 'Post A';
        const invalidPost = '';

        const validResult = await result.current.postNameValidator(validPost);
        const invalidResult = await result.current.postNameValidator(invalidPost);

        expect(validResult).toBe(true);
        expect(invalidResult).toContain('validation.post.required');
    });

    it('validates starting and ending time', async () => {
        mockT.mockImplementation((key) => key);
        const { result } = renderHook(() => useValidators());

        const validTime = '08:00';
        const invalidTime = '';

        const startTimeResult = await result.current.startingTimeValidator(validTime);
        const endTimeResult = await result.current.endingTimeValidator(invalidTime);

        expect(startTimeResult).toBe(true);
        expect(endTimeResult).toContain('validation.endingTime.required');
    });
});