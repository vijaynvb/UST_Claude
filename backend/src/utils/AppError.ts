export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(message: string, code = 'VALIDATION_ERROR'): AppError {
    return new AppError(400, code, message);
  }

  static unauthorized(message = 'Authentication is required to access this resource.'): AppError {
    return new AppError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(
    message = 'You do not have permission to access this resource.',
  ): AppError {
    return new AppError(403, 'FORBIDDEN', message);
  }

  static notFound(message = 'The requested resource does not exist.'): AppError {
    return new AppError(404, 'NOT_FOUND', message);
  }

  static conflict(message: string, code: string): AppError {
    return new AppError(409, code, message);
  }

  static unprocessable(message: string, code = 'INVALID_STATE_TRANSITION'): AppError {
    return new AppError(422, code, message);
  }

  static internal(message = 'An unexpected error occurred. Please try again later.'): AppError {
    return new AppError(500, 'INTERNAL_SERVER_ERROR', message);
  }
}
