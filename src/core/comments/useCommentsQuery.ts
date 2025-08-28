import { CommentDTO } from "@/core/comments/CommentDTO";
import { CommentService } from "@/core/comments/CommentService";
import { IComment } from "@/core/comments/IComment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useComments(postId: number) {
  return useQuery<IComment[], Error>({
    queryKey: ["comments", postId],
    queryFn: () => CommentService.getByPostId(postId),
    staleTime: 0,
  });
}

export function useCreateComment(postId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CommentDTO) => CommentService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
}

export function useUpdateComment(postId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: CommentDTO }) =>
      CommentService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
}

export function useDeleteComment(postId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => CommentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
}
