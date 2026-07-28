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
