import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useError } from "components/Dialog/ErrorDialog";
import { useToaster } from "hooks/use-toaster";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  children: ReactNode;
};

const QueryProvider = ({ children }: Props) => {
  const { t } = useTranslation();

  const { error } = useToaster();
  const { ErrorDialog, showError } = useError();

  const errorHandler = (serverError: any) => {
    console.error(serverError);

    let message;
    if (
      !serverError.response ||
      serverError.response.status == 500 ||
      serverError.response.status == 401
    ) {
      message = serverError.message;
      error(message);
    } else {
      message = serverError.response.data;
      showError({
        title: t("common.errorDialog.title"),
        message: message,
      });
    }
  };

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
        queryCache: new QueryCache({
          onError: errorHandler,
        }),
        mutationCache: new MutationCache({
          onError: errorHandler,
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorDialog />
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;
