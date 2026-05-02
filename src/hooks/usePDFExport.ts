'use client';

import { useState, useCallback } from 'react';
import type { PDFExportType } from '@/lib/pdf-service';

interface UsePDFExportOptions {
  type: PDFExportType;
  title: string;
  filename?: string;
}

export function usePDFExport(options: UsePDFExportOptions) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = useCallback(async (data: Record<string, unknown>) => {
    setIsExporting(true);
    setError(null);
    try {
      const { exportToPDF } = await import('@/lib/pdf-service');
      await exportToPDF({ ...options, data });
    } catch (err) {
      setError(String(err));
    } finally {
      setIsExporting(false);
    }
  }, [options]);

  const exportElement = useCallback(async (elementId: string) => {
    setIsExporting(true);
    setError(null);
    try {
      const { exportElementToPDF } = await import('@/lib/pdf-service');
      await exportElementToPDF(elementId, options.filename ?? `zuma-${options.type}-${Date.now()}.pdf`);
    } catch (err) {
      setError(String(err));
    } finally {
      setIsExporting(false);
    }
  }, [options]);

  return { exportData, exportElement, isExporting, error };
}
