# Workspace Rules

Mandatory project rules per task:

## New Session Context

On session start, agent run initial steps:

1. **Architecture Understanding (Graphify Knowledge Base)**:
   - Do not scan folders / grep manually one-by-one.
   - Must read [graphify-out/GRAPH_REPORT.md](graphify-out/GRAPH_REPORT.md) for visual summary, God Nodes, Community boundaries, Surprising Connections.
   - For data flow / module relations, run `graphify query "<question>"` or query `graphify-out/graph.json`.

2. **Business & System Design Rules**:
   - Check design spec & PRD in `docs/PRD.md` and `docs/design/DESIGN.md` for component standards, color scheme (Nike Soft Cloud Dark Mode), validation workflows.

---

## Development Workflow

1. **TS/JS Code Changes (Logic & Functionality)**:
   Must verify TypeScript (`npx tsc --noEmit`) + linter (`npm run lint`).

2. **Style-Only / Component Styling Changes**:
   Skip TypeScript check (`npx tsc --noEmit`). Run format (`npm run format`) for Tailwind auto-sort.

---

## SDLC Phase Boundaries & Eagerness Bias Prevention

Prevent premature code writing during design sessions:

1. **Phase 1: Brainstorming & Architecture (`/grill-me`)**:
   - **Role**: System Architect / Tech Lead.
   - **Constraint**: NEVER write or edit source code files (`src/`, etc.) during `/grill-me` or brainstorming. Focus 100% on asking questions, edge cases, resolving design dependencies.
   - **Output**: Strictly conversational Q&A and design summaries.

2. **Phase 2: Specification & Planning (`/to-spec`, `/to-tickets`)**:
   - **Role**: Technical Planner / Spec Writer.
   - **Constraint**: Only create/update spec and task tracking files under `.scratch/<feature>/` (e.g. `.scratch/<feature>/spec.md` and `.scratch/<feature>/tasks.md`).

3. **Phase 3: Implementation (`/implement`)**:
   - **Role**: Software Developer / Coder.
   - **Constraint**:
     - Write/edit source code ONLY after spec and tickets finalized, or when explicitly instructed (`/implement` or TDD workflow).
     - **NO Auto-Commit / NO Auto-Push**: Once code written and verified (`npx tsc --noEmit`, `npm run lint`), stop and leave changes uncommitted for user review. Never commit or push automatically.

4. **Phase 4: Code Audit & Review (`/code-review`, `/ponytail:ponytail-review`)**:
   - **Role**: Code Auditor / Quality & Simplicity Specialist.
   - **Constraint**: Read-only inspection mode. Run correctness/spec check (`/code-review`) and anti-overengineering check (`/ponytail:ponytail-review`) on uncommitted changes to generate action items without editing files silently.

5. **Phase 5: Refactoring & Remediation**:
   - **Role**: Software Developer / Refactoring Coder.
   - **Constraint**: Apply review findings and simplifications. Re-verify TypeScript (`npx tsc --noEmit`) + linter (`npm run lint`). If major structural/spec changes needed, return to Phase 1 (`/grill-me`) or Phase 2 (`/to-spec`).

6. **Phase 6: Commit & Completion (`caveman-commit`)**:
   - **Role**: Git Maintainer.
   - **Constraint**: Generate concise conventional commit messages once code clean and verified. Keep changes uncommitted unless explicitly instructed to commit/push.
