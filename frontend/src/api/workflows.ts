// Minimal API client for workflow save/publish
// Uses the frontend's dev proxy to FastAPI (see frontend/package.json)

export type RFNode = {
  id: string;
  type: string;
  label?: string;
  data?: any;
  position?: { x: number; y: number };
};

export type RFEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  label?: string | null;
};

export async function saveWorkflow(payload: {
  id?: number;
  name: string;
  version?: number;
  nodes: RFNode[];
  edges: RFEdge[];
  metadata?: Record<string, any>;
}) {
  const res = await fetch('/api/v1/workflows/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: payload.id ?? undefined,
      name: payload.name,
      version: payload.version ?? 1,
      nodes: payload.nodes,
      edges: payload.edges,
      metadata: payload.metadata ?? {},
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Save failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function publishWorkflow(workflowId: number) {
  const res = await fetch('/api/v1/workflows/publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workflow_id: workflowId }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Publish failed: ${res.status} ${text}`);
  }
  return res.json();
}
