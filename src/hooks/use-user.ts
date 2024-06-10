import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateUser, userProfile } from "../common/api/auth-api";

export const useUserByName = (username: string | undefined) => {
  const { data: profile, refetch } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => userProfile(username),
    enabled: !!username,
  });

  return {
    profile,
    refetch,
  };
};
export const useUserQueries = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: update } = useMutation({
    mutationFn: updateUser,
    onSuccess: (_, user) => {
      queryClient.invalidateQueries({
        queryKey: ["profile", user.id],
      });
    },
  });

  return {
    update,
  };
};
