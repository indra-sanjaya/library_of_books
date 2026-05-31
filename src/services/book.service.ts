import api from "@/services/api";
import type { ApiResponse } from "@/types/api";
import type {
  Book,
  BookAuthor,
  BookPublisher,
  BookType,
  BookTypePayload,
  BookAuthorPayload,
  BookPublisherPayload,
} from "@/types/books";

export async function getBooks() {
  const { data } = await api.get<ApiResponse<Book[]>>("/buku");
  return data;
}

export async function getBook(id: string) {
  const { data } = await api.get<ApiResponse<Book>>(`/buku/${id}`);
  return data;
}

export async function getBookTypes(query?: string) {
  const { data } = await api.get<ApiResponse<BookType[]>>(
    "/admin/buku/jenbuk",
    {
      params: query ? { q: query } : undefined,
    },
  );
  return data;
}

export async function getBookType(id: string) {
  const { data } = await api.get<ApiResponse<BookType>>(
    `/admin/buku/jenbuk/${id}`,
  );
  return data;
}

export async function createBookType(payload: BookTypePayload) {
  const { data } = await api.post<ApiResponse<BookType>>(
    "/admin/buku/jenbuk/create",
    payload,
  );
  return data;
}

export async function updateBookType(
  payload: BookTypePayload & { id: string },
) {
  const { data } = await api.put<ApiResponse<BookType>>(
    "/admin/buku/jenbuk/update",
    payload,
  );
  return data;
}

export async function deleteBookType(id: string) {
  const { data } = await api.delete<ApiResponse<null>>(
    "/admin/buku/jenbuk/delete",
    {
      data: { id },
    },
  );
  return data;
}

export async function getAuthors(query?: string) {
  const { data } = await api.get<ApiResponse<BookAuthor[]>>(
    "/admin/buku/author",
    {
      params: query ? { q: query } : undefined,
    },
  );
  return data;
}

export async function getAuthor(id: string) {
  const { data } = await api.get<ApiResponse<BookAuthor>>(
    `/admin/buku/author/${id}`,
  );
  return data;
}

export async function createAuthor(payload: BookAuthorPayload) {
  const { data } = await api.post<ApiResponse<BookAuthor>>(
    "/admin/buku/author/create",
    payload,
  );
  return data;
}

export async function updateAuthor(
  payload: BookAuthorPayload & { id: string },
) {
  const { data } = await api.put<ApiResponse<BookAuthor>>(
    "/admin/buku/author/update",
    payload,
  );
  return data;
}

export async function deleteAuthor(id: string) {
  const { data } = await api.delete<ApiResponse<null>>(
    "/admin/buku/author/delete",
    {
      data: { id },
    },
  );
  return data;
}

export async function getPublishers(query?: string) {
  const { data } = await api.get<ApiResponse<BookPublisher[]>>(
    "/admin/buku/penbuk",
    {
      params: query ? { q: query } : undefined,
    },
  );
  return data;
}

export async function getPublisher(id: string) {
  const { data } = await api.get<ApiResponse<BookPublisher>>(
    `/admin/buku/penbuk/${id}`,
  );
  return data;
}

export async function createPublisher(payload: BookPublisherPayload) {
  const { data } = await api.post<ApiResponse<BookPublisher>>(
    "/admin/buku/penbuk/create",
    payload,
  );
  return data;
}

export async function updatePublisher(
  payload: BookPublisherPayload & { id: string },
) {
  const { data } = await api.put<ApiResponse<BookPublisher>>(
    "/admin/buku/penbuk/update",
    payload,
  );
  return data;
}

export async function deletePublisher(id: string) {
  const { data } = await api.delete<ApiResponse<null>>(
    "/admin/buku/penbuk/delete",
    {
      data: { id },
    },
  );
  return data;
}
