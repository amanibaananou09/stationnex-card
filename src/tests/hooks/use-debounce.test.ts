import { renderHook } from '@testing-library/react-hooks';
import {useDebounce} from "../../hooks/use-debounce";

jest.useFakeTimers();

describe('useDebounce', () => {
    it('should debounce the value after the specified delay', () => {
        const initialValue = 'test';

        const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
            initialProps: { value: initialValue },
        });

        // Initially, debounced value should be the initial value
        expect(result.current).toBe(initialValue);

        // Update the value
        rerender({ value: 'new value' });

        // Immediately after change, debounced value should still be initial
        expect(result.current).toBe(initialValue);

        // Fast-forward time by 500ms
        jest.advanceTimersByTime(500);

        // Now, debounced value should update
        expect(result.current).toBe('new value');
    });

    it('should update immediately if delay is 0', () => {
        const { result, rerender } = renderHook(({ value }) => useDebounce(value, 0), {
            initialProps: { value: 'initial' },
        });

        expect(result.current).toBe('initial');

        rerender({ value: 'changed' });
        expect(result.current).toBe('initial');
    });
});