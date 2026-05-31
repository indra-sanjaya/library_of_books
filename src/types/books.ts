export type Book = {
  id_buku: string;
  isbn: string;
  id_kategori_buku: string;
  judul_buku: string;
  id_penulis_buku: string;
  id_penerbit_buku: string;
  tahun_terbit: string;
  stok_buku: number;
  rak_buku: string;
  deskripsi_buku: string;
  gambar_buku: string | null;
  kondisi_buku: string | null;
  created_at: string;
  updated_at: string;
};

export type BookType = {
  id: string;
  jenis_buku: string;
  deskripsi: string;
  updated_at: string;
};

export type BookAuthor = {
  id: string;
  penulis_buku: string;
  alamat: string;
  email_penulis: string;
  deskripsi: string;
  updated_at: string;
};

export type BookPublisher = {
  id: string;
  penerbit_buku: string;
  alamat_penerbit: string;
  telp_penerbit: string | null;
  email_penerbit: string;
  deskripsi: string | null;
  updated_at: string;
};

export type BookTypePayload = {
  jenis_buku: string;
  deskripsi: string;
};

export type BookAuthorPayload = {
  penulis_buku: string;
  alamat_penulis: string;
  email_penulis: string;
  deskripsi: string;
};

export type BookPublisherPayload = {
  penerbit_buku: string;
  alamat_penerbit: string;
  telp_penerbit: string;
  email_penerbit: string;
  deskripsi: string;
};
