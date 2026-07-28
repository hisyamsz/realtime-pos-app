# Domain Documentation Configuration

This repository uses a **single-context** layout for domain documentation and architectural decision records.

## Layout
- **Root Context File**: `CONTEXT.md` (located at repository root)
- **ADR Directory**: `docs/adr/`

## Consumer Rules
1. **Reading Context**: Agents working on any feature or task in this repository must read `CONTEXT.md` at the start to understand domain terminology, architectural boundaries, and core system abstractions.
2. **Reading ADRs**: Agents making structural or architectural modifications must inspect `docs/adr/` for relevant Architectural Decision Records.
3. **Writing ADRs**: When significant architectural decisions or design changes are introduced, write a new ADR in `docs/adr/` following standard ADR format (`docs/adr/000X-title.md`).
