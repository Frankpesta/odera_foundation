import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToExcel = (data: any[], fileName: string) => {
	const worksheet = XLSX.utils.json_to_sheet(data);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
	XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = (data: any[], fileName: string) => {
	const doc = new jsPDF();

	// Extract headers
	const headers = Object.keys(data[0]);

	// Prepare data for the table
	const tableData = data.map(
		(item) =>
			Object.values(item).map((value) =>
				value instanceof Date ? value.toISOString() : value
			) as (string | number | boolean | null)[]
	);

	autoTable(doc, {
		head: [headers],
		body: tableData,
		theme: "grid",
		headStyles: {
			fillColor: [34, 197, 94], // emerald color
			textColor: 255,
		},
	});

	doc.save(`${fileName}.pdf`);
};
