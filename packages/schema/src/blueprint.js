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
  const seenComponentIds = new Set();
  val.components.forEach((comp, idx) => {
    if (seenComponentIds.has(comp.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate component ID '${comp.id}' found in blueprint`,
        path: ['components', idx, 'id']
      });
    }
    seenComponentIds.add(comp.id);
  });

  // Enforce unique connection IDs structurally
  const seenConnIds = new Set();
  val.connections.forEach((conn, idx) => {
    if (seenConnIds.has(conn.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate connection ID '${conn.id}' found in blueprint`,
        path: ['connections', idx, 'id']
      });
    }
    seenConnIds.add(conn.id);
  });

  // Validate each component's dependsOn array:
  //   - no duplicate target IDs within the array
  //   - no self-dependency
  //   - all referenced IDs must exist as component IDs in this blueprint
  // Cycle detection is delegated to packages/graph (same pattern as connection endpoint checks).
  val.components.forEach((comp, compIdx) => {
    const deps = comp.dependsOn || [];
    const seenDepIds = new Set();
    deps.forEach((depId, depIdx) => {
      if (depId === comp.id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Component '${comp.id}' cannot depend on itself in dependsOn`,
          path: ['components', compIdx, 'dependsOn', depIdx]
        });
      }
      if (seenDepIds.has(depId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate dependsOn entry '${depId}' in component '${comp.id}'`,
          path: ['components', compIdx, 'dependsOn', depIdx]
        });
      } else {
        seenDepIds.add(depId);
      }
      if (!seenComponentIds.has(depId) && depId !== comp.id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Component '${comp.id}' dependsOn unknown component '${depId}'`,
          path: ['components', compIdx, 'dependsOn', depIdx]
        });
      }
    });
  });
});

/**
 * Blueprint Revision Metadata Schema
 * Validates the backend database row / API record wrapping the canonical blueprint definition.
 * Enforces strict consistency between the outer envelope and inner definition for projectId and version.
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
}).superRefine((val, ctx) => {
  if (val.definition && val.definition.projectId !== val.projectId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Revision projectId '${val.projectId}' does not match definition.projectId '${val.definition.projectId}'`,
      path: ['definition', 'projectId']
    });
  }
  if (val.definition && val.definition.version !== val.version) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Revision version '${val.version}' does not match definition.version '${val.definition.version}'`,
      path: ['definition', 'version']
    });
  }
});

module.exports = {
  BlueprintSchema,
  BlueprintStatusSchema,
  BlueprintRevisionMetadataSchema
};
