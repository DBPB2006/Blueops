const { z } = require('zod');

/**
 * Logical Connection Schema
 * Represents directed, technology-independent relationships between components.
 */

const ConnectionPurposeSchema = z.enum([
  'sends_requests',
  'reads_writes',
  'caches',
  'publishes_to',
  'consumes_from',
  'stores_objects'
]);

const ConnectionSchema = z.object({
  id: z.string().regex(/^[a-z0-9_-]{1,40}$/, 'Connection ID must be alphanumeric lowercase with dashes or underscores'),
  from: z.string().min(1, 'Source component ID is required'),
  to: z.string().min(1, 'Target component ID is required'),
  purpose: ConnectionPurposeSchema,
  reason: z.string().optional()
});

module.exports = {
  ConnectionPurposeSchema,
  ConnectionSchema
};
