export type Post = {
  id: string;
  title: string;
  date: string;
  description: string;
  thumbnail: string;
  url: string;
  categories: string[];
};

export type DateRange = { start: string | null; end: string | null };
