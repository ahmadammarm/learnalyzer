import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	isLoading?: boolean;
}

export function Pagination({ currentPage, totalPages, onPageChange, isLoading }: PaginationProps) {
	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const maxVisible = 5;

		if (totalPages <= maxVisible) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		pages.push(1);

		if (currentPage > 3) {
			pages.push("...");
		}

		const start = Math.max(2, currentPage - 1);
		const end = Math.min(totalPages - 1, currentPage + 1);

		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		if (currentPage < totalPages - 2) {
			pages.push("...");
		}

		pages.push(totalPages);

		return pages;
	};

	return (
		<div className="flex items-center justify-between px-2">
			<div className="text-sm text-muted-foreground">
				Page {currentPage} of {totalPages}
			</div>

			<div className="flex items-center gap-1">
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1 || isLoading}
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>

				{getPageNumbers().map((page, index) => (
					<Button
						key={index}
						variant={page === currentPage ? "default" : "outline"}
						size="icon"
						onClick={() => typeof page === "number" && onPageChange(page)}
						disabled={typeof page !== "number" || isLoading}
						className="rounded-full transition-all"
					>
						{page}
					</Button>
				))}

				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages || isLoading}
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
