// app/admin/newsletters/page.tsx
"use client";

import { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Download } from "lucide-react";
import {
	getActiveSubscribers,
	deleteSubscriber,
} from "@/actions/contact.actions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { exportToExcel, exportToPDF } from "@/lib/export-utils";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function NewsletterSubscribersPage() {
	const queryClient = useQueryClient();
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

	// Fetch subscribers
	const { data: subscribers, isLoading } = useQuery({
		queryKey: ["newsletter", "subscribers"],
		queryFn: () => getActiveSubscribers(),
	});

	const deleteMutation = useMutation({
		mutationFn: (email: string) => deleteSubscriber(email),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["newsletter", "subscribers"],
			});
			setDeleteModalOpen(false);
		},
	});

	const handleDelete = (email: string) => {
		setDeleteId(email);
		setDeleteModalOpen(true);
	};

	const confirmDelete = () => {
		if (deleteId) {
			deleteMutation.mutate(deleteId);
		}
	};

	const handleExport = (format: "excel" | "pdf") => {
		if (!subscribers) return;

		const data = subscribers.map((sub: any) => ({
			Email: sub.email,
			Name: sub.name || "N/A",
			"Signup Date": new Date(sub.subscribedAt).toLocaleDateString(),
			Source: sub.source || "N/A",
			Status: sub.status,
		}));

		if (format === "excel") {
			exportToExcel(data, "newsletter-subscribers");
		} else {
			exportToPDF(data, "newsletter-subscribers");
		}
	};

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className="container px-4 py-12 w-full mx-auto">
			<h1 className="text-3xl font-bold tracking-tight mb-8">
				Newsletter Subscribers
			</h1>
			<div className="space-x-2">
				<Button variant="outline" onClick={() => handleExport("excel")}>
					<Download className="h-4 w-4 mr-2" />
					Export to Excel
				</Button>
				<Button variant="outline" onClick={() => handleExport("pdf")}>
					<Download className="h-4 w-4 mr-2" />
					Export to PDF
				</Button>
			</div>

			<Card className="mt-8">
				<CardHeader>
					<CardTitle>Manage Subscriptions</CardTitle>
					<CardDescription>
						View, edit, or delete existing Subscribers.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Email</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Signup Date</TableHead>
								<TableHead>Source</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{subscribers?.map((subscriber: any) => (
								<TableRow key={subscriber.email}>
									<TableCell className="font-medium">
										{subscriber.email}
									</TableCell>
									<TableCell>{subscriber.name || "N/A"}</TableCell>
									<TableCell>
										{new Date(subscriber.subscribedAt).toLocaleDateString()}
									</TableCell>
									<TableCell>{subscriber.source || "N/A"}</TableCell>
									<TableCell>
										<span
											className={`px-2 py-1 rounded-full text-xs ${
												subscriber.status === "active"
													? "bg-green-100 text-green-800 capitalize"
													: "bg-red-100 text-red-800 capitalize"
											}`}>
											{subscriber.status}
										</span>
									</TableCell>
									<TableCell className="text-right">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleDelete(subscriber.email)}>
											<Trash2 className="h-4 w-4 text-red-500" />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
			{/* Delete Confirmation Modal */}
			<AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will unsubscribe the user and remove them from the newsletter
							list.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							disabled={deleteMutation.isPending}>
							{deleteMutation.isPending ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
