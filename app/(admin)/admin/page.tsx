import DashboardPage from "@/components/dashboard";
import { getDashboardStats } from "@/actions/dashboard.actions";

const page = async () => {
	const stats = await getDashboardStats();
	return (
		<div>
			<DashboardPage stats={stats} />
		</div>
	);
};

export default page;
