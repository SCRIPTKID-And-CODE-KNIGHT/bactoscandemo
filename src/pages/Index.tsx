import { useState } from "react";
import { Microscope, Shield, Activity, FileText, Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import heroImage from "@/assets/bioscanner-hero.jpg";
import ScannerInterface from "@/components/ScannerInterface";

const Index = () => {
  const [currentView, setCurrentView] = useState<"home" | "scanner">("home");

  if (currentView === "scanner") {
    return <ScannerInterface onBack={() => setCurrentView("home")} />;
  }

  return (
    <main className="min-h-screen bg-gradient-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary-glow/10" />
        
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold tracking-tight text-foreground leading-tight">
                  <span className="bg-gradient-primary bg-clip-text text-transparent block">
                    AI POWERED BACTERIA SCANNER
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Detect bacteria, toxins, and analyze nutrients in seconds with our portable 
                  bioscanner device. Ensure food safety with professional-grade analysis.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="scan" 
                  size="lg"
                  onClick={() => setCurrentView("scanner")}
                  className="text-lg px-8 py-4 h-auto"
                >
                  <Camera className="w-5 h-5" />
                  Start Scanning
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
                  <FileText className="w-5 h-5" />
                  View Demo Results
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">99.9%</div>
                  <div className="text-sm text-muted-foreground">Detection Accuracy</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">3 sec</div>
                  <div className="text-sm text-muted-foreground">Scan Time</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Food Types</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
              <img 
                src={heroImage} 
                alt="BioScanner Device" 
                className="relative z-10 w-full h-auto rounded-2xl shadow-medical"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold text-foreground">
              Comprehensive Food Safety Analysis
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three layers of protection to ensure your food is safe, nutritious, and free from contamination.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-card border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center mb-4">
                  <Microscope className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Bacteria Detection</CardTitle>
                <CardDescription>
                  Identify harmful pathogens like E. coli, Salmonella, and Listeria
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Detection Speed</span>
                  <span className="text-sm font-medium">Real-time</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Accuracy</span>
                  <span className="text-sm font-medium text-success">99.9%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pathogens</span>
                  <span className="text-sm font-medium">20+ types</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto bg-destructive rounded-2xl flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Toxin Analysis</CardTitle>
                <CardDescription>
                  Detect pesticides, heavy metals, and chemical contamination
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Toxin Types</span>
                  <span className="text-sm font-medium">15+ categories</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Sensitivity</span>
                  <span className="text-sm font-medium text-warning">PPM level</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Safety Limit</span>
                  <span className="text-sm font-medium">FDA compliant</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto bg-success rounded-2xl flex items-center justify-center mb-4">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Nutrient Profile</CardTitle>
                <CardDescription>
                  Complete nutritional analysis with health recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Nutrients</span>
                  <span className="text-sm font-medium">30+ vitamins</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Health Score</span>
                  <span className="text-sm font-medium text-success">AI-powered</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Recommendations</span>
                  <span className="text-sm font-medium">Personalized</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 via-primary-glow/5 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold text-foreground">
              Ready to Transform Food Safety?
            </h2>
            <p className="text-xl text-muted-foreground">
              Experience the future of food safety with our interactive demo. 
              Scan samples, view real-time results, and explore the technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="scan" 
                size="lg"
                onClick={() => setCurrentView("scanner")}
                className="text-lg px-8 py-4 h-auto"
              >
                <Upload className="w-5 h-5" />
                Try Live Demo
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
                <FileText className="w-5 h-5" />
                Download Report
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;