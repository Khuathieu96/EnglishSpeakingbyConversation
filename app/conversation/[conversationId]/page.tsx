import { ExampleConversationScreen } from '../ExampleConversationScreen';

type Params = {
  conversationId: string;
};

export default async function ConversationByIdPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { conversationId } = await params;

  return <ExampleConversationScreen conversationId={conversationId} />;
}
