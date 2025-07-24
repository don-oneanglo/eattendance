
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader, Upload } from "lucide-react";
import Papa from "papaparse";

type ImportCSVProps<T> = {
  onImport: (data: T[]) => Promise<{ success: boolean; error?: string, count?: number }>;
  requiredHeaders: (keyof T)[];
  buttonLabel?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  onSuccess?: () => void;
};

export function ImportCSV<T extends Record<string, any>>({
  onImport,
  requiredHeaders,
  buttonLabel = "Import CSV",
  dialogTitle = "Import from CSV",
  dialogDescription = "Upload a CSV file with the required headers to import data.",
  onSuccess,
}: ImportCSVProps<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!file) {
      toast({ variant: "destructive", title: "No file selected." });
      return;
    }

    setIsLoading(true);

    Papa.parse<T>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const headers = results.meta.fields || [];
        const missingHeaders = requiredHeaders.filter(
          (h) => !headers.includes(h as string)
        );

        if (missingHeaders.length > 0) {
          toast({
            variant: "destructive",
            title: "Invalid CSV Headers",
            description: `Missing required headers: ${missingHeaders.join(", ")}`,
          });
          setIsLoading(false);
          return;
        }

        const result = await onImport(results.data);
        setIsLoading(false);

        if (result.success) {
          toast({
            title: "Import Successful",
            description: `${result.count || 0} records have been imported/updated.`,
          });
          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          if (onSuccess) onSuccess();
        } else {
          toast({
            variant: "destructive",
            title: "Import Failed",
            description: result.error || "An unknown error occurred.",
          });
        }
      },
      error: (error) => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "CSV Parsing Error",
          description: error.message,
        });
      },
    });
  };

  return (
    <div className="space-y-4">
        <div>
            <h3 className="text-lg font-medium">{dialogTitle}</h3>
            <p className="text-sm text-muted-foreground">{dialogDescription}</p>
        </div>
        <div className="space-y-2">
            <label className="text-sm font-medium">Required Headers</label>
            <div className="flex flex-wrap gap-2">
            {requiredHeaders.map((header, index) => (
                <code key={index} className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                {header as string}
                </code>
            ))}
            </div>
        </div>
        <div className="flex items-center space-x-2">
            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-primary/10 file:text-primary
                hover:file:bg-primary/20"
            />
        </div>
        <Button onClick={handleImport} disabled={isLoading || !file} className="w-full">
            {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            {isLoading ? "Importing..." : buttonLabel}
        </Button>
    </div>
  );
}
