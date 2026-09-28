import { RestApiClient } from 'twenty-client-sdk/rest';

import { type Money } from 'src/lib/time-math';

// REST calls the widget makes. They run as the signed-in member (narrowed
// by the app role), so nothing here can do more than that member can.

export type TimeEntry = {
  id: string;
  name: string | null;
  startedAt: string | null;
  endedAt: string | null;
  hours: number | null;
  billable: boolean | null;
  invoiced: boolean | null;
  hourlyRate: Money | null;
  opportunityId: string | null;
  teamMemberId: string | null;
  opportunity?: { id: string; name: string | null } | null;
};

export type OpportunityOption = { id: string; name: string };

export type TimeEntryInput = {
  name?: string | null;
  startedAt?: string;
  endedAt?: string | null;
  hours?: number;
  billable?: boolean;
  invoiced?: boolean;
  hourlyRate?: { amountMicros: number; currencyCode: string };
  opportunityId?: string | null;
  teamMemberId?: string | null;
};

type ListResponse<TKey extends string, TRecord> = {
  data: Record<TKey, TRecord[]>;
  pageInfo?: { hasNextPage?: boolean; endCursor?: string | null };
};

const PAGE_SIZE = 200;

const client = () => new RestApiClient();

// String values in REST filters are double-quoted; ids are UUIDs.
const quote = (value: string) => `"${value}"`;

const listAll = async <TRecord>(
  namePlural: string,
  query: Record<string, string | number>,
): Promise<TRecord[]> => {
  const records: TRecord[] = [];
  let cursor: string | null = null;

  for (;;) {
    const response: ListResponse<string, TRecord> = await client().get(
      `/rest/${namePlural}`,
      {
        query: {
          ...query,
          limit: PAGE_SIZE,
          ...(cursor !== null ? { starting_after: cursor } : {}),
        },
      },
    );

    records.push(...(response.data?.[namePlural] ?? []));

    const endCursor = response.pageInfo?.endCursor ?? null;

    if (response.pageInfo?.hasNextPage !== true || endCursor === null) {
      return records;
    }

    cursor = endCursor;
  }
};

export const fetchWorkspaceMemberId = async (
  userId: string,
): Promise<string | null> => {
  const response: ListResponse<'workspaceMembers', { id: string }> =
    await client().get('/rest/workspaceMembers', {
      query: { filter: `userId[eq]:${quote(userId)}`, limit: 1, depth: 0 },
    });

  return response.data?.workspaceMembers?.[0]?.id ?? null;
};

export const fetchRunningEntries = async (
  teamMemberId: string,
): Promise<TimeEntry[]> =>
  listAll<TimeEntry>('timeEntries', {
    filter: `endedAt[is]:NULL,teamMemberId[eq]:${quote(teamMemberId)}`,
    order_by: 'startedAt[DescNullsLast]',
    depth: 1,
  });

export const fetchOpportunityEntries = async (
  opportunityId: string,
): Promise<TimeEntry[]> =>
  listAll<TimeEntry>('timeEntries', {
    filter: `opportunityId[eq]:${quote(opportunityId)}`,
    order_by: 'startedAt[DescNullsLast]',
    depth: 0,
  });

export const fetchOpportunityName = async (
  opportunityId: string,
): Promise<string | null> => {
  const response: { data?: { opportunity?: { name?: string | null } } } =
    await client().get(`/rest/opportunities/${opportunityId}`, {
      query: { depth: 0 },
    });

  return response.data?.opportunity?.name ?? null;
};

export const fetchOpportunityOptions = async (): Promise<OpportunityOption[]> => {
  const opportunities = await listAll<{ id: string; name: string | null }>(
    'opportunities',
    { order_by: 'updatedAt[DescNullsLast]', depth: 0 },
  );

  return opportunities.map((opportunity) => ({
    id: opportunity.id,
    name: opportunity.name ?? 'Untitled opportunity',
  }));
};

export const createTimeEntry = async (
  input: TimeEntryInput,
): Promise<TimeEntry> => {
  const response: { data: { createTimeEntry: TimeEntry } } =
    await client().post('/rest/timeEntries', input);

  return response.data.createTimeEntry;
};

export const updateTimeEntry = async (
  id: string,
  input: TimeEntryInput,
): Promise<TimeEntry> => {
  const response: { data: { updateTimeEntry: TimeEntry } } =
    await client().patch(`/rest/timeEntries/${id}`, input);

  return response.data.updateTimeEntry;
};

// Soft delete: the entry goes to the trash and can be restored. Without
// soft_delete=true the REST API destroys the row (and the app role can't).
export const deleteTimeEntry = async (id: string): Promise<void> => {
  await client().delete(`/rest/timeEntries/${id}`, {
    query: { soft_delete: true },
  });
};
