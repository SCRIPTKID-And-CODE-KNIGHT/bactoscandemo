import { useState, useRef } from "react";
import { ArrowLeft, Upload, Camera, RotateCcw, Zap, Activity, CheckCircle, AlertCircle, Cpu } from "lucide-react";
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
  const [scanMode, setScanMode] = useState<'mold' | 'bacteria'>('mold');
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [cameraImage, setCameraImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [sensorConnected, setSensorConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStep, setConnectionStep] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasSample, setHasSample] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setSelectedSample(null);
        setCameraImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      
      // Wait for video element to be ready then set the stream
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(console.error);
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please ensure camera permissions are granted.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');
        setCameraImage(imageData);
        setSelectedSample(null);
        setUploadedImage(null);
        closeCamera();
      }
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const handleSensorConnect = () => {
    setIsConnecting(true);
    const steps = [
      "Initializing connection...",
      "Detecting BioScanner device...",
      "Establishing sensor link...",
      "Calibrating biosensors...",
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
    // For mold mode, require image. For bacteria mode, just need sensor and sample
    if (scanMode === 'mold' && !selectedSample && !uploadedImage && !cameraImage) return;
    if (scanMode === 'bacteria' && !hasSample) return;
    if (!sensorConnected) return;
    
    setIsScanning(true);
    setScanComplete(false);
    
    // Different scanning steps based on mode
    const moldScanSteps = [
      "Syncing hardware and software...",
      "Initializing optical sensors...",
      "Capturing high-resolution images...",
      "Analyzing visual patterns...",
      "Processing mold signatures...",
      "Detecting spore structures...",
      "Finalizing visual analysis..."
    ];

    const bacteriaScanSteps = [
      "Syncing hardware and software...",
      "Initializing bio-sensors...",
      "Hardware calibration in progress...",
      "Analyzing bacterial presence...",
      "Software processing data...",
      "Detecting toxin levels...",
      "Hardware-software sync complete...",
      "Processing nutrient data...",
      "Finalizing analysis..."
    ];
    
    const scanSteps = scanMode === 'mold' ? moldScanSteps : bacteriaScanSteps;
    
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
          
          // Generate mock results based on mode and sample
          const sampleType = scanMode === 'bacteria' ? 'bacteria_sensor' : 
                           (cameraImage ? "camera" : (selectedSample || "uploaded"));
          const results = generateMockResults(sampleType);
          console.log('Generated scan results:', results);
          console.log('Scan mode:', scanMode);
          console.log('Sample type:', sampleType);
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
      confidence: 0.95,
      scanMode
    };

    // Bacteria sensor scanning (no image required)
    if (sampleType === "bacteria_sensor") {
      const hasBacteria = Math.random() > 0.6; // 40% chance of detecting bacteria
      return {
        ...baseResults,
        overall: hasBacteria ? "danger" : "safe",
        confidence: hasBacteria ? 0.92 : 0.96,
        bacteria: {
          detected: hasBacteria,
          confidence: hasBacteria ? 0.94 : 0.98,
          pathogens: hasBacteria ? ["E. coli", "Salmonella", "Listeria monocytogenes"] : [],
          count: hasBacteria ? "1.2 × 10⁶ CFU/g" : "< 10² CFU/g"
        },
        toxins: {
          detected: hasBacteria,
          level: hasBacteria ? "moderate" : "none",
          types: hasBacteria ? ["Endotoxins", "Enterotoxins"] : [],
          concentration: hasBacteria ? 0.08 : 0
        },
        nutrients: {
          healthScore: hasBacteria ? 25 : 88,
          vitamins: { C: hasBacteria ? 15 : 85, A: hasBacteria ? 8 : 42, K: hasBacteria ? 5 : 35 },
          minerals: { Iron: hasBacteria ? 12 : 52, Magnesium: hasBacteria ? 10 : 45 },
          fiber: hasBacteria ? 5 : 22,
          protein: hasBacteria ? 8 : 28
        }
      };
    }

    // Mold detection for camera captures and uploaded images
    if (sampleType === "camera" || scanMode === 'mold') {
      const hasMold = Math.random() > 0.7; // 30% chance of detecting mold
      return {
        ...baseResults,
        overall: hasMold ? "danger" : "safe",
        confidence: hasMold ? 0.89 : 0.94,
        mold: {
          detected: hasMold,
          confidence: hasMold ? 0.91 : 0.96,
          types: hasMold ? ["Aspergillus niger", "Penicillium", "Surface mold"] : [],
          severity: hasMold ? "moderate" : "none",
          coverage: hasMold ? "15%" : "0%",
          sporeCount: hasMold ? "High concentration" : "None detected"
        },
        toxins: {
          detected: hasMold,
          level: hasMold ? "high" : "none",
          types: hasMold ? ["Mycotoxins", "Aflatoxins"] : [],
          concentration: hasMold ? 0.12 : 0
        },
        nutrients: {
          healthScore: hasMold ? 15 : 82,
          vitamins: { C: hasMold ? 5 : 67, A: hasMold ? 3 : 34, K: hasMold ? 2 : 28 },
          minerals: { Iron: hasMold ? 8 : 45, Magnesium: hasMold ? 6 : 38 },
          fiber: hasMold ? 2 : 18,
          protein: hasMold ? 4 : 22
        }
      };
    }

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
    setCameraImage(null);
    setIsScanning(false);
    setScanComplete(false);
    setScanResults(null);
    setSensorConnected(false);
    setIsConnecting(false);
    setConnectionStep("");
    setHasSample(false);
    closeCamera();
  };

  const currentImage = scanMode === 'mold' ? 
    (cameraImage || uploadedImage || (selectedSample ? SAMPLE_FOODS.find(f => f.id === selectedSample)?.image : null)) : 
    null;

  if (scanComplete && scanResults) {
    console.log('Rendering ScanResults with:', { scanComplete, scanResults });
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
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">AI POWERED SCANNER</h1>
            <p className="text-muted-foreground">Choose scanning mode and analyze your sample</p>
          </div>
        </div>

        {/* Mode Selection */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle>Scanning Mode</CardTitle>
            <CardDescription>
              Choose between visual mold detection or sensor-based bacteria analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={scanMode === 'mold' ? 'default' : 'outline'}
                onClick={() => {
                  setScanMode('mold');
                  resetScanner();
                }}
                className="h-20 flex-col space-y-2"
              >
                <Camera className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-semibold">Mold Scanner</div>
                  <div className="text-xs">Visual detection via image</div>
                </div>
              </Button>
              <Button
                variant={scanMode === 'bacteria' ? 'default' : 'outline'}
                onClick={() => {
                  setScanMode('bacteria');
                  resetScanner();
                }}
                className="h-20 flex-col space-y-2"
              >
                <Cpu className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-semibold">Bacteria Scanner</div>
                  <div className="text-xs">Sensor-based detection</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sample Selection */}
          <div className="space-y-6">
            {scanMode === 'mold' ? (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Sample Image
                  </CardTitle>
                  <CardDescription>
                    Upload or capture an image of your sample for visual mold detection
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
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      className="h-32 border-2 border-dashed border-border hover:border-primary/50"
                    >
                      <div className="text-center space-y-2">
                        <Upload className="w-6 h-6 mx-auto text-muted-foreground" />
                        <span className="text-sm">Upload Image</span>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={openCamera}
                      className="h-32 border-2 border-dashed border-border hover:border-primary/50"
                    >
                      <div className="text-center space-y-2">
                        <Camera className="w-6 h-6 mx-auto text-muted-foreground" />
                        <span className="text-sm">Use Camera</span>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="w-5 h-5" />
                    Bacteria Sensor Mode
                  </CardTitle>
                  <CardDescription>
                    Place sample in scanner for sensor-based bacteria detection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
                      hasSample ? 'border-primary bg-primary/5' : 'border-border'
                    }`}>
                      <Cpu className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Place your sample in the physical scanner chamber
                      </p>
                      <Button
                        variant={hasSample ? "default" : "outline"}
                        onClick={() => setHasSample(!hasSample)}
                      >
                        {hasSample ? "Sample Loaded" : "Load Sample"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
                    {scanMode === 'bacteria' ? (
                      <div className="text-center space-y-4 text-muted-foreground">
                        <Cpu className="w-16 h-16 mx-auto" />
                        <p>Sensor-based scanning</p>
                        <p className="text-sm">No image preview required</p>
                        {hasSample && <Badge variant="secondary">Sample Loaded</Badge>}
                      </div>
                    ) : currentImage ? (
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
                          <Activity className="w-5 h-5" />
                          Connect BioScanner
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="scan"
                      size="lg"
                      onClick={handleScanStart}
                      disabled={
                        (scanMode === 'mold' && !currentImage) || 
                        (scanMode === 'bacteria' && !hasSample) || 
                        isScanning
                      }
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
                          {scanMode === 'mold' ? 'Start Mold Analysis' : 'Start Bacteria Analysis'}
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

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Camera Scanner</h3>
              <Button variant="ghost" onClick={closeCamera} className="p-2">
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ minHeight: '320px' }}
                />
                <div className="absolute inset-4 border-2 border-primary/50 rounded-lg">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-primary text-sm font-medium">
                  Position food sample in frame
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={closeCamera} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={capturePhoto} className="flex-1">
                  <Camera className="w-4 h-4 mr-2" />
                  Capture
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ScannerInterface;