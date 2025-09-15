import { useState, useRef } from "react";
import { ArrowLeft, Upload, Camera, RotateCcw, Zap, Bluetooth, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import sampleApple from "@/assets/sample-apple.jpg";
import sampleMilk from "@/assets/sample-milk.jpg";
import ScanResults from "@/components/ScanResults";

interface ScannerInterfaceProps {
  onBack: () => void;
}

const SAMPLE_FOODS = [
  {
    id: "apple",
    name: "Red Apple",
    image: sampleApple,
    category: "Fruit"
  },
  {
    id: "milk",
    name: "Fresh Milk",
    image: sampleMilk,
    category: "Dairy"
  }
];

const ScannerInterface = ({ onBack }: ScannerInterfaceProps) => {
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [sensorConnected, setSensorConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStep, setConnectionStep] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setSelectedSample(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSensorConnect = () => {
    setIsConnecting(true);
    const steps = [
      "Initializing connection...",
      "Detecting BioScanner device...",
      "Establishing Bluetooth link...",
      "Calibrating sensors...",
      "Connection established"
    ];
    
    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      setConnectionStep(steps[stepIndex]);
      stepIndex++;
      
      if (stepIndex >= steps.length) {
        clearInterval(stepInterval);
        setTimeout(() => {
          setIsConnecting(false);
          setSensorConnected(true);
          setConnectionStep("");
        }, 500);
      }
    }, 800);
  };

  const handleScanStart = () => {
    if (!selectedSample && !uploadedImage) return;
    if (!sensorConnected) return;
    
    setIsScanning(true);
    setScanComplete(false);
    
    // Simulate scanning process with sensor steps
    const scanSteps = [
      "Initializing bio-sensors...",
      "Analyzing bacterial presence...",
      "Detecting toxin levels...",
      "Processing nutrient data...",
      "Finalizing analysis..."
    ];
    
    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      setConnectionStep(scanSteps[stepIndex]);
      stepIndex++;
      
      if (stepIndex >= scanSteps.length) {
        clearInterval(stepInterval);
        setTimeout(() => {
          setIsScanning(false);
          setScanComplete(true);
          setConnectionStep("");
          
          // Generate mock results based on selected sample
          const results = generateMockResults(selectedSample || "uploaded");
          setScanResults(results);
        }, 500);
      }
    }, 600);
  };

  const generateMockResults = (sampleType: string) => {
    const baseResults = {
      sampleType,
      scanTime: new Date().toISOString(),
      overall: "safe", // safe, caution, danger
      confidence: 0.95
    };

    if (sampleType === "apple") {
      return {
        ...baseResults,
        bacteria: {
          detected: false,
          confidence: 0.98,
          pathogens: []
        },
        toxins: {
          detected: true,
          level: "low",
          types: ["Pesticide residue"],
          concentration: 0.02
        },
        nutrients: {
          healthScore: 85,
          vitamins: { C: 95, A: 12, K: 8 },
          minerals: { Potassium: 78, Iron: 5 },
          fiber: 12,
          sugar: 19
        }
      };
    } else if (sampleType === "milk") {
      return {
        ...baseResults,
        overall: "caution",
        bacteria: {
          detected: true,
          confidence: 0.87,
          pathogens: ["E. coli (trace)"]
        },
        toxins: {
          detected: false,
          level: "none",
          types: [],
          concentration: 0
        },
        nutrients: {
          healthScore: 72,
          vitamins: { D: 45, B12: 67, A: 28 },
          minerals: { Calcium: 89, Phosphorus: 67 },
          protein: 24,
          fat: 18
        }
      };
    } else {
      return {
        ...baseResults,
        bacteria: {
          detected: false,
          confidence: 0.92,
          pathogens: []
        },
        toxins: {
          detected: false,
          level: "none",
          types: [],
          concentration: 0
        },
        nutrients: {
          healthScore: 78,
          vitamins: { C: 45, A: 23, K: 15 },
          minerals: { Iron: 34, Magnesium: 28 },
          fiber: 8,
          protein: 15
        }
      };
    }
  };

  const resetScanner = () => {
    setSelectedSample(null);
    setUploadedImage(null);
    setIsScanning(false);
    setScanComplete(false);
    setScanResults(null);
    setSensorConnected(false);
    setIsConnecting(false);
    setConnectionStep("");
  };

  const currentImage = uploadedImage || (selectedSample ? SAMPLE_FOODS.find(f => f.id === selectedSample)?.image : null);

  if (scanComplete && scanResults) {
    return (
      <ScanResults 
        results={scanResults} 
        onBack={() => setScanComplete(false)}
        onNewScan={resetScanner}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">BioScanner Interface</h1>
            <p className="text-muted-foreground">Upload or select a food sample to analyze</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sample Selection */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Sample
                </CardTitle>
                <CardDescription>
                  Upload an image of your food sample for analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-border hover:border-primary/50"
                >
                  <div className="text-center space-y-2">
                    <Camera className="w-8 h-8 mx-auto text-muted-foreground" />
                    <span>Click to upload image</span>
                  </div>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Sample Library</CardTitle>
                <CardDescription>
                  Choose from pre-loaded demo samples
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {SAMPLE_FOODS.map((food) => (
                    <div
                      key={food.id}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        selectedSample === food.id 
                          ? "border-primary shadow-medical" 
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => {
                        setSelectedSample(food.id);
                        setUploadedImage(null);
                      }}
                    >
                      <img 
                        src={food.image} 
                        alt={food.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="text-white text-sm font-medium">{food.name}</div>
                        <Badge variant="secondary" className="text-xs">
                          {food.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scanner Display */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Scanner Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className={`aspect-square rounded-lg border-2 bg-muted/50 flex items-center justify-center overflow-hidden ${
                    isScanning ? "scan-animation border-primary" : "border-border"
                  }`}>
                    {currentImage ? (
                      <>
                        <img 
                          src={currentImage} 
                          alt="Sample to scan"
                          className="w-full h-full object-cover"
                        />
                        {isScanning && (
                          <div className="absolute inset-0 bg-gradient-scan opacity-50">
                            <div className="scan-beam absolute inset-y-0 left-0 w-1 bg-primary"></div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center space-y-4 text-muted-foreground">
                        <Camera className="w-16 h-16 mx-auto" />
                        <p>Select or upload a sample to preview</p>
                      </div>
                    )}
                  </div>
                  
                  {isScanning && (
                    <div className="absolute -inset-2 border-2 border-primary/50 rounded-lg animate-pulse" />
                  )}
                </div>
                
                <div className="mt-6 space-y-4">
                  {/* Sensor Connection Status */}
                  <div className={`p-3 rounded-lg border-2 ${
                    sensorConnected 
                      ? "border-success bg-success/10" 
                      : "border-warning bg-warning/10"
                  }`}>
                    <div className="flex items-center gap-2">
                      {sensorConnected ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-success" />
                          <span className="text-success font-medium">BioScanner Connected</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-warning" />
                          <span className="text-warning font-medium">Sensor Disconnected</span>
                        </>
                      )}
                    </div>
                  </div>

                  {!sensorConnected ? (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleSensorConnect}
                      disabled={isConnecting}
                      className="w-full"
                    >
                      {isConnecting ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Bluetooth className="w-5 h-5" />
                          Connect BioScanner
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="scan"
                      size="lg"
                      onClick={handleScanStart}
                      disabled={!currentImage || isScanning}
                      className="w-full"
                    >
                      {isScanning ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                          Scanning... 
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Start Bio-Analysis
                        </>
                      )}
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={resetScanner}
                    className="w-full"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset Scanner
                  </Button>
                </div>
              </CardContent>
            </Card>

            {(isScanning || isConnecting) && (
              <Card className="shadow-card result-appear">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {isConnecting ? "Sensor Connection" : "Scanning Progress"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {connectionStep && (
                    <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                        <span className="text-sm font-medium">{connectionStep}</span>
                      </div>
                    </div>
                  )}
                  
                  {isScanning && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Sensor Calibration</span>
                        <span className="text-success">Complete</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Bacteria Detection</span>
                        <span className="text-success">Complete</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Toxin Analysis</span>
                        <span className="text-warning">Processing...</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Nutrient Profile</span>
                        <span className="text-muted-foreground">Pending</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerInterface;