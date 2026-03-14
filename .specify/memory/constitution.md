<!--
Sync Impact Report
==================
Version change: 1.1.0 → 1.2.0
Modified principles: None
Added sections:
  - IX. Reproducible Development Environment (new)
  - X. Pinned Dependency Versions (new)
  - Dependency Standards (new section)
Removed sections: None
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

### VI. User Acceptance Test Priority (NON-NEGOTIABLE)

Test effort MUST prioritize high-level user acceptance tests over low-level unit tests.

**Rules:**
- Test suite MUST include user acceptance tests that validate complete user workflows
- User acceptance tests MUST be written before unit tests when new features are developed
- Unit tests MAY be added only when user acceptance tests provide insufficient coverage of edge cases
- Test coverage metrics MUST weight user acceptance tests higher than unit tests

**Rationale:** User acceptance tests verify behavior that users actually experience. Low-level unit tests verify implementation details that may change without affecting user outcomes. Prioritizing user acceptance tests ensures testing effort delivers actual value to users and catches regressions that matter.

### VII. Test Scenarios as Code

Every important feature MUST have at least one test scenario versioned as code in the repository.

**Rules:**
- Test scenarios MUST be executable automated tests, not manual checklists
- Test scenarios MUST be stored in the repository alongside application code
- Test scenarios MUST be version-controlled with the same commit workflow as application code
- New features MUST include test scenarios in the same pull request as the implementation

**Rationale:** Tests that exist only outside version control drift from implementation, become stale, or are lost entirely. Versioned tests ensure that anyone can reproduce validation of any feature at any point in the project history. Code-reviewed tests maintain quality standards equal to application code.

### VIII. Continuous Test Validation

Every change to application code MUST be validated by running all available tests.

**Rules:**
- All tests MUST pass before merging any change to application code
- Test execution MUST be automated and required for every pull request
- Failing tests MUST block merge until resolved
- Test suite execution time MUST stay within acceptable limits for continuous integration

**Rationale:** Running all tests on every change catches regressions immediately when they are cheapest to fix. Selective test execution based on changed files creates false confidence and allows regressions to slip through. Complete test validation ensures the system works as a whole, not just in isolated components.

### IX. Reproducible Development Environment

Every executable program used for building or testing the application MUST be available at the same version across all environments.

**Rules:**
- Build tools and testing frameworks MUST NOT be assumed to be pre-installed on any machine
- All development tools MUST be declared in a Nix Shell definition (`shell.nix` or `flake.nix`)
- Tool versions MUST be explicitly pinned in the Nix configuration
- Running `nix-shell` or `nix develop` MUST produce an environment with all required tools at declared versions
- Different developers and build servers MUST execute builds with identical tool versions

**Rationale:** Environment inconsistencies cause subtle bugs that waste hours debugging. Version mismatches between developer machines and CI servers lead to "works on my machine" problems. Declaring all dependencies in Nix ensures reproducibility across any machine, eliminates environment-specific failures, and enables deterministic builds from any point in history.

### X. Pinned Dependency Versions

All software dependencies including libraries, packages, and container images MUST use specific, pinned versions to guarantee consistent builds and tests.

**Rules:**
- Library dependencies MUST specify exact version numbers, not ranges
- Container images MUST reference specific digests or immutable version tags
- Version specifications MUST be locked in dependency manifests (e.g., `package-lock.json`, `Cargo.lock`, `go.sum`)
- Updating a dependency MUST be an explicit, reviewed action with a recorded rationale
- Transitive dependency versions MUST also be locked and reproducible

**Rationale:** Loose version constraints introduce unpredictability. A library update can silently change behavior or introduce bugs without any code change on the consuming side. Pinned versions ensure that builds and tests execute identically regardless of when or where they run. Version updates become deliberate decisions with full visibility into what changed and why.

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

Files MUST be named to clearly indicate their contents using the project's case convention (typically `kebab-case` for modules, `PascalCase` for components):

```
customer-order-processor.ts
customer-authentication-credentials.interface.ts
order-fulfillment-status.type.ts
```

## Testing Standards

### Test Hierarchy

Tests MUST be organized in priority order:

1. **User Acceptance Tests (Highest Priority)**: Validate complete user workflows end-to-end
2. **Integration Tests**: Validate component interactions and API contracts
3. **Unit Tests (Lowest Priority)**: Validate isolated functions and edge cases

### Test Naming

Test names MUST describe the scenario being validated:

```typescript
function rejectsInvalidEmailAddress() {}
function createsOrderWhenItemsAreInStock() {}
function sendsNotificationAfterSuccessfulPayment() {}
```

### Test Independence

Each test scenario MUST be independently executable:

**Rules:**
- Tests MUST NOT depend on execution order
- Tests MUST NOT share mutable state
- Each test MUST set up its own fixtures
- Each test MUST clean up after itself

### Test Coverage Requirements

**Rules:**
- All user-facing features MUST have user acceptance test coverage
- Critical business logic MUST have integration test coverage
- Unit tests MAY cover edge cases not reachable through higher-level tests
- Coverage reports MUST distinguish between user acceptance, integration, and unit test coverage

## Dependency Standards

### Development Tools

Development and build tools MUST be declared in Nix configuration:

```nix
{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-24.11";
  };
  outputs = { nixpkgs, ... }: {
    devShells.default = pkgs.mkShell {
      packages = [
        pkgs.nodejs_20
        pkgs.typescript
        pkgs.playwright
      ];
    };
  };
}
```

### Library Dependencies

Library dependencies MUST be pinned to exact versions in lock files:

```json
{
  "dependencies": {
    "express": "4.21.0",
    "lodash": "4.17.21"
  }
}
```

### Container Images

Container images MUST reference specific digests:

```dockerfile
FROM node:20.11.0@sha256:abc123...
```

### Dependency Updates

Dependency updates MUST follow a deliberate process:

1. Identify the specific dependency and version to update
2. Review changelog and breaking changes
3. Update version in manifest and lock file
4. Run full test suite to validate compatibility
5. Document the update reason in commit message

## Code Quality Gates

All code MUST pass the following quality gates before merge:

- **Naming Review**: All identifiers reviewed for clarity and descriptiveness
- **Abbreviation Check**: Automated scan for common abbreviation patterns
- **Comment Detection**: Automated lint rule flagging any comment presence
- **Readability Assessment**: Peer review confirming code is understandable without comments
- **Test Validation**: All tests MUST pass with zero failures
- **Dependency Validation**: All dependencies MUST be pinned to specific versions

## Governance

This constitution establishes non-negotiable standards for code quality in the VimSnake project. All changes to this constitution require:

1. Documentation of the proposed amendment
2. Rationale explaining why the change improves code clarity or reliability
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

**Version**: 1.2.0 | **Ratified**: 2026-03-14 | **Last Amended**: 2026-03-14