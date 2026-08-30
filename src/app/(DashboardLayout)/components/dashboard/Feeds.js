import { db } from '@/lib/db';
import FeedsView from '@/app/(DashboardLayout)/components/dashboard/FeedsView';

const Feeds = async () => {
  const FeedData = await db.feed.findMany();

  return <FeedsView FeedData={FeedData} />;
};

export default Feeds;
