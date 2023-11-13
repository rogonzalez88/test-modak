import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  API_VERSION: Joi.string().default('/api/v1'),
  REDIS_HOST: Joi.string().default('127.0.0.1'),
  RATE_LIMIT_STATUS_SECONDS: Joi.number().default(60),
  RATE_LIMIT_STATUS_LIMIT: Joi.number().default(2),
  RATE_LIMIT_NEWS_SECONDS: Joi.number().default(86400),
  RATE_LIMIT_NEWS_LIMIT: Joi.number().default(1),
  RATE_LIMIT_MARKETING_SECONDS: Joi.number().default(3600),
  RATE_LIMIT_MARKETING_LIMIT: Joi.number().default(3),
  RATE_LIMIT_DEFAULT_SECONDS: Joi.number().default(5),
  RATE_LIMIT_DEFAULT_LIMIT: Joi.number().default(1),
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  app: {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    apiRoot: envVars.API_VERSION,
  },
  notification: {
    rate: {
      status: {
        seconds: envVars.RATE_LIMIT_STATUS_SECONDS,
        limit: envVars.RATE_LIMIT_STATUS_LIMIT,
      },
      news: {
        seconds: envVars.RATE_LIMIT_NEWS_SECONDS,
        limit: envVars.RATE_LIMIT_NEWS_LIMIT,
      },
      marketing: {
        seconds: envVars.RATE_LIMIT_MARKETING_SECONDS,
        limit: envVars.RATE_LIMIT_MARKETING_LIMIT,
      },
      default: {
        seconds: envVars.RATE_LIMIT_DEFAULT_SECONDS,
        limit: envVars.RATE_LIMIT_DEFAULT_LIMIT,
      },
    },
  },
  redis: {
    host: envVars.REDIS_HOST,
  },
};

export default config;
