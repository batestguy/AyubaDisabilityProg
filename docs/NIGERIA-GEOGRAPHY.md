# Nigeria learner geography

Current continuation (8 October 2026): User, Administrator waves 1–4 and the [learner scorecard/threshold follow-up](LEARNER-SCORECARD.md) are complete locally. Next: wave 5 consolidated Administrator closeout. Read [the current handoff](../SESSION-HANDOFF.md#next-session-brief); earlier milestones in this document retain their historical scope. Changes remain uncommitted and unpublished.

The Administration Learner map displays local learner records by state/FCT and LGA. Select a state on the national map or in the selector; select an LGA on its enlarged map or in the LGA selector; open a matching learner. Enter/Space operate each map region. Breadcrumbs return to the state or country. Named User profiles and explicitly loaded fictional geographic examples remain visibly distinct.

## Counts and matching

Scope filters select User, samples or both. Profile readiness filters apply before geographic counts; name/location search filters the learner list. State totals include every profile with a recognized recorded state, even if its LGA is unmatched. LGA totals require the recorded state and LGA to match as a pair. State counts may therefore exceed the sum of matched LGAs. The national unmatched list keeps missing, unrecognized and cross-state LGA entries visible without assigning a guessed location.

Names normalize case, spacing/punctuation and accent marks. State suffixes and explicit FCT/Abuja aliases are supported. FCT's Abuja Municipal/AMAC matches the dataset's Municipal Area Council label. No approximate-name matching, postcode lookup or precise home coordinate is inferred. These are demonstration counts, not nationwide coverage, population estimates or measured programme impact.

## Source and reproducibility

The local [map asset](../public/nigeria-admin-map.json) contains 37 state/FCT boundaries and 774 LGA boundaries from GRID3 via geoBoundaries gbOpen. [State metadata](https://www.geoboundaries.org/api/current/gbOpen/NGA/ADM1/) and [LGA metadata](https://www.geoboundaries.org/api/current/gbOpen/NGA/ADM2/) record represented year 2022, build date 12 December 2023 and Creative Commons Attribution 4.0 International. Download URLs are pinned to geoBoundaries commit 9469f09; detailed URLs, source/derived SHA-256 values, attribution and changes are in [provenance](nigeria-map-provenance.json). This represented year is not a claim of a 2026 survey.

Run `python scripts/build-nigeria-map.py` to reproduce the asset using Python's standard library. Pinned public source downloads are cached in ignored output/geography. Each LGA parent must agree across three distinct interior-point containment checks; all 774 pass. Paths are simplified at 0.006 degrees, projected for display and rounded. Runtime validation rejects malformed/open/degenerate geometry, empty state LGA sets, duplicate keys/names and invalid dimensions. Simplified display geometry is unsuitable for surveying home locations.

Attribution: Administrative boundaries: GRID3, geoBoundaries Database (www.geoboundaries.org), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Source attribution/license and represented year appear in the UI. A map-load failure retains the recorded learner list with a retry action; an on-demand screen failure retains the role shell/sidebar with a recovery alert.

## Local demonstration boundary

Demo settings can explicitly load five fictional profiles in Plateau/Jos North (two), Lagos/Ikeja, Niger/Chanchaga and FCT/Abuja Municipal. Loading preserves the User profile and never invents enrolments, qualifications, support delivery or assessment history. Reload retains samples; confirmed shared reset clears them while preserving the separate sandbox. Secure staff accounts and a shared nationwide learner database require separately scoped backend work.
