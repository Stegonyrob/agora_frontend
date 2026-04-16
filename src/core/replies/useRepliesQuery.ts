import { IReply } from "@/core/replies/IReply";
import { IReplyDTO } from "@/core/replies/IReplyDTO";
import { ReplyService } from "@/core/replies/ReplyService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useReplies(commentId: number) {
  return useQuery<IReply[], Error>({
    queryKey: ["replies", commentId],
    queryFn: () => ReplyService.getByCommentId(commentId),
    staleTime: 0,
  });
}

export function useCreateReply(commentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: IReplyDTO) => ReplyService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", commentId] });
    },
  });
}

export function useUpdateReply(commentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: IReplyDTO }) =>
      ReplyService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", commentId] });
    },
  });
}

export function useDeleteReply(commentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ReplyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", commentId] });
    },
  });
}
