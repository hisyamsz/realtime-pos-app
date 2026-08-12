# Workspace Rules

Mandatory project rules per task:

## New Session Context

On session start, agent run initial steps:

1. **Architecture Understanding (Graphify Knowledge Base)**:
   - **Do not scan folders / grep manually one-by-one**.
   - **Must read [graphify-out/GRAPH_REPORT.md](graphify-out/GRAPH_REPORT.md)** for visual summary, God Nodes, Community boundaries, Surprising Connections.
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

To prevent premature code writing during design sessions:

1. **Phase 1: Brainstorming & Architecture (`/grill-me`)**:
   - **Role**: System Architect / Tech Lead.
   - **Constraint**: **NEVER** write or edit application source code files (`src/`, etc.) during `/grill-me` or brainstorming sessions. Focus 100% on asking questions, uncovering edge cases, and resolving design dependencies.
   - **Output**: Output is strictly conversational Q&A and design summaries.

2. **Phase 2: Specification & Planning (`/to-spec`, `/to-tickets`)**:
   - **Role**: Technical Planner / Spec Writer.
   - **Constraint**: Only create or update spec and task tracking files under `.scratch/<feature>/` (e.g. `.scratch/<feature>/spec.md` and `.scratch/<feature>/tasks.md`).

3. **Phase 3: Implementation (`/implement`)**:
   - **Role**: Software Developer / Coder.
   - **Constraint**: Writing/editing source code is ONLY permitted after spec and tickets are finalized, or when explicitly instructed to implement code (`/implement` or TDD workflow).

