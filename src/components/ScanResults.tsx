import { ArrowLeft, Download, RotateCcw, Shield, AlertTriangle, CheckCircle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ScanResultsProps {
  results: any;
  onBack: () => void;
  onNewScan: () => void;
}

const ScanResults = ({ results, onBack, onNewScan }: ScanResultsProps) => {
  const getOverallStatus = () => {
    switch (results.overall) {
      case "safe":
        return {
          icon: CheckCircle,
          color: "text-success",
          bg: "bg-success/10",
          text: "SAFE TO CONSUME"
        };
      case "caution":
        return {
          icon: AlertTriangle,
          color: "text-warning",
          bg: "bg-warning/10",
          text: "CONSUME WITH CAUTION"
        };
      case "danger":
        return {
          icon: Shield,
          color: "text-destructive",
          bg: "bg-destructive/10",
          text: "DO NOT CONSUME"
        };
      default:
        return {
          icon: Shield,
          color: "text-muted-foreground",
          bg: "bg-muted/10",
          text: "ANALYSIS COMPLETE"
        };
    }
  };

  const status = getOverallStatus();
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-gradient-bg p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Scan Results</h1>
              <p className="text-muted-foreground">
                Analysis completed at {new Date(results.scanTime).toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onNewScan}>
              <RotateCcw className="w-4 h-4" />
              New Scan
            </Button>
            <Button variant="default">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overall Status */}
        <Card className={`shadow-card mb-8 ${status.bg} border-2`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full ${status.bg} flex items-center justify-center`}>
                  <StatusIcon className={`w-8 h-8 ${status.color}`} />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${status.color}`}>
                    {status.text}
                  </h2>
                  <p className="text-muted-foreground">
                    Confidence: {Math.round(results.confidence * 100)}%
                  </p>
                </div>
              </div>
              
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Sample: {results.sampleType}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Bacteria Detection */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Bacteria Detection
              </CardTitle>
              <CardDescription>
                Pathogen analysis and contamination assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status</span>
                <Badge variant={results.bacteria.detected ? "destructive" : "secondary"}>
                  {results.bacteria.detected ? "DETECTED" : "CLEAN"}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Confidence</span>
                  <span>{Math.round(results.bacteria.confidence * 100)}%</span>
                </div>
                <Progress value={results.bacteria.confidence * 100} className="h-2" />
              </div>

              {results.bacteria.pathogens.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Detected Pathogens:</span>
                  {results.bacteria.pathogens.map((pathogen: string, index: number) => (
                    <Badge key={index} variant="destructive" className="mr-2">
                      {pathogen}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  {results.bacteria.detected 
                    ? "Harmful bacteria detected. Consider proper cooking or disposal."
                    : "No harmful bacteria detected. Sample appears clean."
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Toxin Analysis */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Toxin Analysis
              </CardTitle>
              <CardDescription>
                Chemical contamination and pesticide residue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Level</span>
                <Badge variant={
                  results.toxins.level === "none" ? "secondary" :
                  results.toxins.level === "low" ? "secondary" :
                  results.toxins.level === "high" ? "destructive" : "secondary"
                }>
                  {results.toxins.level.toUpperCase()}
                </Badge>
              </div>

              {results.toxins.detected && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Concentration</span>
                      <span>{results.toxins.concentration} PPM</span>
                    </div>
                    <Progress 
                      value={Math.min(results.toxins.concentration * 10, 100)} 
                      className="h-2" 
                    />
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium">Detected Toxins:</span>
                    {results.toxins.types.map((toxin: string, index: number) => (
                      <Badge key={index} variant="outline" className="mr-2">
                        {toxin}
                      </Badge>
                    ))}
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  {results.toxins.detected
                    ? "Low levels of contaminants detected. Generally safe for consumption."
                    : "No toxic substances detected. Sample is clean."
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Nutrient Profile */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-success" />
                Nutrient Profile
              </CardTitle>
              <CardDescription>
                Nutritional analysis and health assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Health Score</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-success">
                    {results.nutrients.healthScore}/100
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Progress value={results.nutrients.healthScore} className="h-3" />
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium">Vitamins</div>
                {Object.entries(results.nutrients.vitamins).map(([vitamin, value]) => (
                  <div key={vitamin} className="flex justify-between items-center">
                    <span className="text-sm">Vitamin {vitamin}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={value as number} className="w-16 h-1" />
                      <span className="text-xs w-8 text-right">{value as number}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium">Minerals</div>
                {Object.entries(results.nutrients.minerals).map(([mineral, value]) => (
                  <div key={mineral} className="flex justify-between items-center">
                    <span className="text-sm">{mineral}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={value as number} className="w-16 h-1" />
                      <span className="text-xs w-8 text-right">{value as number}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Good nutritional profile with balanced vitamin and mineral content.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="shadow-card mt-8">
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>
              Personalized advice based on scan results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Safety Recommendations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {results.overall === "safe" ? (
                    <>
                      <li>• Safe for immediate consumption</li>
                      <li>• Store in appropriate conditions</li>
                      <li>• Consume within recommended timeframe</li>
                    </>
                  ) : results.overall === "caution" ? (
                    <>
                      <li>• Cook thoroughly before consumption</li>
                      <li>• Wash thoroughly with clean water</li>
                      <li>• Monitor for any adverse reactions</li>
                    </>
                  ) : (
                    <>
                      <li>• Do not consume this sample</li>
                      <li>• Dispose of safely</li>
                      <li>• Check storage conditions</li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Nutritional Tips</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Good source of natural vitamins</li>
                  <li>• Consider pairing with vitamin D sources</li>
                  <li>• Part of a balanced diet</li>
                  <li>• Regular consumption recommended</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScanResults;