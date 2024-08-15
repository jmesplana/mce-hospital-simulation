import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Play, Pause, RotateCcw, AlertCircle, Clock, AlertTriangle, HelpCircle } from 'lucide-react';
import HelpPage from './HelpPage';

const HospitalSimulation = () => {
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [beds, setBeds] = useState(100);
  const [occupiedBeds, setOccupiedBeds] = useState(0);
  const [doctors, setDoctors] = useState(20);
  const [nurses, setNurses] = useState(50);
  const [patientInflux, setPatientInflux] = useState(5);
  const [avgTreatmentDays, setAvgTreatmentDays] = useState(3);
  const [waitingPatients, setWaitingPatients] = useState(0);
  const [treatedPatients, setTreatedPatients] = useState(0);
  const [dischargedPatients, setDischargedPatients] = useState(0);
  const [patientSeverity, setPatientSeverity] = useState({ mild: 0, moderate: 0, severe: 0 });
  const [staffUtilization, setStaffUtilization] = useState({ doctors: 0, nurses: 0 });
  const [performanceMetrics, setPerformanceMetrics] = useState({ occupancyRate: 0, staffToPatientRatio: 0 });
  const [recommendations, setRecommendations] = useState([]);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [patientStays, setPatientStays] = useState([]);
  const [showHelp, setShowHelp] = useState(false);

  const triggerMassCasualty = useCallback(() => {
    const casualties = Math.floor(Math.random() * 50) + 50;
    setWaitingPatients(prev => prev + casualties);
  }, []);

  const runSimulation = useCallback(() => {
    setTime(prevTime => {
      const newTime = prevTime + 1;
      
      const newPatients = Math.floor(Math.random() * patientInflux);
      setWaitingPatients(prev => prev + newPatients);
      
      const availableStaff = Math.min(doctors, nurses);
      const treatedThisHour = Math.min(availableStaff, waitingPatients, beds - occupiedBeds);
      
      setOccupiedBeds(prev => prev + treatedThisHour);
      setWaitingPatients(prev => prev - treatedThisHour);
      setTreatedPatients(prev => prev + treatedThisHour);
      
      setPatientStays(prev => [
        ...prev,
        ...Array(treatedThisHour).fill().map(() => Math.floor(Math.random() * avgTreatmentDays * 24))
      ]);
      
      const updatedPatientStays = patientStays.map(stay => stay - 1);
      const discharged = updatedPatientStays.filter(stay => stay <= 0).length;
      setPatientStays(updatedPatientStays.filter(stay => stay > 0));
      setOccupiedBeds(prev => Math.max(0, prev - discharged));
      setDischargedPatients(prev => prev + discharged);
      
      setPatientSeverity({
        mild: Math.floor(occupiedBeds * 0.5),
        moderate: Math.floor(occupiedBeds * 0.3),
        severe: Math.floor(occupiedBeds * 0.2),
      });
      
      setStaffUtilization({
        doctors: Math.min(1, occupiedBeds / (doctors * 5)),
        nurses: Math.min(1, occupiedBeds / (nurses * 2)),
      });
      
      const occupancyRate = occupiedBeds / beds;
      const staffToPatientRatio = (doctors + nurses) / (occupiedBeds || 1);
      setPerformanceMetrics({ occupancyRate, staffToPatientRatio });
      
      const newRecommendations = [];
      if (occupancyRate > 0.9) newRecommendations.push("High occupancy rate. Consider increasing bed capacity.");
      if (staffToPatientRatio < 0.2) newRecommendations.push("Low staff-to-patient ratio. Consider increasing staff.");
      if (waitingPatients > beds * 0.5) newRecommendations.push("Long wait times. Consider optimizing patient flow.");
      if (staffToPatientRatio > 0.5) newRecommendations.push("Potential overstaffing. Consider optimizing staff allocation.");
      if (occupancyRate < 0.5 && staffToPatientRatio > 0.4) newRecommendations.push("Low occupancy and high staff ratio. Consider reducing staff or increasing patient intake.");
      setRecommendations(newRecommendations);
      
      setTimeSeriesData(prev => [
        ...prev,
        {
          hour: newTime,
          occupiedBeds,
          waitingPatients,
          treatedPatients,
          dischargedPatients,
        }
      ]);

      return newTime;
    });
  }, [beds, doctors, nurses, patientInflux, avgTreatmentDays, occupiedBeds, waitingPatients, patientStays]);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(runSimulation, 1000);
    }
    return () => clearInterval(interval);
  }, [running, runSimulation]);

  const toggleSimulation = () => {
    setRunning(prev => !prev);
  };

  const resetSimulation = () => {
    setRunning(false);
    setTime(0);
    setOccupiedBeds(0);
    setWaitingPatients(0);
    setTreatedPatients(0);
    setDischargedPatients(0);
    setTimeSeriesData([]);
    setPatientStays([]);
    setRecommendations([]);
  };

  const SimulationControls = () => (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">Simulation Controls</h2>
      <div>
        <button onClick={toggleSimulation} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
          {running ? <Pause className="inline-block mr-2" /> : <Play className="inline-block mr-2" />}
          {running ? 'Pause' : 'Start'}
        </button>
        <button onClick={resetSimulation} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">
          <RotateCcw className="inline-block mr-2" />
          Reset
        </button>
        <button onClick={triggerMassCasualty} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          <AlertTriangle className="inline-block mr-2" />
          Trigger Mass Casualty
        </button>
      </div>
    </div>
  );

  const HospitalParameters = () => (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">Hospital Parameters</h2>
      <div className="mb-4">
        <label className="block mb-2">Total Beds: {beds}</label>
        <input
          type="range"
          min="10"
          max="500"
          step="10"
          value={beds}
          onChange={(e) => setBeds(Number(e.target.value))}
          disabled={running}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Currently Occupied Beds: {occupiedBeds}</label>
        <input
          type="range"
          min="0"
          max={beds}
          value={occupiedBeds}
          onChange={(e) => setOccupiedBeds(Number(e.target.value))}
          disabled={running}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Doctors: {doctors}</label>
        <input
          type="range"
          min="1"
          max="100"
          value={doctors}
          onChange={(e) => setDoctors(Number(e.target.value))}
          disabled={running}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Nurses: {nurses}</label>
        <input
          type="range"
          min="1"
          max="200"
          value={nurses}
          onChange={(e) => setNurses(Number(e.target.value))}
          disabled={running}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Patient Influx (per hour): {patientInflux}</label>
        <input
          type="range"
          min="1"
          max="20"
          value={patientInflux}
          onChange={(e) => setPatientInflux(Number(e.target.value))}
          disabled={running}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Avg Treatment Time (days): {avgTreatmentDays}</label>
        <input
          type="range"
          min="1"
          max="30"
          value={avgTreatmentDays}
          onChange={(e) => setAvgTreatmentDays(Number(e.target.value))}
          disabled={running}
          className="w-full"
        />
      </div>
    </div>
  );

  const HospitalStats = () => (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">Hospital Statistics</h2>
      <p>Total Beds: {beds}</p>
      <p>Occupied Beds: {occupiedBeds}</p>
      <p>Available Beds: {beds - occupiedBeds}</p>
      <p>Waiting Patients: {waitingPatients}</p>
      <p>Treated Patients: {treatedPatients}</p>
      <p>Discharged Patients: {dischargedPatients}</p>
    </div>
  );

  const PerformanceMetricsCard = () => (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">Performance Metrics</h2>
      <p>Occupancy Rate: {(performanceMetrics.occupancyRate * 100).toFixed(2)}%</p>
      <p>Staff-to-Patient Ratio: {performanceMetrics.staffToPatientRatio.toFixed(2)}</p>
    </div>
  );

  const RecommendationsCard = () => (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">Recommendations</h2>
      {recommendations.map((rec, index) => (
        <p key={index} className="flex items-center">
          <AlertCircle className={`mr-2 ${index === 0 ? "text-red-500" : index === 1 ? "text-yellow-500" : "text-green-500"}`} />
          {rec}
        </p>
      ))}
    </div>
  );

  const TimeSeriesChart = () => (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">Time Series Data</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="hour" 
              label={{ value: 'Hours', position: 'insideBottomRight', offset: -5 }}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis label={{ value: 'Patients', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              labelFormatter={(value) => `${value}`}
              formatter={(value, name, props) => [value, name]}
            />
            <Legend />
            <Line type="monotone" dataKey="occupiedBeds" stroke="#8884d8" name="Occupied Beds" />
            <Line type="monotone" dataKey="waitingPatients" stroke="#82ca9d" name="Waiting Patients" />
            <Line type="monotone" dataKey="treatedPatients" stroke="#ffc658" name="Treated Patients" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="p-4 relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Hospital Simulation</h1>
        <button 
          onClick={() => setShowHelp(true)} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <HelpCircle className="mr-2" />
          Help
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SimulationControls />
        <HospitalParameters />
        <HospitalStats />
        <PerformanceMetricsCard />
        <RecommendationsCard />
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Simulation Time</h2>
          <div className="flex items-center">
            <Clock className="mr-2" /> 
            Hour {time}
          </div>
        </div>
      </div>
      <TimeSeriesChart />
      {showHelp && <HelpPage onClose={() => setShowHelp(false)} />}
      
      {/* Add the "Created by" section here */}
      <div className="mt-8 text-center text-gray-600">
        <p>Created by  <a 
            href="https://www.github.com/jmesplana" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >John Mark Esplana</a>
        </p>
      </div>
    </div>
    
  );
};

export default HospitalSimulation;
