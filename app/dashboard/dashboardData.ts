import { conversations } from '@/data/conversations';

export const dashboardAssets = {
  heroImage: '/catalog_pic1.jpg',
  avatar:
    'https://www.figma.com/api/mcp/asset/14fac342-428c-4536-be15-2e0bfe9240a2',
  headerLogo: '/logo.jpg',
  footerLogo: '/logo.jpg',
  scenarioIcons: {
    meeting: 'https://www.figma.com/api/mcp/asset/554cfaeb-3304-47cb-8afd-882d5cd4468d',
    restaurant: 'https://www.figma.com/api/mcp/asset/364f3915-83ea-433b-ade2-bf8807bfdc36',
    interview: 'https://www.figma.com/api/mcp/asset/6ec031ec-dcba-42c2-966a-8928b7af59b6',
    flight: 'https://www.figma.com/api/mcp/asset/9e614f99-b2a0-4162-9896-547d8fbae80a',
    lock: 'https://www.figma.com/api/mcp/asset/6a5fd9ce-7c9a-4da1-b110-944322a32683',
  },
  statIcons: {
    streak: 'https://www.figma.com/api/mcp/asset/a78e580f-7d2d-426d-9012-23b09596ae6a',
    hours: 'https://www.figma.com/api/mcp/asset/cb6c5e67-b445-4c22-9299-2737c4bfc5e9',
    completed: 'https://www.figma.com/api/mcp/asset/3ef26edd-85dc-4cd2-8568-b7e4fa4322a5',
  },
  scenarios: {
    meetingPeople:
      'https://www.figma.com/api/mcp/asset/26cac6a9-93d6-4ff8-9e94-16420addf6be',
    restaurant:
      'https://www.figma.com/api/mcp/asset/9c3e1afa-241d-47c4-90ad-7b6a8dfb3aae',
    interview:
      'https://www.figma.com/api/mcp/asset/01e60b7e-a984-45d0-a9e0-92521e76deee',
    flight: 'https://www.figma.com/api/mcp/asset/9ac561d3-0bec-49e9-a763-53f3c8fd157b',
  },
} as const;

export type ScenarioItem = {
  id: string;
  title: string;
  description: string;
  badge: 'beginner' | 'intermediate' | 'advanced';
  image: string;
  icon: string;
  progress: number;
};

const progressByConversationId: Record<string, number> = {
  'meeting-new-people': 85,
  'restaurant-order': 65,
  'job-interview': 12,
  'at-the-airport': 15,
  'doctor-visit': 28,
};

const pickScenarioIcon = (category: string): string => {
  const normalized = category.toLowerCase();

  if (normalized.includes('social')) return dashboardAssets.scenarioIcons.meeting;
  if (normalized.includes('dining') || normalized.includes('shopping')) {
    return dashboardAssets.scenarioIcons.restaurant;
  }
  if (normalized.includes('professional') || normalized.includes('technology')) {
    return dashboardAssets.scenarioIcons.interview;
  }

  return dashboardAssets.scenarioIcons.flight;
};

export const scenarioItems: ScenarioItem[] = conversations.map((conversation) => ({
  id: conversation.id,
  title: conversation.title,
  description: conversation.description,
  badge: conversation.difficulty,
  image: conversation.thumbnail,
  icon: pickScenarioIcon(conversation.category),
  progress: progressByConversationId[conversation.id] ?? 0,
}));

export const inProgressScenarioItems: ScenarioItem[] = scenarioItems.filter(
  (item) => item.progress > 0 && item.progress < 100
);

const pickDeterministicItems = <T extends { id: string }>(
  items: T[],
  count: number,
): T[] => {
  if (items.length <= count) {
    return items;
  }

  return [...items]
    .sort((a, b) => a.id.localeCompare(b.id))
    .slice(0, count);
};

export const journeyScenarioItems: ScenarioItem[] =
  inProgressScenarioItems.length > 0
    ? inProgressScenarioItems
    : pickDeterministicItems(scenarioItems, 5);

