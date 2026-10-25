const {
  BlueprintSchema,
  BlueprintStatusSchema,
  BlueprintRevisionMetadataSchema
} = require('./blueprint');

const {
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
} = require('./components');

const {
  ConnectionPurposeSchema,
  ConnectionSchema
} = require('./connections');

const {
  RequirementsSchema,
  AvailabilityTierSchema,
  BudgetTierSchema,
  ExpectedUsersTierSchema,
  SecurityTierSchema
} = require('./requirements');

module.exports = {
  // Blueprint and Revision
  BlueprintSchema,
  BlueprintStatusSchema,
  BlueprintRevisionMetadataSchema,

  // Components
  BaseComponentSchema,
  ReplicasSchema,
  ApiServiceComponentSchema,
  StaticFrontendComponentSchema,
  BackgroundWorkerComponentSchema,
  PostgresComponentSchema,
  RedisComponentSchema,
  QueueComponentSchema,
  StorageBucketComponentSchema,
  ComponentSchema,

  // Connections
  ConnectionPurposeSchema,
  ConnectionSchema,

  // Requirements
  RequirementsSchema,
  AvailabilityTierSchema,
  BudgetTierSchema,
  ExpectedUsersTierSchema,
  SecurityTierSchema
};
