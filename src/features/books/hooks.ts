import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAuthor,
  createBookType,
  createPublisher,
  deleteAuthor,
  deleteBookType,
  deletePublisher,
  getAuthor,
  getAuthors,
  getBook,
  getBooks,
  getBookType,
  getBookTypes,
  getPublisher,
  getPublishers,
  updateAuthor,
  updateBookType,
  updatePublisher,
} from "@/services/book.service";
import type {
  BookAuthorPayload,
  BookPublisherPayload,
  BookTypePayload,
} from "@/types/books";
import { bookKeys } from "@/features/books/keys";

export function useBooks() {
  return useQuery({
    queryKey: bookKeys.list(),
    queryFn: getBooks,
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: () => getBook(id),
    enabled: Boolean(id),
  });
}

export function useBookTypes(query?: string) {
  return useQuery({
    queryKey: bookKeys.types(query),
    queryFn: () => getBookTypes(query),
  });
}

export function useBookType(id: string) {
  return useQuery({
    queryKey: bookKeys.typeDetail(id),
    queryFn: () => getBookType(id),
    enabled: Boolean(id),
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BookTypePayload) => createBookType(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: bookKeys.types() });
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BookTypePayload & { id: string }) =>
      updateBookType(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: bookKeys.types() });
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBookType(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: bookKeys.types() });
    },
  });
}

export function useAuthors(query?: string) {
  return useQuery({
    queryKey: bookKeys.authors(query),
    queryFn: () => getAuthors(query),
  });
}

export function useAuthor(id: string) {
  return useQuery({
    queryKey: bookKeys.authorDetail(id),
    queryFn: () => getAuthor(id),
    enabled: Boolean(id),
  });
}

export function useCreateAuthor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BookAuthorPayload) => createAuthor(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: bookKeys.authors() });
    },
  });
}

export function useUpdateAuthor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BookAuthorPayload & { id: string }) =>
      updateAuthor(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: bookKeys.authors() });
    },
  });
}

export function useDeleteAuthor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAuthor(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: bookKeys.authors() });
    },
  });
}

export function usePublishers(query?: string) {
  return useQuery({
    queryKey: bookKeys.publishers(query),
    queryFn: () => getPublishers(query),
  });
}

export function usePublisher(id: string) {
  return useQuery({
    queryKey: bookKeys.publisherDetail(id),
    queryFn: () => getPublisher(id),
    enabled: Boolean(id),
  });
}

export function useCreatePublisher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BookPublisherPayload) => createPublisher(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: bookKeys.publishers() });
    },
  });
}

export function useUpdatePublisher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BookPublisherPayload & { id: string }) =>
      updatePublisher(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: bookKeys.publishers() });
    },
  });
}

export function useDeletePublisher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePublisher(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: bookKeys.publishers() });
    },
  });
}
