
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ScanFace, CheckCircle, Loader, CameraOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Logo } from "@/components/icons/logo";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { runTeacherAuthentication, getTeachersForLogin, createSession } from "@/lib/actions";
import { Teacher } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function LoginPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');

  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchTeachers = async () => {
        try {
            const teacherList = await getTeachersForLogin();
            setTeachers(teacherList);
        } catch (error) {
            console.error("Failed to fetch teachers:", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not load the list of teachers. Please check your connection and try again.'
            })
        }
    }
    fetchTeachers();
  }, [toast]);

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
      }
    };

    getCameraPermission();

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAuthenticated) {
      timer = setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);
  
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

  const handleLogin = async () => {
    if (!selectedTeacher) {
        toast({
            variant: "destructive",
            title: "No Teacher Selected",
            description: "Please select your name from the list to log in."
        });
        return;
    }
     if (!hasCameraPermission) {
       toast({
          variant: 'destructive',
          title: 'Cannot Scan',
          description: 'Camera access is required to perform face scanning.',
        });
        return;
    }
    
    setIsScanning(true);
    const imageDataUri = captureFrame();

    if (!imageDataUri) {
      toast({
        title: "Error",
        description: "Could not capture image from camera.",
        variant: "destructive",
      });
      setIsScanning(false);
      return;
    }
    
    try {
        const result = await runTeacherAuthentication({
            teacherCode: selectedTeacher,
            loginImageDataUri: imageDataUri,
        });
        
        const teacher = teachers.find(t => t.teacherCode === selectedTeacher);

        if (result.isMatch) {
            await createSession(selectedTeacher);
            setIsAuthenticated(true);
            toast({
                title: `Welcome, ${teacher?.name}!`,
                description: "You have been successfully authenticated.",
                variant: "default",
            });
        } else {
             setIsScanning(false);
             toast({
                title: "Authentication Failed",
                description: "Face does not match the registered profile. Please try again.",
                variant: "destructive",
            });
        }
    } catch(error) {
        setIsScanning(false);
        console.error("Error during teacher authentication:", error);
        toast({
            title: "Authentication Error",
            description: error instanceof Error ? error.message : "An unexpected error occurred during authentication.",
            variant: "destructive",
        });
    }

  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/admin');
  };

  const getButtonContent = () => {
    if (isAuthenticated) {
      return (
        <>
          <CheckCircle className="mr-2 h-5 w-5" /> Authenticated
        </>
      );
    }
    if (isScanning) {
      return (
        <>
          <Loader className="mr-2 h-5 w-5 animate-spin" /> Scanning...
        </>
      );
    }
    return (
      <>
        <ScanFace className="mr-2 h-5 w-5" /> Login with Face ID
      </>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="flex flex-col items-center justify-center w-full max-w-md">
        <Card className="w-full shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Logo />
            </div>
            <h1 className="font-headline text-3xl font-bold text-primary">FaceAttend</h1>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="teacher">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="teacher">Teacher Login</TabsTrigger>
                <TabsTrigger value="admin">Admin Login</TabsTrigger>
              </TabsList>
              <TabsContent value="teacher">
                <CardHeader className="p-0 pt-6 text-center">
                    <CardDescription>
                        Select your name, then scan your face to log in.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 pt-6">
                    <div className="space-y-4 mb-6">
                         <div>
                            <Label htmlFor="teacher-select">Teacher</Label>
                            <Select onValueChange={setSelectedTeacher} value={selectedTeacher}>
                              <SelectTrigger id="teacher-select">
                                <SelectValue placeholder="Select your name..." />
                              </SelectTrigger>
                              <SelectContent>
                                {teachers.map((p) => (
                                  <SelectItem key={p.teacherCode} value={p.teacherCode}>
                                    {p.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-secondary border border-dashed flex items-center justify-center">
                            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                            <div className="absolute w-[calc(100%-2rem)] h-[calc(100%-2rem)] border-4 border-white/50 rounded-lg z-20 pointer-events-none"></div>
                            
                            {hasCameraPermission === false && (
                                <div className="absolute inset-0 bg-secondary/80 flex flex-col items-center justify-center text-center p-4">
                                    <CameraOff className="h-16 w-16 text-muted-foreground mb-4" />
                                    <h3 className="font-bold text-xl">Camera Not Available</h3>
                                    <p className="text-muted-foreground">Please grant camera permissions to log in.</p>
                                </div>
                            )}
                            {hasCameraPermission === null && (
                                <div className="absolute inset-0 bg-secondary/80 flex flex-col items-center justify-center text-center p-4">
                                    <Loader className="h-16 w-16 text-muted-foreground animate-spin mb-4" />
                                    <h3 className="font-bold text-xl">Accessing Camera...</h3>
                                </div>
                            )}
                        </div>
                    </div>
                    <Button
                    onClick={handleLogin}
                    disabled={isScanning || isAuthenticated || !hasCameraPermission}
                    className="w-full font-bold text-lg py-6"
                    size="lg"
                    >
                    {getButtonContent()}
                    </Button>
                     {hasCameraPermission === false && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                Please allow camera access in your browser settings to use Face ID.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
              </TabsContent>
              <TabsContent value="admin">
                <CardHeader className="p-0 pt-6 text-center">
                    <CardDescription>
                       Enter your administrator credentials to access the admin panel.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 pt-6">
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <Button type="submit" className="w-full font-bold text-lg py-6" size="lg">
                            <ShieldCheck className="mr-2 h-5 w-5" />
                            Login as Admin
                        </Button>
                    </form>
                </CardContent>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
