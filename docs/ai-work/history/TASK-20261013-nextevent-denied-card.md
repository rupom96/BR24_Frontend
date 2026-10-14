# TASK-20261013 — EventsOfAChain denied cards

## Objective

Surface `BiznessEvent_PCTrack.Denied` on `GET api/SA_NextEvent/getByCompanyLocationUserFixedTaskTemplateId` and disable EventsOfAChain cards when `denied` is truthy.

## Contract

| Layer | Change |
|-------|--------|
| Source | Same PCTrack row as `EventNo` in `SP_NextEvent_Fancy` |
| API field | `denied` (`bool?`), sister of `eventStatus` |
| FE UX | Card stays in list; disabled look; click → toast `A step of this card has been denied.`; modal does not open |

## Done

### Backend (user-authorized)

- `GetSA_NextEventByCompanyLocationUserFixedTaskTemplateIdDto.Denied`
- `SA_NextEventRepository.MapToDto` reads `Denied` if column present (null until SP ships)
- Rebuild loop copies `Denied`

### Frontend

- `ISANextEvent.denied` / `eventStatus`
- `EventsOfAChain.tsx`: guard + disabled classes

## DB (done on TEST_CORMSM)

- Altered `SP_NextEvent_Fancy`: `Denied` threaded `t` → `##BiznessEvent_PCTrack` → `LastEvents` / `##LastEvents` → `CTE_NextEventWithoutUser` → final SELECT as sister of `EventStatus`
- No new table column (already existed)
- Verified: EXEC result columns include single `Denied`

## Smoke

1. Restart API.
2. Card with `denied: true` → list visible, faded, toast on click, no modal.
3. Card with `denied` null/false → open as today.
