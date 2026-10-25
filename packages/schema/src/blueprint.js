const { z } = require('zod');
const { RequirementsSchema } = require('./requirements');
const { ComponentSchema } = require('./components');
const { ConnectionSchema } = require('./connections');

/**
 * Blueprint Lifecycle Status
 * Represents the state of a revision in the backend persistence row.
 */
const BlueprintStatusSchema = z.enum([
  'draft',
  'validated',
  'approved',
  'deployed'
]);

/**
 * Canonical Blueprint Schema (Single Source of Truth)
 * Represents the technology-independent logical architecture (stored as JSONB definition).
 * 
 * Separates stable project identity (projectId) from immutable revision sequence (version).
 */
const BlueprintSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  version: z.number().int().min(1, 'Version must be a positive integer'),
  name: z.string().min(1, 'Name cannot be empty').max(100, 'Name cannot exceed 100 characters'),
  requirements: RequirementsSchema,
  components: z.array(ComponentSchema).min(1, 'Blueprint must contain at least one component'),
  connections: z.array(ConnectionSchema).default([])
}).superRefine((val, ctx) => {
  // Enforce unique component IDs structurally
  const seenIds = new Set();
  val.components.forEach((comp, idx) => {
    if (seenIds.has(comp.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate component ID '${comp.id}' found in blueprint`,
        path: ['components', idx, 'id']
      });
    }
    seenIds.add(comp.id);
  });
});

/**
 * Blueprint Revision Metadata Schema
 * Validates the backend database row / API record wrapping the canonical blueprint definition.
 */
const BlueprintRevisionMetadataSchema = z.object({
  id: z.string().min(1, 'Revision ID is required'),
  projectId: z.string().min(1, 'Project ID is required'),
  version: z.number().int().min(1, 'Version number is required'),
  status: BlueprintStatusSchema,
  definition: BlueprintSchema,
  approvedBy: z.string().optional().nullable(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional()
});

module.exports = {
  BlueprintSchema,
  BlueprintStatusSchema,
  BlueprintRevisionMetadataSchema
};
