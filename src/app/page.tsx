"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ScanFace, CheckCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/icons/logo";

export default function TeacherLoginPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

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
    setIsScanning(true);
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
            <CardDescription className="text-muted-foreground">
              Welcome back, please scan your face to log in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-secondary border border-dashed flex items-center justify-center mb-6">
              <div className="absolute inset-0 bg-black/10 z-10"></div>
              {isScanning || isAuthenticated ? (
                <div className="w-full h-full" style={{ background: "conic-gradient(from 180deg at 50% 50%, #4285F4 0deg, #34A853 360deg)", animation: "spin 2s linear infinite" }}></div>
              ) : (
                <ScanFace className="h-24 w-24 text-muted-foreground/50" />
              )}
               <div className="absolute w-64 h-80 border-4 border-white/50 rounded-lg z-20 animate-pulse"></div>
            </div>
            <Button
              onClick={handleLogin}
              disabled={isScanning || isAuthenticated}
              className="w-full font-bold text-lg py-6"
              size="lg"
            >
              {getButtonContent()}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
