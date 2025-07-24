"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader, CameraOff, ScanFace, Check, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { registerFaceFlow } from "@/ai/flows/register-face";
import { Student, Teacher } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type FaceRegistrationClientProps = {
  students: Student[];
  teachers: Teacher[];
};

export function FaceRegistrationClient({ students, teachers }: FaceRegistrationClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [personType, setPersonType] = useState<"student" | "teacher">("student");
  const [selectedPerson, setSelectedPerson] = useState<string>("");
  
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
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera permissions in your browser settings.",
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
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

  const handleRegisterFace = async () => {
    if (!selectedPerson) {
      toast({
        variant: "destructive",
        title: "No Person Selected",
        description: `Please select a ${personType} to register.`,
      });
      return;
    }
    
    setIsLoading(true);
    setIsRegistered(false);

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

    const person = personType === 'student'
        ? students.find(s => s.studentCode === selectedPerson)
        : teachers.find(t => t.teacherCode === selectedPerson);
        
    if (!person) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not find the selected person's details.",
        });
        setIsLoading(false);
        return;
    }
    
    try {
        const result = await registerFaceFlow({
            personType,
            personCode: selectedPerson,
            imageDataUri: imageDataUri,
            originalName: person.name,
        });
        
        setIsLoading(false);

        if (result.success) {
          setIsRegistered(true);
          toast({
            title: "Face Registered!",
            description: `Successfully registered face for ${person.name}.`,
          });
          setTimeout(() => setIsRegistered(false), 3000);
        } else {
          toast({
            variant: "destructive",
            title: "Registration Failed",
            description: "An unknown error occurred during registration flow.",
          });
        }
    } catch (error) {
        setIsLoading(false);
        console.error("Error calling registerFaceFlow:", error);
        toast({
            variant: "destructive",
            title: "Registration Error",
            description: error instanceof Error ? error.message : "An unexpected error occurred.",
        });
    }
  };

  const currentList = personType === 'student' ? students : teachers;
  const personKey = personType === 'student' ? 'studentCode' : 'teacherCode';

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label>Select Person Type</Label>
            <Tabs value={personType} onValueChange={(value) => {
                setPersonType(value as "student" | "teacher");
                setSelectedPerson("");
            }} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="teacher">Teacher</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div>
            <Label htmlFor="person-select">Select {personType === 'student' ? 'Student' : 'Teacher'}</Label>
            <Select onValueChange={setSelectedPerson} value={selectedPerson}>
              <SelectTrigger id="person-select">
                <SelectValue placeholder={`Select a ${personType}...`} />
              </SelectTrigger>
              <SelectContent>
                {currentList.map((p) => (
                  <SelectItem key={p[personKey]} value={p[personKey]}>
                    {p.name} ({p[personKey]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleRegisterFace} disabled={isLoading || !hasCameraPermission || !selectedPerson} className="w-full text-lg py-6">
            {isLoading ? <Loader className="mr-2 h-6 w-6 animate-spin" /> : (isRegistered ? <UserCheck className="mr-2 h-6 w-6"/> : <ScanFace className="mr-2 h-6 w-6" />) }
            {isRegistered ? 'Registered!' : `Register ${personType}'s Face`}
          </Button>

        </CardContent>
      </Card>

      <Card className="flex-1 flex flex-col p-4 gap-4">
        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-secondary border border-dashed flex items-center justify-center">
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
              <h3 className="font-bold text-xl">Processing...</h3>
            </div>
          )}
           {isRegistered && (
            <div className="absolute inset-0 bg-success/80 flex flex-col items-center justify-center text-center p-4 text-success-foreground">
              <Check className="h-16 w-16 mb-4" />
              <h3 className="font-bold text-xl">Registration Complete!</h3>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
