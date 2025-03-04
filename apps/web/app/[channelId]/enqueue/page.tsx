import MediaEnqueueFormCard from '@/stream/components/media-enqueue-form-card';
import { mediaEnqueue } from '@/stream/actions/media-enqueue';

type PageProps = {
  params: Promise<{
    channelId: string;
  }>;
};

export default async function EnqueuePage({ params }: PageProps) {
  const { channelId } = await params;
  const bigIntChannelId = BigInt(channelId);
  return (
    <>
      <MediaEnqueueFormCard
        mediaEnqueueAction={mediaEnqueue}
        defaultValues={{
          channelId,
        }}
      />
    </>
  );
}
