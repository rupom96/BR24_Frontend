# TASK-20261012-chain-sequence-filter

## Summary

Step/Sequence autocomplete on Available Chain Status (`reactFlowExp2`) + optional `sequenceNo` on `getChainFlowChart`.

## Semantics (final)

`sequenceNo` (when set, non-zero): return only chains whose **last completed** track has `OriginalSequence == sequenceNo`.

Implementation (perf): candidates = completed at `sequenceNo`; exclude those with any completed track `OriginalSequence > sequenceNo` (later check scoped to candidates only). Equivalent to Max == filter; avoids GROUP BY Max.

- Pending last step does not count.
- Merely having that sequence as a middle completed step does **not** include the chain.
- Gaps among middle steps are irrelevant.

## Earlier (superseded)

Initially implemented as “semantics A”: any completed track with matching `OriginalSequence`. Replaced 2026-10-13.

## Key files

- BE: `BiznessEvent_PCTrackRepository.GetChainFlowChart`
- BE: `BiznessEventProcessConfiguration` `getSequencesByFixedTaskTemplateId`
- FE: `ReactFlowExp2`, RTK slices, `IChainSequenceOption`
