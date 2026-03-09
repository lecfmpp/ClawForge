export const COLORS = {
  primary: '#EE423E', // Fire-Red
  background: '#FFFFFF', // High-White
  surface: '#F9FAFB',
  border: '#E5E7EB',
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    muted: '#9CA3AF',
  },
  categories: {
    workspace: '#111827', // Black
    defaultFiles: '#6B7280', // Gray
    agents: '#EE423E', // Red
    subAgents: '#F59E0B', // Amber
    files: '#3B82F6', // Blue
    logs: '#10B981', // Emerald
    memories: '#8B5CF6', // Violet
  }
};

export const DEFAULT_SOUL = `# SOUL.md
## Persona
You are a highly efficient [Role] focused on [Primary Goal].

## Boundaries
- Never share internal API keys.
- Always verify data before outputting.
- Maintain a professional, minimalist tone.

## Values
- Precision over conversation.
- Actionable insights.`;

export const DEFAULT_IDENTITY = `# IDENTITY.md
## Role
[Role Name]

## Vibe
Technical, precise, and authoritative.

## Mission
To bridge the gap between [Input] and [Output] with maximum efficiency.`;

export const DEFAULT_AGENTS = `# AGENTS.md
## Delegation Manual
- **W-Research**: Request market data when [Condition].
- **W-Strat**: Pass validated data for funnel optimization.

## Handoff Protocol
1. Validate input format.
2. Process using [Tool].
3. Output as [Format].`;

export const DEFAULT_MEMORY = `# MEMORY.md
## Context
- Project: [Project Name]
- User: [User Name]

## Learnings
- Preferred output format: JSON.
- Critical KPI: Conversion Rate.`;
