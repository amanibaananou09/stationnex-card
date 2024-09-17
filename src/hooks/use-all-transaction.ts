import { Transaction, TransactionCreteria } from "../common/model";
import { getAllTransaction } from "../common/api/configuration-api";
import { useAuth } from "../store/AuthContext";
import { useQuery } from "@tanstack/react-query";

const fetchAllTransactions = async (
  initialCreteria: TransactionCreteria,
  customerId: number | undefined,
) => {
  let transactions: Transaction[] = [];
  let page = 0;
  let totalPages = 1;

  while (page < totalPages) {
    const { content, totalPages: tp } = await getAllTransaction(
      { ...initialCreteria, page },
      customerId,
    );
    transactions = [...transactions, ...content];
    totalPages = tp;
    page += 1;
  }

  return transactions;
};

const useAllTransactions = (initialCreteria: TransactionCreteria) => {
  const { customerId } = useAuth();
  const { data: allTransactions = [], isLoading } = useQuery({
    queryKey: ["allTransactions", initialCreteria, customerId],
    queryFn: () => fetchAllTransactions(initialCreteria, customerId),
    enabled: !!customerId,
  });

  return { allTransactions, isLoading };
};

export default useAllTransactions;
