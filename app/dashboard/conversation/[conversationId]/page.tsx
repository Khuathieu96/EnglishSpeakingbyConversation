import { redirect } from 'next/navigation';

type Params = {
  conversationId: string;
};

export default async function LegacyPolishConversationPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { conversationId } = await params;
  redirect(`/conversation/${conversationId}`);
}
