import { HttpError } from 'routing-controllers';
import HttpStatusCodes from 'http-status-codes';

export class RateLimitError extends HttpError {
  name = 'RateLimitError';

  constructor(message?: string) {
    super(HttpStatusCodes.TOO_MANY_REQUESTS);
    Object.setPrototypeOf(this, RateLimitError.prototype);

    if (message) this.message = message;
  }
}
