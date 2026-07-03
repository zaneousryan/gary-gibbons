# Design Questions for Ryan

Open questions logged by Aletheia where the design doc is ambiguous or silent. Per ALETHEIA.md §2.1, the smallest reasonable version is implemented and marked `// DESIGN-QUESTION:` in code/content until answered.

| # | Date | Status | Question | Interim decision |
|---|------|--------|----------|------------------|
| DQ-1 | 2026-07-02 | OPEN | Technical spec v1.0 says "companion to design doc v1.2"; the doc on disk is v1.3 (species pass). Building against v1.3 as superset — confirm no structural changes intended by the species pass beyond character/art descriptions. | Build against v1.3. |
| DQ-2 | 2026-07-03 | OPEN | Morning Pitch (II.16.6) wants the player to answer Dot by *selecting board items* ("Sell me the window." → picks checklist + empty vault). The dialogue schema has no board-item-choice node type; Day 2 ships the pitch as three authored dialogue choices. Should a board-picker node type land in Phase 5/6 (and the D2 pitch be retrofitted), or is the dialogue-choice form acceptable for the ship? | Dialogue choices for now; flagged before the pattern repeats across 6 more mornings. |
