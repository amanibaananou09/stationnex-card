import {TransactionCreteria} from 'common/model';
import api from "common/api/axios";
import {getAllTransaction} from "common/api/configuration-api";

// Mock the axios module
jest.mock('common/api/axios');

describe('getAllTransaction', () => {
  const mockResponse = {
    data: {
      content: [
        { id: 1, amount: 100, description: 'Test transaction' },
      ],
      totalPages: 5,
      totalElements: 100,
      numberOfElements: 20,
    },
  };

  const mockCriteria: TransactionCreteria = {
    page: 0,
    size: 10,
    cardIds: [1, 2],
    salePointIds: [1, 2],
    productIds: [1, 2],
    city: ['Test City'],
    period: {
      from: '2023-01-01',
      to: '2023-01-31',
    },
  };

  const customerId = 123;

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    (api.post as jest.Mock).mockClear();
  });

  it('should make a POST request with correct parameters', async () => {
    (api.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getAllTransaction(mockCriteria, customerId);

    expect(api.post).toHaveBeenCalledWith(
        `/transaction?customerId=${customerId}&page=${mockCriteria.page}&size=${mockCriteria.size}`,
        {
          cardIds: mockCriteria.cardIds,
          salePointIds: mockCriteria.salePointIds,
          productIds: mockCriteria.productIds,
          city: mockCriteria.city,
          period: {
            from: mockCriteria.period.from,
            to: mockCriteria.period.to,
          },
        }
    );

    expect(result).toEqual(mockResponse.data);
  });

  it('should handle empty arrays by sending null', async () => {
    const emptyCriteria: TransactionCreteria = {
      ...mockCriteria,
      cardIds: [],
      salePointIds: [],
      productIds: [],
      city: [],
    };

    (api.post as jest.Mock).mockResolvedValue(mockResponse);

    await getAllTransaction(emptyCriteria, customerId);

    expect(api.post).toHaveBeenCalledWith(
        expect.any(String),
        {
          cardIds: null,
          salePointIds: null,
          productIds: null,
          city: null,
          period: {
            from: mockCriteria.period.from,
            to: mockCriteria.period.to,
          },
        }
    );
  });

  it('should handle undefined customerId', async () => {
    (api.post as jest.Mock).mockResolvedValue(mockResponse);

    await getAllTransaction(mockCriteria, undefined);

    expect(api.post).toHaveBeenCalledWith(
        `/transaction?customerId=undefined&page=${mockCriteria.page}&size=${mockCriteria.size}`,
        expect.any(Object)
    );
  });

  it('should throw an error when the API call fails', async () => {
    const errorMessage = 'Network Error';
    (api.post as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(getAllTransaction(mockCriteria, customerId)).rejects.toThrow(errorMessage);
  });

  it('should return the correct response structure', async () => {
    (api.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getAllTransaction(mockCriteria, customerId);

    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('totalPages');
    expect(result).toHaveProperty('totalElements');
    expect(result).toHaveProperty('numberOfElements');
    expect(Array.isArray(result.content)).toBe(true);
  });
});