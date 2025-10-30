import Redis from "ioredis";

export const redis = new Redis({
  host: "redis",
  port: 6379,
  db: 0,
  retryStrategy: times => Math.min(times * 50, 2000),
  maxRetriesPerRequest: 5,
  connectTimeout: 10000,
});

export const sub = new Redis({
  host: "redis",
  port: 6379,
  db: 0,
  retryStrategy: times => Math.min(times * 50, 2000)
});



