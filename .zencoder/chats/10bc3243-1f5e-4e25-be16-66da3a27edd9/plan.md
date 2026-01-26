# Spec and build

## Agent Instructions

Ask the user questions when anything is unclear or needs their input. This includes:

- Ambiguous or incomplete requirements
- Technical decisions that affect architecture or user experience
- Trade-offs that require business context

Do not make assumptions on important decisions — get clarification first.

---

## Workflow Steps

### [x] Step: Technical Specification

Assess the task's difficulty, as underestimating it leads to poor outcomes.

- easy: Straightforward implementation, trivial bug fix or feature
- medium: Moderate complexity, some edge cases or caveats to consider
- hard: Complex logic, many caveats, architectural considerations, or high-risk changes

Create a technical specification for the task that is appropriate for the complexity level:

- Review the existing codebase architecture and identify reusable components.
- Define the implementation approach based on established patterns in the project.
- Identify all source code files that will be created or modified.
- Define any necessary data model, API, or interface changes.
- Describe verification steps using the project's test and lint commands.

Save the output to `/Users/lidia/Documents/laura/.zencoder/chats/10bc3243-1f5e-4e25-be16-66da3a27edd9/spec.md` with:

- Technical context (language, dependencies)
- Implementation approach
- Source code structure changes
- Data model / API / interface changes
- Verification approach

If the task is complex enough, create a detailed implementation plan based on `/Users/lidia/Documents/laura/.zencoder/chats/10bc3243-1f5e-4e25-be16-66da3a27edd9/spec.md`:

- Break down the work into concrete tasks (incrementable, testable milestones)
- Each task should reference relevant contracts and include verification steps
- Replace the Implementation step below with the planned tasks

Rule of thumb for step size: each step should represent a coherent unit of work (e.g., implement a component, add an API endpoint, write tests for a module). Avoid steps that are too granular (single function).

Save to `/Users/lidia/Documents/laura/.zencoder/chats/10bc3243-1f5e-4e25-be16-66da3a27edd9/plan.md`. If the feature is trivial and doesn't warrant this breakdown, keep the Implementation step below as is.

---

### [x] Step: Implementation

Implement the task according to the technical specification and general engineering best practices.

1. [x] Add Trustpilot domain verification meta tag to `index.html`.
2. [x] Verify existence and content of `e5de9737-9cb3-4262-a558-d8c1107f4319.html`.
3. [x] Add TrustBox bootstrap script and Review Collector widget to `index.html`.
4. [x] Add a "Deixa una ressenya" button that links to the Trustpilot review page.
5. [ ] After completion, write a report to `/Users/lidia/Documents/laura/.zencoder/chats/10bc3243-1f5e-4e25-be16-66da3a27edd9/report.md`.

---

### [ ] Step: Stripe Live Mode Transition

Switch Stripe configuration from test mode to live mode.

1. **Frontend**: Update `checkout.js` with the Live Publishable Key.
2. **Backend**: Provide instructions to update Cloudflare Secrets with the Live Secret Key.
3. **Verification**: Verify that the environment is set to production where applicable.
