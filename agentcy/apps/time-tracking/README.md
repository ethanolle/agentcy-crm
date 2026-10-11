# Time tracking (Twenty app)

Logs time on opportunities in Agentcy's Twenty CRM.

- **Time entry** object: Work done, Start, End, Hours, Billable, Hourly rate, Invoiced, Who, Opportunity.
- **Time** tab on every opportunity: start/stop timer, manual entry ("1.5", "1:30", "90m"), totals (billable value, not invoiced yet), and the deal's entries as an editable table.
- **Timer** button in the top bar: see, stop or start a timer from any page.
- **Time entries** in the sidebar, with the views Unbilled (billable, not invoiced) and Timesheet (week calendar).
- **Payment** object: Hours paid, Amount, Paid on, Payment method, Note, Opportunity. On the Time tab, a **Paid hours** card shows paid, used (billable hours logged), remaining or over, and amount received, with a form and the dated history; a Payments table sits under it. **Payments** in the sidebar lists them all.

Payments are a log: going from 5 h to 10 h paid adds a +5 h row, so each change keeps its day and who recorded it. In the form, `10` sets the new paid total and `+5` / `-2` changes it.

A running timer is an entry with no End, owned by the member (Who). Hours is what gets billed; editing Start or End does not change it. An empty Hourly rate counts as the `DEFAULT_HOURLY_RATE` app setting.

Everything runs in the front component (`src/front-components/time-tracker.front-component.tsx`) through the REST API as the signed-in member: the app has no logic functions, since they are disabled on our server.

## Develop and deploy

Needs Node 24 (`nvm install 24`) and Yarn 4 through Corepack.

```bash
corepack yarn install
corepack yarn test        # unit tests (src/lib)
corepack yarn typecheck
corepack yarn lint
corepack yarn twenty plan   # preview the metadata changes
corepack yarn twenty apply  # sync to the workspace
```

The CLI remote and its credentials are set up from the Agentcy ops repo (`ops/sops/twenty.md`), not in this repo.

Never run `app:uninstall` on the production workspace: it drops the Time entry table and every entry in it. A `plan` that destroys the object or a field means data loss.

Identifiers in `src/constants/universal-identifiers.ts` are permanent: changing one deletes and recreates that entity.
