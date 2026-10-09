import React, { useState } from 'react';
import { UploadCloud, Download, CheckCircle, AlertCircle, FileSpreadsheet, Loader2 } from 'lucide-react';

export const CsvImportPipeline: React.FC = () => {
  const [csvContent, setCsvContent] = useState(
    `name,studentId,department,year,cgpa,targetRecruiter,targetRole,readiness
Rahul Varma,CT1401,CSE,Final Year,8.6,TCS,Software Engineer,78
Kavitha Reddy,CT1402,IT,Final Year,8.1,Infosys,Systems Engineer,74
Sanjay Krishna,CT1403,AI & DS,Final Year,8.9,Zoho,Software Developer,84`
  );

  const [parsing, setParsing] = useState(false);
  const [report, setReport] = useState<{
    success: boolean;
    message: string;
    job?: any;
  } | null>(null);

  const handleImport = async () => {
    if (!csvContent.trim()) return;
    setParsing(true);
    setReport(null);

    try {
      const lines = csvContent.trim().split('\n');
      if (lines.length < 2) {
        setReport({ success: false, message: 'CSV must contain a header row and at least 1 data row.' });
        setParsing(false);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const rows: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length === headers.length) {
          const rowObj: Record<string, string> = {};
          headers.forEach((h, idx) => {
            rowObj[h] = values[idx];
          });
          rows.push(rowObj);
        }
      }

      const res = await fetch('/api/import/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rows,
          fileName: 'campus_cohort_upload.csv'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setReport({
          success: true,
          message: data.message,
          job: data.job
        });
      } else {
        const err = await res.json();
        setReport({ success: false, message: err.error || 'Import failed.' });
      }
    } catch (err: any) {
      setReport({ success: false, message: err?.message || 'CSV parse failed.' });
    } finally {
      setParsing(false);
    }
  };

  const sampleTemplate = `name,studentId,department,year,cgpa,targetRecruiter,targetRole,readiness
Ananya Sharma,CT1404,ECE,Final Year,8.3,Wipro,Project Engineer,72`;

  const handleDownloadTemplate = () => {
    const blob = new Blob([sampleTemplate], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'careertwin_student_template.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-neutral-900" />
            Institutional CSV Import & Data Provenance Pipeline
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Ingest approved college student records with transactional rollback, schema validation, and audit logging.
          </p>
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-colors w-fit"
        >
          <Download className="w-4 h-4 text-neutral-900" />
          <span>Download Sample CSV Template</span>
        </button>
      </div>

      {/* CSV Input Card */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-neutral-900">
            CSV Records Payload (Paste or Upload)
          </label>
          <span className="text-[11px] text-neutral-400 font-mono">
            Required headers: name, department, year, targetRecruiter
          </span>
        </div>

        <textarea
          value={csvContent}
          onChange={e => setCsvContent(e.target.value)}
          rows={8}
          className="w-full p-3.5 text-xs font-mono bg-white border border-neutral-300 rounded-xl outline-none text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900"
          placeholder="Paste CSV rows here..."
        />

        <div className="flex items-center justify-between pt-2">
          <div className="text-[11px] text-neutral-500">
            Records imported here receive the <strong>Verified Institutional Record</strong> provenance tag.
          </div>

          <button
            onClick={handleImport}
            disabled={parsing || !csvContent.trim()}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-colors"
          >
            {parsing ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <UploadCloud className="w-4 h-4 text-white" />}
            <span>Validate & Execute Import</span>
          </button>
        </div>
      </div>

      {/* Success / Error Report */}
      {report && (
        <div
          className={`p-5 rounded-2xl border ${
            report.success
              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
              : 'bg-rose-50/60 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-xs lg:text-sm">
            {report.success ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{report.message}</span>
          </div>

          {report.job && (
            <div className="mt-3 text-xs font-mono space-y-1">
              <div>Job ID: {report.job.id}</div>
              <div>Processed Rows: {report.job.rowCount} (Success: {report.job.successCount}, Errors: {report.job.errorCount})</div>
              <div>Transaction Status: {report.job.status}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
