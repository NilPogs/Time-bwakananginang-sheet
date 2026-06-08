import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Database } from '@/lib/types/database';

type TimesheetEntry = Database['public']['Tables']['timesheet_entries']['Row'];

interface ExportOptions {
  entries: TimesheetEntry[];
  userName: string;
  startDate: string;
  endDate: string;
}

export const exportToPDF = ({ entries, userName, startDate, endDate }: ExportOptions) => {
  const doc = new jsPDF();

  const darkRed = [139, 0, 0] as [number, number, number];
  const lightRed = [254, 242, 242] as [number, number, number];
  const white = [255, 255, 255] as [number, number, number];
  const black = [0, 0, 0] as [number, number, number];
  const gray = [100, 100, 100] as [number, number, number];

  // Header
  doc.setFontSize(22);
  doc.setTextColor(...darkRed);
  doc.setFont('helvetica', 'bold');
  doc.text('Timesheet Report', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(...gray);
  doc.setFont('helvetica', 'normal');
  doc.text(`Employee: ${userName}`, 14, 28);
  doc.text(`Period: ${formatDate(startDate)} - ${formatDate(endDate)}`, 14, 34);

  // Divider line
  doc.setDrawColor(...darkRed);
  doc.setLineWidth(0.5);
  doc.line(14, 38, 196, 38);

  // Group entries by date
  const groupedEntries = entries
    .filter((e) => e.end_time !== null)
    .reduce((groups: Record<string, TimesheetEntry[]>, entry) => {
      const date = entry.entry_date;
      if (!groups[date]) groups[date] = [];
      groups[date].push(entry);
      return groups;
    }, {});

  const sortedDates = Object.keys(groupedEntries).sort();

  let currentY = 44;

  sortedDates.forEach((date, index) => {
    const dayEntries = groupedEntries[date];

    // Day header
    doc.setFontSize(10);
    doc.setTextColor(...darkRed);
    doc.setFont('helvetica', 'bold');
    doc.text(formatDate(date), 14, currentY);

    // Day total
    const dayMinutes = dayEntries.reduce((sum, e) => sum + (e.duration_minutes || 0), 0);
    const dayHours = Math.floor(dayMinutes / 60);
    const dayMins = dayMinutes % 60;
    doc.setTextColor(...gray);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Total: ${dayHours}h ${dayMins}m`, 160, currentY);

    currentY += 2;

    const tableData = dayEntries.map((entry) => [
      formatTime(entry.start_time),
      entry.end_time ? formatTime(entry.end_time) : '-',
      entry.end_time ? calculateDuration(entry.start_time, entry.end_time) : '-',
      entry.activity,
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Start', 'End', 'Duration', 'Description']],
      body: tableData,
      theme: 'plain',
      headStyles: {
        fillColor: darkRed,
        textColor: white,
        fontSize: 9,
        fontStyle: 'bold',
        cellPadding: 3,
      },
      bodyStyles: {
        fontSize: 9,
        textColor: black,
        cellPadding: 3,
        lineColor: [220, 220, 220] as [number, number, number],
        lineWidth: 0.2,
      },
      alternateRowStyles: {
        fillColor: lightRed,
      },
      tableLineColor: darkRed,
      tableLineWidth: 0.3,
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 'auto' },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + (index < sortedDates.length - 1 ? 10 : 6);
  });

  // Grand total
  const totalMinutes = entries
    .filter((e) => e.end_time !== null)
    .reduce((total, entry) => {
      return total + (entry.duration_minutes || 0);
    }, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  doc.setDrawColor(...darkRed);
  doc.setLineWidth(0.5);
  doc.line(14, currentY, 196, currentY);
  currentY += 5;

  doc.setFontSize(10);
  doc.setTextColor(...darkRed);
  doc.setFont('helvetica', 'bold');
  doc.text(`Grand Total: ${totalHours}h ${remainingMinutes}m`, 14, currentY);

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...gray);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Generated on ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`,
      14,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width - 30,
      doc.internal.pageSize.height - 10
    );
  }

  const filename = `timesheet_${formatDateForFilename(startDate)}_${formatDateForFilename(endDate)}.pdf`;
  doc.save(filename);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const calculateDuration = (startTime: string, endTime: string): string => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end.getTime() - start.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

const formatDateForFilename = (dateString: string): string => {
  return dateString.replace(/-/g, '');
};