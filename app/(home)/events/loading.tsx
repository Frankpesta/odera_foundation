import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventsLoading() {
	return (
		<div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{[1, 2, 3, 4, 5, 6].map((i) => (
				<Card key={i} className="overflow-hidden">
					<Skeleton className="h-48 w-full" />
					<CardContent className="p-6">
						<Skeleton className="h-6 w-3/4 mb-2" />
						<Skeleton className="h-4 w-1/2 mb-2" />
						<Skeleton className="h-4 w-2/3 mb-2" />
						<Skeleton className="h-4 w-1/3 mb-4" />
						<Skeleton className="h-20 w-full mb-4" />
						<div className="flex justify-between">
							<Skeleton className="h-10 w-28" />
							<Skeleton className="h-10 w-28" />
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
