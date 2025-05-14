// app/admin/contacts/page.tsx
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
import { Eye, Trash2 } from "lucide-react";
import {
	getContactSubmissions,
	deleteContactSubmission,
	updateContactSubmissionStatus,
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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function ContactSubmissionsPage() {
	const queryClient = useQueryClient();
	const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
	const [deleteId, setDeleteId] = useState<number | null>(null);
	const [viewModalOpen, setViewModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

	// Fetch contact submissions
	const { data: submissions, isLoading } = useQuery({
		queryKey: ["contact", "submissions"],
		queryFn: () => getContactSubmissions(),
	});

	// Delete mutation
	const deleteMutation = useMutation({
		mutationFn: (id: number) => deleteContactSubmission(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["contact", "submissions"] });
			setDeleteModalOpen(false);
		},
	});

	// Status update mutation with optimistic updates
	const statusUpdateMutation = useMutation({
		mutationFn: ({ id, status }: { id: number; status: string }) =>
			updateContactSubmissionStatus(id, status),
		// Optimistic update logic
		onMutate: async ({ id, status }) => {
			// Cancel any outgoing refetches to avoid overwriting our optimistic update
			await queryClient.cancelQueries({ queryKey: ["contact", "submissions"] });

			// Snapshot the previous value
			const previousSubmissions = queryClient.getQueryData([
				"contact",
				"submissions",
			]);

			// Optimistically update to the new value
			queryClient.setQueryData(["contact", "submissions"], (old: any) =>
				old.map((submission: any) =>
					submission.id === id ? { ...submission, status } : submission
				)
			);

			// Return a context object with the snapshotted value
			return { previousSubmissions };
		},
		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, variables, context) => {
			if (context?.previousSubmissions) {
				queryClient.setQueryData(
					["contact", "submissions"],
					context.previousSubmissions
				);
			}
		},
		// Always refetch after error or success:
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["contact", "submissions"] });
		},
	});

	const handleView = (submission: any) => {
		// Only update status if it's currently unread
		if (submission.status === "unread") {
			statusUpdateMutation.mutate({ id: submission.id, status: "read" });
		}
		setSelectedSubmission(submission);
		setViewModalOpen(true);
	};

	const handleDelete = (id: number) => {
		setDeleteId(id);
		setDeleteModalOpen(true);
	};

	const confirmDelete = () => {
		if (deleteId) {
			deleteMutation.mutate(deleteId);
		}
	};

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className="container px-4 py-12 w-full mx-auto">
			<h1 className="text-3xl font-bold tracking-tight mb-8">
				Enquiry / Contact Submissions
			</h1>

			<Card className="mt-8">
				<CardHeader>
					<CardTitle>Manage Contact Submissions</CardTitle>
					<CardDescription>
						View, edit, or delete contact submissions.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Subject</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{submissions?.map((submission: any) => (
								<TableRow key={submission.id}>
									<TableCell className="font-medium">
										{submission.firstName} {submission.lastName}
									</TableCell>
									<TableCell>{submission.email}</TableCell>
									<TableCell>{submission.subject}</TableCell>
									<TableCell>
										{new Date(submission.createdAt).toLocaleDateString()}
									</TableCell>
									<TableCell>
										<span
											className={`px-2 py-1 rounded-full text-xs capitalize ${
												submission.status === "unread"
													? "bg-yellow-100 text-yellow-800"
													: "bg-green-100 text-green-800"
											}`}>
											{submission.status}
										</span>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end space-x-2">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => handleView(submission)}
												disabled={statusUpdateMutation.isPending}>
												<Eye className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												onClick={() => handleDelete(submission.id)}
												disabled={deleteMutation.isPending}>
												<Trash2 className="h-4 w-4 text-red-500" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* View Modal */}
			<Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Contact Submission Details</DialogTitle>
					</DialogHeader>
					{selectedSubmission && (
						<div className="space-y-4">
							<div>
								<h4 className="font-medium">From:</h4>
								<p>
									{selectedSubmission.firstName} {selectedSubmission.lastName}
								</p>
								<p>{selectedSubmission.email}</p>
								{selectedSubmission.phone && <p>{selectedSubmission.phone}</p>}
							</div>
							<div>
								<h4 className="font-medium">Subject:</h4>
								<p>{selectedSubmission.subject}</p>
							</div>
							<div>
								<h4 className="font-medium">Message:</h4>
								<p className="whitespace-pre-line">
									{selectedSubmission.message}
								</p>
							</div>
							<div>
								<h4 className="font-medium">Date:</h4>
								<p>{new Date(selectedSubmission.createdAt).toLocaleString()}</p>
							</div>
							<div>
								<h4 className="font-medium">Status:</h4>
								<p>
									<span
										className={`px-2 py-1 rounded-full text-xs capitalize ${
											selectedSubmission.status === "unread"
												? "bg-yellow-100 text-yellow-800 capitalize"
												: "bg-green-100 text-green-800 capitalize"
										}`}>
										{selectedSubmission.status}
									</span>
								</p>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Modal */}
			<AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							contact submission.
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
