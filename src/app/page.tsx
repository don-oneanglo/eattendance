"use client";

import { useState, useEffect, useRef } from "react";
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

export default function LoginPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
    if (isScanning) {
      timer = setTimeout(() => {
        setIsScanning(false);
        setIsAuthenticated(true);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isScanning]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAuthenticated) {
      timer = setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  const handleLogin = () => {
    if (hasCameraPermission) {
      setIsScanning(true);
    } else {
       toast({
          variant: 'destructive',
          title: 'Cannot Scan',
          description: 'Camera access is required to perform face scanning.',
        });
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a basic client-side check. 
    // The actual security is handled by the middleware.
    if (username === 'super-it' && password === 'F!123w@77') {
      // The middleware will intercept this navigation and prompt for credentials.
      router.push('/admin');
    } else {
      toast({
        title: 'Invalid Credentials',
        description: 'The username or password you entered is incorrect for client-side check.',
        variant: 'destructive'
      });
    }
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
                        Welcome back, please scan your face to log in.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 pt-6">
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-secondary border border-dashed flex items-center justify-center mb-6">
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
