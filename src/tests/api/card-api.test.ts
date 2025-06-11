import {activateCard, addCard, cardInformation, deactivateCard, getListofCard, updateCard} from "common/api/card-api";
import {GeneralCard} from "../../common/model";
import MockAdapter from "axios-mock-adapter";
import api from "../../common/api/axios";


const mock = new MockAdapter(api);

const createMockCard = (overrides: Partial<GeneralCard>): GeneralCard => ({
    id: "",
    cardId: "",
    holder: "",
    companyName: "",
    codePin: "",
    holderPassword: "",
    cardGroupName: "",
    actif: false,
    expirationDate: "",
    ...overrides
});

    describe("Card API Service", () => {
        afterEach(() => {
            mock.reset();
        });

        describe("getListofCard", () => {

            it("should fetch cards with filters", async () => {
                const customerId = 123;
                const filters = {
                    customerId,
                    cardId: "1",
                    holder: "John",
                    actif: "true", // Changed from boolean to string
                    expirationDate: "2025-12-31",
                };
                const mockCards: GeneralCard[] = [
                    createMockCard({ id: "1", holder: "John Doe", actif: true, expirationDate: "2025-12-31" })
                ];

                mock.onGet(`/customer/${customerId}/card/filter?cardId=1&holder=John&actif=true&expirationDate=2025-12-31`)
                    .reply(200, mockCards);

                const result = await getListofCard(filters);
                expect(result).toEqual(mockCards);
            });
            it("should handle errors", async () => {
                const customerId = 123;
                mock.onGet(`/customer/${customerId}/card`).reply(500);

                await expect(getListofCard({ customerId })).rejects.toThrow();
            });
        });

    describe("addCard", () => {
        it("should add a new card", async () => {
            const customerId = "123";
            const newCard: GeneralCard = {
                cardGroupName: "", cardId: "", codePin: "", companyName: "", holderPassword: "",
                id: "3",
                holder: "New User",
                actif: true,
                expirationDate: "2026-01-01"
            };
            const responseCard = { ...newCard, id: "3" };

            mock.onPost(`/customer/${customerId}/card/add`, newCard)
                .reply(200, responseCard);

            const result = await addCard(customerId, newCard);
            expect(result).toEqual(responseCard);
        });

        it("should handle errors when adding card", async () => {
            const customerId = "123";
            const newCard: GeneralCard = {
                cardGroupName: "", cardId: "", codePin: "", companyName: "", holderPassword: "",
                id: "3",
                holder: "New User",
                actif: true,
                expirationDate: "2026-01-01"
            };

            mock.onPost(`/customer/${customerId}/card/add`, newCard)
                .reply(400);

            await expect(addCard(customerId, newCard)).rejects.toThrow();
        });
    });

    describe("updateCard", () => {
        it("should update an existing card", async () => {
            const customerId = "123";
            const updatedCard: GeneralCard = {
                cardGroupName: "", cardId: "", codePin: "", companyName: "", holderPassword: "",
                id: "1",
                holder: "Updated Name",
                actif: true,
                expirationDate: "2025-12-31"
            };

            mock.onPut(`/customer/${customerId}/card/update`, updatedCard)
                .reply(200, updatedCard);

            const result = await updateCard(customerId, updatedCard);
            expect(result).toEqual(updatedCard);
        });

        it("should handle errors when updating card", async () => {
            const customerId = "123";
            const updatedCard: GeneralCard = {
                cardGroupName: "", cardId: "", codePin: "", companyName: "", holderPassword: "",
                id: "1",
                holder: "Updated Name",
                actif: true,
                expirationDate: "2025-12-31"
            };

            mock.onPut(`/customer/${customerId}/card/update`, updatedCard)
                .reply(404);

            await expect(updateCard(customerId, updatedCard)).rejects.toThrow();
        });
    });

    describe("cardInformation", () => {
        it("should fetch card information", async () => {
            const customerId = 123;
            const cardId = 1;
            const mockCard: GeneralCard = {
                cardGroupName: "", cardId: "", codePin: "", companyName: "", holderPassword: "",
                id: "1",
                holder: "John Doe",
                actif: true,
                expirationDate: "2025-12-31"
            };

            mock.onGet(`/customer/${customerId}/card/${cardId}`)
                .reply(200, mockCard);

            const result = await cardInformation(cardId, customerId);
            expect(result).toEqual(mockCard);
        });

        it("should handle errors when fetching card information", async () => {
            const customerId = 123;
            const cardId = 999;

            mock.onGet(`/customer/${customerId}/card/${cardId}`)
                .reply(404);

            await expect(cardInformation(cardId, customerId)).rejects.toThrow();
        });
    });

    describe("activateCard", () => {
        it("should activate a card", async () => {
            const customerId = 123;
            const cardId = "1";
            const response = { success: true };

            mock.onPost(`/customer/${customerId}/card/activate/${cardId}`)
                .reply(200, response);

            const result = await activateCard(customerId, cardId);
            expect(result).toEqual(response);
        });

        it("should handle errors when activating card", async () => {
            const customerId = 123;
            const cardId = "1";

            mock.onPost(`/customer/${customerId}/card/activate/${cardId}`)
                .reply(400);

            await expect(activateCard(customerId, cardId)).rejects.toThrow();
        });
    });

    describe("deactivateCard", () => {
        it("should deactivate a card", async () => {
            const customerId = 123;
            const cardId = "1";
            const response = { success: true };

            mock.onPost(`/customer/${customerId}/card/deactivate/${cardId}`)
                .reply(200, response);

            const result = await deactivateCard(customerId, cardId);
            expect(result).toEqual(response);
        });

        it("should handle errors when deactivating card", async () => {
            const customerId = 123;
            const cardId = "1";

            mock.onPost(`/customer/${customerId}/card/deactivate/${cardId}`)
                .reply(400);

            await expect(deactivateCard(customerId, cardId)).rejects.toThrow();
        });
    });
});