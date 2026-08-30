import { db } from "@/lib/db";
import ProjectTableView from "@/app/(DashboardLayout)/components/dashboard/ProjectTableView";

const ProjectTables = async () => {
  const tableData = await db.project.findMany();

  return <ProjectTableView tableData={tableData} />;
};

export default ProjectTables;
