export type DrhpStatus = "not_filed" | "filed" | "approved";

export type FinancialItem = { label: string; value: string };
export type ShareholdingItem = { category: string; percent: number };

export type Share = {
  id: string;
  name: string;
  slug: string;
  isin: string | null;
  sector: string;
  drhp_status: DrhpStatus;
  lot_size: number;
  indicative_price: number;
  logo_url: string | null;
  featured: boolean;
  overview: string;
  financials: FinancialItem[];
  shareholding: ShareholdingItem[];
  created_at: string;
  updated_at: string;
};

export type PricePoint = { price: number; recorded_at: string };

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type EnquiryType = "share_enquiry" | "sell_esop" | "contact";

export type Lead = {
  id: string;
  created_at: string;
  enquiry_type: EnquiryType;
  name: string;
  phone: string;
  email: string | null;
  share_id: string | null;
  company_name: string | null;
  quantity: string | null;
  message: string | null;
  source: string | null;
  page_path: string | null;
};
