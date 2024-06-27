import { useEffect, useState } from "react";
import { Transaction, TransactionCreteria } from "../common/model";
import { getAllTransaction } from "../common/api/configuration-api";
import { useAuth } from "../store/AuthContext";


const useAllTransactions = (
  initialCreteria: TransactionCreteria,
) => {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { customerId } = useAuth();

  useEffect(() => {
    const fetchAllTransactions = async () => {
      setIsLoading(true);
      let transactions: Transaction[] = [];
      let page = 0;
      let totalPages = 1;

      while (page < totalPages) {
        const { content, totalPages: tp } = await getAllTransaction(
          { ...initialCreteria, page },
          customerId
        );
        transactions = [...transactions, ...content];
        totalPages = tp;
        page += 1;
      }

      setAllTransactions(transactions);
      setIsLoading(false);
    };

    fetchAllTransactions();
  }, [initialCreteria,customerId]);

  return { allTransactions, isLoading };
};

export default useAllTransactions;
