<!-- blastoise-ci-report -->
## 🟡 Blastoise - REQUIRES APPROVAL

at least one statement needs a timing decision, or could not be assessed. A human has to look.

**1 migration file** detected in 1 changed file. Assessed **offline** - no database was read, so every size-dependent judgment is a bound, not a measurement. The same run against a live database resolves most of them.

### 🟡 `migrations/0042_add_customer_ref.sql` - REQUIRES APPROVAL

| unsafe | unknown | needs_timing | safe_irreversible | safe |
|---|---|---|---|---|
| 0 | 2 | 0 | 0 | 1 |

<details open><summary>3 statements</summary>

| line | statement | tier | duration | evidence | why |
|---|---|---|---|---|---|
| 1 | `create_index_concurrently` | `safe` | - | proven | create_index_concurrently holds no lock that blocks reads or writes on a pre-existing relation |
| 3 | `alter_table` | `unknown` | - | unverified | no live snapshot: the catalog row is a worst case needing live context (whether the column's type is a domain with constraints (the IR records the type name, not whether it is a domain): a constrained domain disables the fast path and rewrites) |
| 5 | `alter_table` | `unknown` | - | unverified | add_column_default_volatile blocks reads for a duration that could not be estimated: no live snapshot: the row count of events is unknown |

</details>

**What this check couldn't establish**

- `no_snapshot` no live snapshot: relation sizes, statistics, current lock holders, replication state, and schema facts were not checked; every size- or state-dependent judgment is unknown
- `execution_state` the lock acquisition queue at execution time cannot be known in advance: any transaction open when the migration runs can make it wait, and everything arriving later queues behind that wait
- `cannot_estimate` L1 no live snapshot: the row count of events is unknown
- `unknown_classification` L3 no live snapshot: the catalog row is a worst case needing live context (whether the column's type is a domain with constraints (the IR records the type name, not whether it is a domain): a constrained domain disables the fast path and rewrites)
- `cannot_estimate` L3 no live snapshot: the catalog row is a worst case needing live context (whether the column's type is a domain with constraints (the IR records the type name, not whether it is a domain): a constrained domain disables the fast path and rewrites)
- `unknown_classification` L5 add_column_default_volatile blocks reads for a duration that could not be estimated: no live snapshot: the row count of events is unknown
- `cannot_estimate` L5 no live snapshot: the row count of events is unknown

---

<sub>`unsafe` Hydro Pump · `unknown` Fog · `needs_timing` Rain Check · `safe_irreversible` One-Way Current · `safe` Calm Water</sub>

<sub>blastoise 0.1.0 · this comment is updated in place on every push</sub>
