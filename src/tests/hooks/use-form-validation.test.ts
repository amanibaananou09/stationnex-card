import {renderHook} from '@testing-library/react-hooks';
import useFormValidation from "../../hooks/use-form-validation";

// Mock useTranslation
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key, // For simplicity, return the key itself
    }),
}));

describe('useFormValidation', () => {
    it('should return validation schemas with correct structure', () => {
        const { result } = renderHook(() => useFormValidation());

        const schemas = result.current;

        // Check that schemas are defined
        expect(schemas).toBeDefined();

        // Check specific schemas exist
        expect(schemas).toHaveProperty('editFuelGradeFormValidationSchema');
        expect(schemas).toHaveProperty('pumpTeamFormValidationSchema');
        expect(schemas).toHaveProperty('rotationFormValidationSchema');
        expect(schemas).toHaveProperty('editRotationFormValidationSchema');
        expect(schemas).toHaveProperty('signInFormValidationSchema');
        expect(schemas).toHaveProperty('fuelGradeFormValidationSchema');

        // Verify that 'name' field validation in 'editFuelGradeFormValidationSchema' is correct
        const schema = schemas.editFuelGradeFormValidationSchema;
        expect(schema).toHaveProperty('fields');
        // Because Yup schemas don't directly expose their shape, test by invoking validate
        // For that, you can test the schema validation with sample data

        // Example: validate with valid data
        expect(() => schema.validateSync({ name: 'Valid Name' })).not.toThrow();

        // Example: validate with invalid data
        expect(() => schema.validateSync({ name: '' })).toThrow();

        // Check that the error message matches the key (since t returns key)
        try {
            schema.validateSync({ name: '' });
        } catch (err) {
            const error = err as { errors?: string[] };
            expect(error.errors?.[0]).toContain('validation.name.min');
        }
    });

    it('should validate pumpTeamFormValidationSchema with at least one pump', () => {
        const { result } = renderHook(() => useFormValidation());
        const schema = result.current.pumpTeamFormValidationSchema;

        // Valid case
        expect(() => schema.validateSync({ name: 'Team', affectedPumpAttendant: [{ pumpId: 1, pumpAttendantId: 2 }] })).not.toThrow();

        // Invalid case: empty array
        expect(() => schema.validateSync({ name: 'Team', affectedPumpAttendant: [] })).toThrow();

        // Invalid case: missing pumpAttendantId in array
        expect(() => schema.validateSync({ name: 'Team', affectedPumpAttendant: [{ pumpId: 1, pumpAttendantId: null }] })).toThrow();
    });

    it('should validate rotationFormValidationSchema with required fields', () => {
        const { result } = renderHook(() => useFormValidation());
        const schema = result.current.rotationFormValidationSchema;

        // Valid data
        const validData = {
            name: 'Rotation1',
            startValidityDate: '2024-01-01',
            endValidityDate: '2024-12-31',
            shifts: [
                {
                    name: 'Shift1',
                    startingTime: '08:00',
                    endingTime: '16:00',
                },
            ],
        };

        expect(() => schema.validateSync(validData)).not.toThrow();

        // Invalid data: missing name
        expect(() => schema.validateSync({ ...validData, name: '' })).toThrow();

        // Invalid data: no shifts
        expect(() => schema.validateSync({ ...validData, shifts: [] })).toThrow();
    });

    it('should validate signInFormValidationSchema', () => {
        const { result } = renderHook(() => useFormValidation());
        const schema = result.current.signInFormValidationSchema;

        // Valid data
        expect(() => schema.validateSync({ username: 'user', password: 'pass' })).not.toThrow();

        // Invalid data: missing username
        expect(() => schema.validateSync({ username: '', password: 'pass' })).toThrow();

        // Invalid data: missing password
        expect(() => schema.validateSync({ username: 'user', password: '' })).toThrow();
    });

    it('should validate editFormValidationSchema', () => {
        const { result } = renderHook(() => useFormValidation());
        const schema = result.current.editFormValidationSchema;

        // Valid data
        expect(() => schema.validateSync({ pumpAttendantId: '123' })).not.toThrow();

        // Invalid data: missing pumpAttendantId
        expect(() => schema.validateSync({ pumpAttendantId: '' })).toThrow();
    });
});