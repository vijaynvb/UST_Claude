export interface ErrorResponseBody {
  error: {
    code: string;
    message: string;
    correlationId: string;
  };
}

export interface PaginationMetaDto {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
