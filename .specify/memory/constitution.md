<!--
Sync Impact Report
==================
Version change: NONE → 1.0.0
Modified principles: N/A (initial constitution)
Added sections:
  - Core Principles (5 principles)
  - Naming Standards
  - Code Quality Gates
  - Governance
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (Constitution Check section compatible)
  - .specify/templates/spec-template.md ✅ (Requirements section compatible)
  - .specify/templates/tasks-template.md ✅ (Phase structure compatible)
Follow-up TODOs: None
-->

# VimSnake Constitution

## Core Principles

### I. Descriptive Naming

All identifiers (constants, variables, functions, classes, modules, and source files) MUST use complete, descriptive names that clearly convey their purpose, scope, and behavior.

**Rules:**
- Names MUST describe what the entity does, contains, or represents
- Function names MUST include a verb indicating the action performed
- Boolean variables and functions MUST use interrogative forms (e.g., `isValid`, `hasPermission`, `canExecute`)
- Collection names MUST use plural forms indicating multiple items
- Single-responsibility entities MUST have names reflecting their sole purpose

**Rationale:** Descriptive names eliminate ambiguity, reduce cognitive load during code review, and make code accessible to new contributors without additional documentation overhead.

### II. No Abbreviations

Code MUST NOT contain abbreviations, acronyms, or shortened forms unless the abbreviation is the universally recognized term in the domain (e.g., `URL`, `HTTP`, `ID`).

**Rules:**
- Every word MUST be spelled out completely
- Common abbreviations like `tmp`, `cnt`, `idx`, `val`, `num` are prohibited
- Domain-specific acronyms are acceptable ONLY when they are industry-standard terminology
- When uncertain, spell it out

**Rationale:** Abbreviations create barriers to understanding, require readers to maintain mental translation tables, and often obscure the actual meaning of code constructs.

### III. Self-Documenting Code (NON-NEGOTIABLE)

Code structure and naming MUST make intent immediately clear without requiring supplementary documentation or comments.

**Rules:**
- Complex logic MUST be decomposed into smaller, named functions with descriptive names
- Magic numbers and strings MUST be extracted into named constants
- Conditional logic MUST use predicate functions to express intent (e.g., `if (isEligibleForDiscount(order))` not `if (order.total > 100 && order.customerYears > 2)`)
- Nested logic MUST be replaced with early returns or guard clauses

**Rationale:** Self-documenting code stays synchronized with implementation, unlike comments which drift and become misleading. Code that explains itself reduces maintenance burden and prevents documentation debt.

### IV. No Comments (NON-NEGOTIABLE)

Source code MUST NOT include inline comments, block comments, or documentation comments. Naming conventions and code structure MUST eliminate the need for explanatory text.

**Rules:**
- All comments are prohibited, including TODO, FIXME, and explanatory notes
- If a comment is needed to explain code, refactor the code instead
- Public APIs MUST be self-explanatory through their names; external documentation may exist but code explains itself
- License headers are the sole exception for new files (to be removed from existing files during refactoring)

**Rationale:** Comments are maintenance debt—they require synchronization with code, become stale, and often state the obvious. The effort spent writing comments is better invested in clear naming and structure.

### V. Clear Intent Through Structure

Every code construct MUST communicate its purpose through its name, structure, and composition alone.

**Rules:**
- Functions MUST do one thing; the name MUST describe that one thing
- Classes MUST represent a single cohesive concept
- Module boundaries MUST reflect logical divisions of the system
- File names MUST clearly indicate their contents
- Test names MUST describe the scenario being validated (e.g., `rejectsInvalidEmailAddress`, not `testValidation`)

**Rationale:** Clear structure enables readers to navigate codebases without mental mapping. When code organization reflects domain concepts, developers can locate functionality intuitively.

## Naming Standards

### Constants

Constants MUST use `SCREAMING_SNAKE_CASE` and describe the exact value they represent:

```typescript
const MAXIMUM_CONNECTION_RETRY_COUNT = 3;
const DEFAULT_HTTP_REQUEST_TIMEOUT_IN_MILLISECONDS = 30000;
```

### Variables

Variables MUST use `camelCase` and describe their current state or contents:

```typescript
const currentUserEmailAddress = user.email;
const successfullyProcessedOrderCount = orders.filter(isProcessed).length;
```

### Functions

Functions MUST use `camelCase` beginning with a verb describing the action:

```typescript
function calculateTotalOrderPriceWithDiscount(order: Order): number {}
function determineEligibleCustomerDiscountPercentage(customer: Customer): number {}
```

### Classes and Types

Classes and types MUST use `PascalCase` and describe the entity or concept:

```typescript
class CustomerOrderProcessor {}
interface CustomerAuthenticationCredentials {}
type OrderFulfillmentStatus = 'pending' | 'processing' | 'shipped' | 'delivered';
```

### Files

Files MUST be named to clearly indicate their contents using the project's约定的 case convention (typically `kebab-case` for modules, `PascalCase` for components):

```
customer-order-processor.ts
customer-authentication-credentials.interface.ts
order-fulfillment-status.type.ts
```

## Code Quality Gates

All code MUST pass the following quality gates before merge:

- **Naming Review**: All identifiers reviewed for clarity and descriptiveness
- **Abbreviation Check**: Automated scan for common abbreviation patterns
- **Comment Detection**: Automated lint rule flagging any comment presence
- **Readability Assessment**: Peer review confirming code is understandable withoutComments

## Governance

This constitution establishes non-negotiable standards for code quality in the VimSnake project. All changes to this constitution require:

1. Documentation of the proposed amendment
2. Rationale explaining why the change improves code clarity
3. Review by at least one project maintainer
4. Version increment following semantic versioning

**Amendment Procedure:**
- Proposals MUST be submitted as a pull request to this file
- Breaking changes (removing or weakening principles) require MAJOR version bump
- New principles or strengthened requirements require MINOR version bump
- Clarifications and wording improvements require PATCH version bump

**Compliance:**
- All pull requests MUST comply with constitutional principles
- Non-compliant code MUST be refactored before merge
- No exceptions granted without documented architectural justification

**Version**: 1.0.0 | **Ratified**: 2026-03-14 | **Last Amended**: 2026-03-14