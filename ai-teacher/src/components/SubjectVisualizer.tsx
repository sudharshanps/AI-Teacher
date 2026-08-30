import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Droplets, 
  Sliders, 
  Code, 
  Info
} from 'lucide-react';
import { SubjectType } from '../types';

interface SubjectVisualizerProps {
  currentSubject?: SubjectType;
  voltage: number;
  setVoltage: (v: number) => void;
  resistance: number;
  setResistance: (r: number) => void;
  highlightAnalogy?: boolean;
}

export const SubjectVisualizer: React.FC<SubjectVisualizerProps> = ({
  voltage,
  setVoltage,
  resistance,
  setResistance,
  highlightAnalogy = false,
}) => {
  const [activeTab, setActiveTab] = useState<'circuit' | 'water-pipe' | 'math' | 'biology' | 'code'>(
    highlightAnalogy ? 'water-pipe' : 'circuit'
  );

  useEffect(() => {
    if (highlightAnalogy) {
      setActiveTab('water-pipe');
    }
  }, [highlightAnalogy]);

  // Derived physics values
  const current = Number((voltage / (resistance || 1)).toFixed(2));
  const bulbBrightness = Math.min(100, Math.round((current / 6) * 100)); // Percentage brightness

  // Math graph state
  const [mathA] = useState<number>(1);
  const [mathB] = useState<number>(-4);
  const [mathC] = useState<number>(3);

  // Biology Mitosis Stage
  const [mitosisStage, setMitosisStage] = useState<number>(2);

  return (
    <div className="bg-white rounded-xl border border-[#E2EAE6] shadow-2xs overflow-hidden flex flex-col h-full">
      {/* Top Visual Mode Switcher */}
      <div className="bg-[#F8FBFA] px-3.5 py-2 border-b border-[#E2EAE6] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('circuit')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'circuit'
                ? 'bg-[#EAF7F1] text-[#2E7D5B] border border-[#A8DCC5] shadow-2xs'
                : 'text-[#687570] hover:text-[#25312D] hover:bg-[#EAF7F1]/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#3D8C68]" />
            <span>Circuit Simulator (V=IR)</span>
          </button>

          <button
            onClick={() => setActiveTab('water-pipe')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'water-pipe'
                ? 'bg-[#EAF3FB] text-[#467FB2] border border-[#A9CDE8] shadow-2xs'
                : 'text-[#687570] hover:text-[#25312D] hover:bg-[#EAF3FB]/50'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-[#467FB2]" />
            <span>Water Pipe Analogy</span>
            {highlightAnalogy && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#3D8C68] animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('math')}
            className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'math'
                ? 'bg-[#EAF7F1] text-[#2E7D5B] border border-[#A8DCC5]'
                : 'text-[#687570] hover:text-[#25312D] hover:bg-[#EAF7F1]/50'
            }`}
          >
            <span>Math: Graphs</span>
          </button>

          <button
            onClick={() => setActiveTab('biology')}
            className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'biology'
                ? 'bg-[#EAF7F1] text-[#2E7D5B] border border-[#A8DCC5]'
                : 'text-[#687570] hover:text-[#25312D] hover:bg-[#EAF7F1]/50'
            }`}
          >
            <span>Bio: Mitosis</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-[#EAF7F1] text-[#2E7D5B] border border-[#A8DCC5]'
                : 'text-[#687570] hover:text-[#25312D] hover:bg-[#EAF7F1]/50'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-[#687570]" />
            <span>Code Trace</span>
          </button>
        </div>

        <span className="text-[10px] font-mono-custom text-[#3D8C68] bg-[#EAF7F1] px-2 py-0.5 rounded border border-[#A8DCC5] hidden sm:block">
          Interactive Visual Canvas
        </span>
      </div>

      {/* Main Visual Display Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between overflow-y-auto space-y-4">
        
        {/* TAB 1: CIRCUIT SIMULATOR */}
        {activeTab === 'circuit' && (
          <div className="space-y-4">
            {/* Top Interactive Formula Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
              <div className="bg-[#F8FBFA] p-2.5 rounded-xl border border-[#E2EAE6] space-y-0.5">
                <span className="text-[10px] font-bold text-[#687570] uppercase tracking-wider">
                  Voltage (V)
                </span>
                <p className="text-xl font-bold font-mono-custom text-[#467FB2]">
                  {voltage} V
                </p>
                <p className="text-[10px] text-[#687570]">Electric Potential Push</p>
              </div>

              <div className="bg-[#F8FBFA] p-2.5 rounded-xl border border-[#E2EAE6] space-y-0.5">
                <span className="text-[10px] font-bold text-[#687570] uppercase tracking-wider">
                  Resistance (R)
                </span>
                <p className="text-xl font-bold font-mono-custom text-[#2E7D5B]">
                  {resistance} Ω
                </p>
                <p className="text-[10px] text-[#687570]">Opposition to Flow</p>
              </div>

              <div className="bg-[#EAF7F1] p-2.5 rounded-xl border border-[#A8DCC5] space-y-0.5">
                <span className="text-[10px] font-bold text-[#2E7D5B] uppercase tracking-wider">
                  Resulting Current (I)
                </span>
                <p className="text-xl font-bold font-mono-custom text-[#25312D]">
                  {current} A
                </p>
                <p className="text-[10px] font-semibold text-[#3D8C68]">I = V / R</p>
              </div>
            </div>

            {/* Visual Animated Circuit Schematic */}
            <div className="relative bg-[#F8FBFA] rounded-xl border border-[#E2EAE6] p-5 min-h-[190px] flex items-center justify-around overflow-hidden">
              
              {/* Battery Component */}
              <div className="flex flex-col items-center space-y-1 z-10">
                <div className="w-14 h-20 rounded-lg bg-gradient-to-b from-[#EAF3FB] to-[#A9CDE8] border-2 border-[#467FB2] flex flex-col items-center justify-between p-1.5 shadow-2xs">
                  <span className="text-[10px] font-bold text-[#467FB2]">+ {voltage}V</span>
                  <div className="w-6 h-1.5 bg-[#467FB2] rounded-full" />
                  <span className="text-[10px] font-bold text-[#687570]">- GND</span>
                </div>
                <span className="text-[10px] font-bold text-[#25312D]">Battery</span>
              </div>

              {/* Wire Loop */}
              <div className="absolute inset-x-12 inset-y-8 border-2 border-dashed border-[#A8DCC5] rounded-2xl pointer-events-none" />

              {/* Lightbulb Component */}
              <div className="flex flex-col items-center space-y-1 z-10">
                <div 
                  className="w-14 h-14 rounded-full border-2 border-[#3D8C68] flex items-center justify-center transition-all duration-300 shadow-2xs"
                  style={{
                    backgroundColor: `rgba(234, 247, 241, ${Math.max(0.4, bulbBrightness / 100)})`,
                    boxShadow: `0 0 ${bulbBrightness / 4}px rgba(61, 140, 104, ${bulbBrightness / 100})`,
                  }}
                >
                  <Zap 
                    className="w-6 h-6 text-[#3D8C68] transition-transform duration-300"
                    style={{
                      transform: `scale(${0.8 + (bulbBrightness / 200)})`,
                    }}
                  />
                </div>
                <span className="text-[10px] font-bold text-[#25312D]">
                  Bulb ({bulbBrightness}% Glow)
                </span>
              </div>

              {/* Resistor Component */}
              <div className="flex flex-col items-center space-y-1 z-10">
                <div className="w-16 h-9 rounded-lg bg-white border-2 border-[#3D8C68] flex items-center justify-center font-mono-custom text-xs font-bold text-[#25312D] shadow-2xs">
                  {resistance} Ω
                </div>
                <span className="text-[10px] font-bold text-[#25312D]">Resistor</span>
              </div>

              {/* Ammeter Display */}
              <div className="flex flex-col items-center space-y-1 z-10">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-[#25312D] flex flex-col items-center justify-center shadow-2xs">
                  <span className="text-[9px] font-bold text-[#687570]">AMMETER</span>
                  <span className="text-xs font-bold font-mono-custom text-[#25312D]">{current}A</span>
                </div>
                <span className="text-[10px] font-bold text-[#25312D]">Current Meter</span>
              </div>
            </div>

            {/* Interactive Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-[#F8FBFA] p-3.5 rounded-xl border border-[#E2EAE6]">
              {/* Voltage Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#25312D] flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-[#467FB2]" />
                    Adjust Voltage (V)
                  </span>
                  <span className="font-mono-custom font-bold text-[#467FB2]">{voltage} Volts</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="24"
                  step="2"
                  value={voltage}
                  onChange={(e) => setVoltage(Number(e.target.value))}
                  className="w-full accent-[#467FB2] cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-[#687570]">
                  <span>2V (Low push)</span>
                  <span>12V (Standard)</span>
                  <span>24V (High push)</span>
                </div>
              </div>

              {/* Resistance Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#25312D] flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-[#3D8C68]" />
                    Adjust Resistance (R)
                  </span>
                  <span className="font-mono-custom font-bold text-[#2E7D5B]">{resistance} Ohms</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={resistance}
                  onChange={(e) => setResistance(Number(e.target.value))}
                  className="w-full accent-[#3D8C68] cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-[#687570]">
                  <span>1Ω (Wide path)</span>
                  <span>4Ω (Medium)</span>
                  <span>12Ω (Constricted)</span>
                </div>
              </div>
            </div>

            {/* Formula Triangle explanation */}
            <div className="p-2.5 bg-[#F8FBFA] rounded-lg border border-[#E2EAE6] flex items-center justify-between text-xs text-[#687570]">
              <div className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#3D8C68]" />
                <span>
                  <strong>Ohm's Relationship:</strong> As Resistance increases to <strong>{resistance}Ω</strong> at {voltage}V, Current becomes <strong>{current}A</strong>.
                </span>
              </div>
              <span className="font-mono-custom font-bold text-[#25312D] text-xs">
                I = {voltage} / {resistance} = {current} A
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: WATER PIPE ANALOGY */}
        {activeTab === 'water-pipe' && (
          <div className="space-y-4">
            <div className="bg-[#EAF3FB] p-3 rounded-xl border border-[#A9CDE8] flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#467FB2]" />
                <div>
                  <span className="text-[10px] font-bold text-[#467FB2] uppercase tracking-wider">
                    Alternative Pedagogical Analogy
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#25312D]">
                    The Hydraulic (Water-Flow) Model
                  </h4>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#467FB2] bg-white px-2 py-0.5 rounded border border-[#A9CDE8]">
                Visual Intuition Engine
              </span>
            </div>

            {/* Diagram of Tank, Constricted Valve, and Output Flow */}
            <div className="bg-[#F8FBFA] p-4 rounded-xl border border-[#E2EAE6] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                
                {/* 1. Water Tank (Voltage) */}
                <div className="bg-white p-3 rounded-lg border border-[#E2EAE6] space-y-1.5 text-center">
                  <div className="w-16 h-22 mx-auto bg-[#EAF3FB] border-2 border-[#467FB2] rounded-lg relative overflow-hidden flex flex-col justify-end p-1.5">
                    <div 
                      className="bg-[#467FB2]/60 w-full transition-all duration-300 rounded-b-md"
                      style={{ height: `${Math.min(100, (voltage / 24) * 100)}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center font-bold text-xs text-[#25312D]">
                      {voltage}m Head
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#25312D]">1. Water Pressure</p>
                  <p className="text-[10px] text-[#687570]">
                    = <strong>Voltage (V)</strong> (The push)
                  </p>
                </div>

                {/* 2. Pipe Valve Constriction (Resistance) */}
                <div className="bg-white p-3 rounded-lg border border-[#E2EAE6] space-y-1.5 text-center">
                  <div className="w-20 h-22 mx-auto flex items-center justify-center">
                    <div className="relative w-full h-10 bg-slate-100 border-2 border-slate-300 rounded-lg flex items-center justify-center">
                      {/* Constriction Valve */}
                      <div 
                        className="bg-[#3D8C68] border border-[#2E7D5B] transition-all duration-300 rounded-xs"
                        style={{
                          width: '14px',
                          height: `${Math.min(36, resistance * 3)}px`,
                        }}
                      />
                      <span className="absolute -top-5 text-[9px] font-bold text-[#2E7D5B]">
                        Valve {resistance > 6 ? '(Narrow!)' : '(Wide)'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-[#25312D]">2. Pipe Constriction</p>
                  <p className="text-[10px] text-[#687570]">
                    = <strong>Resistance (R)</strong> (Obstacle)
                  </p>
                </div>

                {/* 3. Resulting Water Flow Rate (Current) */}
                <div className="bg-white p-3 rounded-lg border border-[#A8DCC5] space-y-1.5 text-center">
                  <div className="w-16 h-22 mx-auto bg-[#EAF7F1] border-2 border-[#3D8C68] rounded-lg flex flex-col items-center justify-center p-1.5">
                    <Droplets className="w-6 h-6 text-[#3D8C68] animate-bounce" />
                    <span className="font-mono-custom font-bold text-xs text-[#25312D] mt-1.5">
                      {current} L/s
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#25312D]">3. Flow Rate</p>
                  <p className="text-[10px] font-semibold text-[#2E7D5B]">
                    = <strong>Current (I)</strong> (Flow/sec)
                  </p>
                </div>

              </div>

              {/* Explanatory takeaway box */}
              <div className="p-3 rounded-lg bg-white border border-[#E2EAE6] space-y-1 text-xs">
                <p className="font-bold text-[#25312D]">
                  💡 The Intuition Why Current Decreases:
                </p>
                <p className="text-[#687570] leading-relaxed text-[11px]">
                  When water tank pressure is constant (Voltage = {voltage}V), but the pipe is constricted (Resistance = {resistance}Ω), <strong>less water can squeeze through per second</strong>. Hence, <strong>Current MUST decrease</strong>: I = V / R = {voltage}V / {resistance}Ω = {current}A.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MATH GRAPHS */}
        {activeTab === 'math' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-[#25312D]">
                Quadratic Function Plotter: $f(x) = ax^2 + bx + c$
              </h4>
              <span className="text-xs font-mono-custom text-[#2E7D5B] bg-[#EAF7F1] px-2 py-0.5 rounded border border-[#A8DCC5]">
                y = {mathA}x² + ({mathB})x + ({mathC})
              </span>
            </div>

            <div className="bg-[#F8FBFA] p-4 rounded-xl border border-[#E2EAE6] flex items-center justify-center min-h-[170px]">
              <div className="text-center space-y-2">
                <p className="text-xs font-bold text-[#25312D]">
                  Vertex: ({(-mathB / (2 * mathA)).toFixed(1)}, {(mathC - (mathB * mathB) / (4 * mathA)).toFixed(1)})
                </p>
                <div className="w-56 h-28 mx-auto border-b-2 border-l-2 border-[#25312D] relative flex items-end justify-center">
                  <div className="w-full h-full border-t-2 border-r-2 border-dashed border-[#3D8C68] rounded-t-full" />
                </div>
                <p className="text-[10px] text-[#687570]">
                  Discriminant $D = b^2 - 4ac = {mathB * mathB - 4 * mathA * mathC}$ (Two real roots)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BIOLOGY MITOSIS */}
        {activeTab === 'biology' && (
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-[#25312D]">
              Cell Division: Mitosis Stages
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {['Prophase', 'Metaphase', 'Anaphase', 'Telophase'].map((stage, idx) => (
                <button
                  key={stage}
                  onClick={() => setMitosisStage(idx + 1)}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                    mitosisStage === idx + 1
                      ? 'bg-[#EAF7F1] border-[#3D8C68] font-bold text-[#25312D]'
                      : 'bg-[#F8FBFA] border-[#E2EAE6] text-[#687570]'
                  }`}
                >
                  <span className="text-[9px] font-mono-custom block text-[#2E7D5B]">Stage 0{idx + 1}</span>
                  <span className="text-xs">{stage}</span>
                </button>
              ))}
            </div>
            <div className="p-4 bg-[#F8FBFA] rounded-xl border border-[#E2EAE6] text-center space-y-1">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#EAF7F1] border-2 border-[#A8DCC5] flex items-center justify-center font-bold text-xs text-[#2E7D5B]">
                {mitosisStage === 1 && "Chromatin condenses"}
                {mitosisStage === 2 && "Chromosomes align"}
                {mitosisStage === 3 && "Chromatids separate"}
                {mitosisStage === 4 && "Envelopes reform"}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PROGRAMMING CODE TRACE */}
        {activeTab === 'code' && (
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-[#25312D]">
              Python Execution Flow: Ohm's Law Solver
            </h4>
            <div className="bg-[#25312D] text-slate-100 p-3.5 rounded-xl font-mono-custom text-xs space-y-1">
              <p className="text-slate-400"># Calculate current given voltage and resistance</p>
              <p className="text-emerald-300">def calculate_current(voltage: float, resistance: float) -&gt; float:</p>
              <p className="pl-4">if resistance &lt;= 0:</p>
              <p className="pl-8 text-rose-300">raise ValueError("Resistance must be positive")</p>
              <p className="pl-4 bg-emerald-900/50 text-white py-0.5 px-1 rounded">return voltage / resistance  # I = V / R</p>
              <p className="pt-2 text-emerald-400">&gt;&gt;&gt; calculate_current({voltage}, {resistance})</p>
              <p className="text-emerald-200">&gt;&gt;&gt; {current} Amperes</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

