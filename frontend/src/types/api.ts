export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    correlationId: string;
  };
}

export class ApiError extends Error {
  readonly code: string;
  readonly correlationId: string;
  readonly status: number;

  constructor(status: number, body: ApiErrorBody) {
    super(body.error.message);
    this.name = 'ApiError';
    this.code = body.error.code;
    this.correlationId = body.error.correlationId;
    this.status = status;
  }
}
