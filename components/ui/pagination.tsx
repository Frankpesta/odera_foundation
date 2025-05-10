"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	className,
	...props
}: PaginationProps) {
	const hasPreviousPage = currentPage > 1;
	const hasNextPage = currentPage < totalPages;

	const getPageNumbers = () => {
		const visiblePageCount = 5;
		const pageRange = [];

		let startPage = Math.max(1, currentPage - Math.floor(visiblePageCount / 2));
		let endPage = Math.min(
			totalPages,
			currentPage + Math.floor(visiblePageCount / 2)
		);

		if (totalPages <= visiblePageCount) {
			startPage = 1;
			endPage = totalPages;
		} else {
			const remainingStart = visiblePageCount - (endPage - startPage + 1);
			startPage = Math.max(1, startPage - remainingStart);
			const remainingEnd = visiblePageCount - (endPage - startPage + 1);
			endPage = Math.min(totalPages, endPage + remainingEnd);
		}

		for (let i = startPage; i <= endPage; i++) {
			pageRange.push(i);
		}

		return pageRange;
	};

	const pageNumbers = getPageNumbers();

	return (
		<div
			className={cn("flex items-center justify-center", className)}
			{...props}>
			{hasPreviousPage ? (
				<button
					onClick={() => onPageChange(currentPage - 1)}
					className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9">
					Previous
				</button>
			) : (
				<button
					disabled
					className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9">
					Previous
				</button>
			)}

			{pageNumbers[0] > 1 && (
				<>
					<button
						onClick={() => onPageChange(1)}
						className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9">
						1
					</button>
					{pageNumbers[0] > 2 && (
						<span className="h-9 w-9 text-sm font-medium">...</span>
					)}
				</>
			)}

			{pageNumbers.map((page) => (
				<button
					key={page}
					onClick={() => onPageChange(page)}
					className={cn(
						"inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9",
						page === currentPage && "bg-secondary text-secondary-foreground"
					)}>
					{page}
				</button>
			))}

			{pageNumbers[pageNumbers.length - 1] < totalPages && (
				<>
					{pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
						<span className="h-9 w-9 text-sm font-medium">...</span>
					)}
					<button
						onClick={() => onPageChange(totalPages)}
						className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9">
						{totalPages}
					</button>
				</>
			)}

			{hasNextPage ? (
				<button
					onClick={() => onPageChange(currentPage + 1)}
					className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9">
					Next
				</button>
			) : (
				<button
					disabled
					className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9">
					Next
				</button>
			)}
		</div>
	);
}
