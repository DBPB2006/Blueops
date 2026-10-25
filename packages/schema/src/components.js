const { z } = require('zod');

/**
 * Base Component Schema
 * Common fields shared across all logical architecture components.
 */
const BaseComponentSchema = z.object({
  id: z.string().regex(/^[a-z0-9_-]{1,32}$/, 'Component ID must be 1-32 alphanumeric characters with dashes or underscores'),
  label: z.string().min(1, 'Label cannot be empty').max(60, 'Label cannot exceed 60 characters'),
  reason: z.string().optional()
});

/**
 * Component Scaling Bounds
 * Preliminary availability check; full multi-AZ / target tolerance verified by validator & generator.
 */
const ReplicasSchema = z.object({
  min: z.number().int().min(1, 'min replicas must be at least 1'),
  max: z.number().int().min(1, 'max replicas must be at least 1')
}).refine((data) => data.max >= data.min, {
  message: 'replicas.max must be greater than or equal to replicas.min'
});

/**
 * 1. API Service (HTTP APIs, Express, FastAPI, NestJS)
 */
const ApiServiceComponentSchema = BaseComponentSchema.extend({
  kind: z.literal('api_service'),
  zone: z.enum(['public', 'private']),
  replicas: ReplicasSchema,
  config: z.object({
    runtime: z.string().min(1, 'Runtime is required'),
    port: z.number().int().min(1).max(65535, 'Port must be between 1 and 65535'),
    healthPath: z.string().startsWith('/', 'Health path must start with /'),
    buildCommand: z.string().optional(),
    startCommand: z.string().min(1, 'Start command is required'),
    envVars: z.array(z.string()).default([])
  })
});

/**
 * 2. Static Frontend (React SPA, Vue, Vite dist)
 */
const StaticFrontendComponentSchema = BaseComponentSchema.extend({
  kind: z.literal('static_frontend'),
  zone: z.literal('public'),
  config: z.object({
    runtime: z.literal('static'),
    buildCommand: z.string().min(1, 'Build command is required'),
    outputDir: z.string().min(1, 'Output directory is required'),
    envVars: z.array(z.string()).default([])
  })
});

/**
 * 3. Background Worker (Queued task consumer, cron processor)
 */
const BackgroundWorkerComponentSchema = BaseComponentSchema.extend({
  kind: z.literal('background_worker'),
  zone: z.literal('private'),
  replicas: ReplicasSchema,
  config: z.object({
    runtime: z.string().min(1, 'Runtime is required'),
    startCommand: z.string().min(1, 'Start command is required'),
    buildCommand: z.string().optional(),
    envVars: z.array(z.string()).default([])
  })
});

/**
 * 4. PostgreSQL Database
 */
const PostgresComponentSchema = BaseComponentSchema.extend({
  kind: z.literal('postgres'),
  zone: z.literal('private'), // strictly private
  config: z.object({
    version: z.string().min(1, 'Database version is required'),
    backup: z.object({
      enabled: z.boolean(),
      retentionDays: z.number().int().min(1, 'Retention days must be at least 1')
    })
  })
});

/**
 * 5. Redis Cache
 */
const RedisComponentSchema = BaseComponentSchema.extend({
  kind: z.literal('redis'),
  zone: z.literal('private'), // strictly private
  config: z.object({
    persistence: z.object({
      enabled: z.boolean()
    })
  })
});

/**
 * 6. Message Queue
 */
const QueueComponentSchema = BaseComponentSchema.extend({
  kind: z.literal('queue'),
  zone: z.literal('private'), // strictly private
  config: z.object({
    retentionSeconds: z.number().int().min(60, 'Retention seconds must be at least 60')
  })
});

/**
 * 7. Object Storage (S3, blob storage)
 */
const StorageBucketComponentSchema = BaseComponentSchema.extend({
  kind: z.literal('storage_bucket'),
  zone: z.enum(['public', 'private']),
  config: z.object({
    publicAccess: z.boolean()
  })
});

/**
 * Discriminated Union of all component types
 */
const ComponentSchema = z.discriminatedUnion('kind', [
  ApiServiceComponentSchema,
  StaticFrontendComponentSchema,
  BackgroundWorkerComponentSchema,
  PostgresComponentSchema,
  RedisComponentSchema,
  QueueComponentSchema,
  StorageBucketComponentSchema
]);

module.exports = {
  BaseComponentSchema,
  ReplicasSchema,
  ApiServiceComponentSchema,
  StaticFrontendComponentSchema,
  BackgroundWorkerComponentSchema,
  PostgresComponentSchema,
  RedisComponentSchema,
  QueueComponentSchema,
  StorageBucketComponentSchema,
  ComponentSchema
};
