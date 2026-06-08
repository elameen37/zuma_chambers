// ─── PDF Export Service ─────────────────────────────────────────
// Handles client-side PDF generation for invoices, reports, and case briefs

import type { Matter } from './matter-service';

export type PDFExportType = 'invoice' | 'case-summary' | 'hearing-prep' | 'annual-report' | 'docket';

interface ExportOptions {
  type: PDFExportType;
  title: string;
  data: Record<string, unknown>;
  filename?: string;
}

export async function exportToPDF(options: ExportOptions): Promise<void> {
  const { jsPDF } = await import('jspdf');

  const { type, title, data, filename } = options;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // ── Header ───────────────────────────────────────────────────
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageWidth, 45, 'F');
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 42, pageWidth, 1.5, 'F');

  doc.setTextColor(212, 175, 55);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('XYZ Chambers', margin, 20);

  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('ENTERPRISE LEGAL MANAGEMENT SYSTEM', margin, 28);
  doc.text(`Generated: ${new Date().toLocaleString('en-NG', { dateStyle: 'full', timeStyle: 'short' })}`, margin, 34);

  // ── Title Block ──────────────────────────────────────────────
  doc.setTextColor(20, 20, 20);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), margin, 62);

  doc.setFillColor(212, 175, 55);
  doc.rect(margin, 65, 60, 0.5, 'F');

  // ── Content ──────────────────────────────────────────────────
  let y = 80;

  if (type === 'docket') {
    const mattersList = (data.matters as Matter[]) || [];
    
    // Draw table headers
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(212, 175, 55); // Gold
    doc.text('SUIT NO / COURT', margin, y);
    doc.text('MATTER TITLE & CLIENT', margin + 55, y);
    doc.text('STAGE', margin + 115, y);
    doc.text('RISK', margin + 140, y);
    doc.text('LEAD COUNSEL', margin + 160, y);
    
    y += 4;
    doc.setFillColor(212, 175, 55);
    doc.rect(margin, y, pageWidth - margin * 2, 0.5, 'F');
    y += 8;

    for (const m of mattersList) {
      if (y > pageHeight - 35) {
        doc.addPage();
        y = 25;
        
        // Repeat headers
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(212, 175, 55);
        doc.text('SUIT NO / COURT', margin, y);
        doc.text('MATTER TITLE & CLIENT', margin + 55, y);
        doc.text('STAGE', margin + 115, y);
        doc.text('RISK', margin + 140, y);
        doc.text('LEAD COUNSEL', margin + 160, y);
        
        y += 4;
        doc.setFillColor(212, 175, 55);
        doc.rect(margin, y, pageWidth - margin * 2, 0.5, 'F');
        y += 8;
      }

      // 1. Suit No & Court
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(20, 20, 20);
      doc.text(m.suitNumber || 'N/A', margin, y);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      const courtStr = m.court || 'N/A';
      const courtLines = doc.splitTextToSize(courtStr, 50);
      doc.text(courtLines, margin, y + 4.5);

      // 2. Title & Client
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(20, 20, 20);
      const titleStr = m.title || 'N/A';
      const titleLines = doc.splitTextToSize(titleStr, 55);
      doc.text(titleLines, margin + 55, y);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(`Client: ${m.client || 'N/A'}`, margin + 55, y + 4.5 + ((titleLines.length - 1) * 4));

      // 3. Stage
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(50, 50, 50);
      doc.text(m.stage || 'N/A', margin + 115, y);

      // 4. Risk Level
      const risk = m.riskLevel || 'Low';
      if (risk === 'Critical' || risk === 'High') {
        doc.setTextColor(180, 40, 40); // Red
      } else if (risk === 'Medium') {
        doc.setTextColor(212, 140, 0); // Orange
      } else {
        doc.setTextColor(40, 140, 40); // Green
      }
      doc.setFont('helvetica', 'bold');
      doc.text(risk, margin + 140, y);

      // 5. Lead Counsel
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      doc.text(m.leadCounsel || 'Unassigned', margin + 160, y);

      // Calculate row height
      const courtHeight = courtLines.length * 4.5 + 4;
      const titleHeight = titleLines.length * 4 + 6;
      const rowHeight = Math.max(14, courtHeight, titleHeight);
      
      y += rowHeight;

      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.2);
      doc.line(margin, y - 2, pageWidth - margin, y - 2);
      y += 2;
    }
  } else {
    doc.setFontSize(10);

    const entries = Object.entries(data);
    for (const [key, value] of entries) {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 100, 100);
      doc.text(key.toUpperCase().replace(/_/g, ' '), margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(20, 20, 20);
      const valueStr = String(value ?? 'N/A');
      const lines = doc.splitTextToSize(valueStr, pageWidth - margin * 2);
      doc.text(lines, margin + 60, y);

      y += Math.max(8, lines.length * 6);
    }
  }

  // ── Footer ───────────────────────────────────────────────────
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFillColor(10, 10, 10);
    doc.rect(0, pageHeight - 14, pageWidth, 14, 'F');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(7);
    doc.text('STRICTLY CONFIDENTIAL — XYZ Chambers Legal Intelligence Platform', margin, pageHeight - 7);
    doc.text(`Page ${i} / ${pages}`, pageWidth - margin - 20, pageHeight - 7);
  }

  const safeFilename = filename ?? `xyz-${type}-${Date.now()}.pdf`;
  doc.save(safeFilename);
}

export async function exportElementToPDF(elementId: string, filename: string): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const { default: html2canvas } = await import('html2canvas');

  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Element #${elementId} not found`);

  const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0a0a0a', useCORS: true });
  const imgData = canvas.toDataURL('image/png');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * pageWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    doc.addPage();
    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  doc.save(filename);
}
