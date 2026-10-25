const { z } = require('zod');

/**
 * Operational Requirements Schema
 * Defines the high-level business and operational constraints.
 * 
 * Consequential user decisions have NO silent defaults:
 * Every tier must be explicitly declared or confirmed by the user.
 */

const AvailabilityTierSchema = z.enum([
  'single_instance',
  'survive_server_failure'
]);

const BudgetTierSchema = z.enum([
  'low',
  'moderate',
  'unconstrained'
]);

const ExpectedUsersTierSchema = z.enum([
  'low',
  'moderate',
  'high'
]);

const SecurityTierSchema = z.enum([
  'standard',
  'strict'
]);

const RequirementsSchema = z.object({
  availability: AvailabilityTierSchema,
  budget: BudgetTierSchema,
  expectedUsers: ExpectedUsersTierSchema,
  security: SecurityTierSchema
});

module.exports = {
  RequirementsSchema,
  AvailabilityTierSchema,
  BudgetTierSchema,
  ExpectedUsersTierSchema,
  SecurityTierSchema
};
