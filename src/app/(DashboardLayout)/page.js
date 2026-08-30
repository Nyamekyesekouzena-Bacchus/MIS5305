import SalesChart from "@/app/(DashboardLayout)/components/dashboard/SalesChart";
import Feeds from "@/app/(DashboardLayout)/components/dashboard/Feeds";
import ProjectTables from "@/app/(DashboardLayout)/components/dashboard/ProjectTable";
import HomeView from "@/app/(DashboardLayout)/components/dashboard/HomeView";
import { db } from "@/lib/db";

export default async function Home() {
  const BlogData = await db.blog.findMany();

  return (
    <HomeView
      blogData={BlogData}
      salesChart={<SalesChart />}
      feeds={<Feeds />}
      projectTables={<ProjectTables />}
    />
  );
}
