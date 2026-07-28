export interface Menu {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  discount?: number | null;
  image_url?: string | null;
  category: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}
