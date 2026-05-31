export const bookKeys = {
  all: ["books"] as const,
  list: () => [...bookKeys.all, "list"] as const,
  detail: (id: string) => [...bookKeys.all, "detail", id] as const,
  types: (q?: string) => [...bookKeys.all, "types", q ?? ""] as const,
  typeDetail: (id: string) => [...bookKeys.all, "type", id] as const,
  authors: (q?: string) => [...bookKeys.all, "authors", q ?? ""] as const,
  authorDetail: (id: string) => [...bookKeys.all, "author", id] as const,
  publishers: (q?: string) => [...bookKeys.all, "publishers", q ?? ""] as const,
  publisherDetail: (id: string) => [...bookKeys.all, "publisher", id] as const,
};
