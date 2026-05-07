
export interface Article {
  id: string;
  title: string;
  type: 'blog' | 'news';
  category: string;
  readTime: string;
  date: string;
  imageUrl?: string;
  categoryColor: string;
  url?: string;
  author?: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}
