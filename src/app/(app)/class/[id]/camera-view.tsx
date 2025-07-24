"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader, Sparkles, CameraOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { autoAttendance } from "@/ai/flows/auto-attendance";

type CameraViewProps = {
  classId: string;
};

export function CameraView({ classId }: CameraViewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }

  }, [toast]);


  const captureFrame = useCallback(() => {
    if (!videoRef.current) return null;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg");
  }, []);

  const handleAutoAttend = async () => {
    setIsLoading(true);
    setScanProgress(0);
    const frames: string[] = [];
    const captureInterval = 500; // ms
    const scanDuration = 3000; // ms
    const frameCount = scanDuration / captureInterval;

    const capturePromise = new Promise<void>((resolve) => {
      const intervalId = setInterval(() => {
        const frame = captureFrame();
        if (frame) {
          frames.push(frame);
        }
        setScanProgress((prev) => prev + 100 / frameCount);

        if (frames.length >= frameCount) {
          clearInterval(intervalId);
          resolve();
        }
      }, captureInterval);
    });

    await capturePromise;

    if (frames.length === 0) {
      toast({
        title: "Error",
        description: "Could not capture any images from the camera.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    try {
        const result = await autoAttendance({
            classId: classId,
            studentImageDataUris: frames,
        });

        setIsLoading(false);
        setScanProgress(0);
        
        const presentNames = result.presentStudents;
        if (presentNames.length > 0) {
            toast({
                title: "Attendance Scan Complete",
                description: `Identified: ${presentNames.join(', ')}. The roster will be updated shortly.`,
                variant: "default",
            });
        } else {
            toast({
                title: "No students recognized",
                description: "Please ensure students are clearly visible and try again.",
                variant: "default",
            });
        }
    } catch (error) {
        setIsLoading(false);
        setScanProgress(0);
        console.error("Error running auto-attendance:", error);
        toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Could not complete auto-attendance.",
            variant: "destructive",
        });
    }
  };


  return (
    <Card className="flex-1 flex flex-col p-4 gap-4 max-w-sm mx-auto w-full">
      <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-secondary border border-dashed flex items-center justify-center">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        <div className="absolute w-[calc(100%-2rem)] h-[calc(100%-2rem)] border-4 border-white/50 rounded-lg z-20 pointer-events-none"></div>

        {hasCameraPermission === false && (
            <div className="absolute inset-0 bg-secondary/80 flex flex-col items-center justify-center text-center p-4">
                <CameraOff className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="font-bold text-xl">Camera Not Available</h3>
                <p className="text-muted-foreground">Please grant camera permissions to use the scanner.</p>
            </div>
        )}
        {hasCameraPermission === null && (
             <div className="absolute inset-0 bg-secondary/80 flex flex-col items-center justify-center text-center p-4">
                <Loader className="h-16 w-16 text-muted-foreground animate-spin mb-4" />
                <h3 className="font-bold text-xl">Accessing Camera...</h3>
            </div>
        )}
        {isLoading && (
            <div className="absolute inset-0 bg-primary/80 flex flex-col items-center justify-center text-center p-4 text-primary-foreground">
                <Loader className="h-16 w-16 animate-spin mb-4" />
                <h3 className="font-bold text-xl">Scanning...</h3>
                <div className="w-full bg-primary-foreground/20 rounded-full h-2.5 mt-4">
                  <div className="bg-primary-foreground h-2.5 rounded-full" style={{ width: `${scanProgress}%` }}></div>
                </div>
            </div>
        )}
      </div>
       <Button onClick={handleAutoAttend} disabled={isLoading || !hasCameraPermission}>
        {isLoading ? (
          <Loader className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        Scan Faces for Attendance
      </Button>
    </Card>
  );
}
