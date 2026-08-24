<!-- blastoise-ci-report -->
## 🔴 Blastoise - BLOCK

at least one statement should not run as written.

**1 migration file** detected in 1 changed file. Assessed against `staging` (live): row counts, existing constraints and current locks were read.

### 🔴 `migrations/0042_add_customer_ref.sql` - BLOCK

| unsafe | unknown | needs_timing | safe_irreversible | safe |
|---|---|---|---|---|
| 1 | 0 | 1 | 0 | 1 |

<details open><summary>3 statements</summary>

| line | statement | tier | duration | evidence | why |
|---|---|---|---|---|---|
| 1 | `create_index_concurrently` | `safe` | seconds | proven | create_index_concurrently holds no lock that blocks reads or writes on a pre-existing relation (the work itself runs in the seconds band) |
| 3 | `alter_table` | `needs_timing` | sub_second | observed | add_column_default_nonvolatile is catalog-only but takes a read-and-write-blocking lock on events; the work is brief, the wait for the lock may not be |
| 5 | `alter_table` | `unsafe` | minutes | simulated | add_column_default_volatile blocks reads and writes for a hold measured in minutes at worst: an outage-length stall |

</details>

**What this check couldn't establish**

- `snapshot_limits` the snapshot describes the database at capture time, not at execution time; it is not transactionally consistent across sections, and reltuples is an estimate even when fresh
- `execution_state` the lock acquisition queue at execution time cannot be known in advance: any transaction open when the migration runs can make it wait, and everything arriving later queues behind that wait
- `uncalibrated_constant` duration constant 'add_column_rewrite' was measured on one uncontended machine, not calibrated across environments; production can only be slower
- `uncalibrated_constant` duration constant 'constant_op' is an uncalibrated guess; estimates built on it carry a 4x-widened interval
- `uncalibrated_constant` duration constant 'index_build_btree' was measured on one uncontended machine, not calibrated across environments; production can only be slower

---

<sub>`unsafe` Hydro Pump · `unknown` Fog · `needs_timing` Rain Check · `safe_irreversible` One-Way Current · `safe` Calm Water</sub>

<sub>blastoise 0.1.0 · this comment is updated in place on every push</sub>
