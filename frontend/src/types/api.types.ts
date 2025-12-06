export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

export interface SearchFilters {
  query?: string;
  accountEmail?: string;
  folder?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
}
