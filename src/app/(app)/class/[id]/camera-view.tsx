"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader, Sparkles, AlertTriangle, CameraOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { runAutoAttendance } from "@/lib/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type CameraViewProps = {
  classId: string;
};

export function CameraView({ classId }: CameraViewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
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
        // Stop camera stream when component unmounts
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
    canvas.height = video_ref.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg");
  }, []);

  const handleAutoAttend = async () => {
    setIsLoading(true);
    const imageDataUri = captureFrame();

    if (!imageDataUri) {
      toast({
        title: "Error",
        description: "Could not capture image from camera.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // In a real app, you might send multiple frames. For this demo, one is enough.
    const result = await runAutoAttendance(classId, [imageDataUri]);
    setIsLoading(false);

    if (result.success && result.presentStudents) {
      const presentNames = result.presentStudents;
      // Note: We are not updating the roster here directly.
      // This would require a more complex state management (e.g., Zustand, Redux, or Context)
      // to share state between sibling components (CameraView and StudentRoster).
      // For now, we'll just show a toast.
      toast({
        title: "Attendance Scan Complete",
        description: `Identified: ${presentNames.join(', ')}. The roster will be updated shortly.`,
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Could not complete auto-attendance.",
        variant: "destructive",
      });
    }
  };


  return (
    <Card className="flex-1 flex flex-col p-4 gap-4">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-secondary border border-dashed flex items-center justify-center">
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

      </div>
       <Button onClick={handleAutoAttend} disabled={isLoading || !hasCameraPermission}>
        {isLoading ? (
          <Loader className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        Scan Face for Attendance
      </Button>
       {hasCameraPermission === false && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Camera Access Denied</AlertTitle>
            <AlertDescription>
                You need to allow camera access in your browser settings to use this feature.
            </AlertDescription>
          </Alert>
       )}
    </Card>
  );
}
