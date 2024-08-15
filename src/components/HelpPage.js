import React from 'react';

const HelpPage = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-4/5 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Hospital Simulation Help</h3>
          <div className="mt-2 px-7 py-3 text-left">
            <h4 className="font-bold">How the Simulation Works:</h4>
            <p>This simulation models the operation of a hospital over time, taking into account various factors such as bed capacity, staffing, and patient influx.</p>
            
            <h4 className="font-bold mt-4">Parameters:</h4>
            <ul className="list-disc pl-5">
              <li><strong>Total Beds:</strong> The total number of beds in the hospital. This limits the number of patients that can be admitted.</li>
              <li><strong>Currently Occupied Beds:</strong> The number of beds occupied at the start of the simulation. This affects initial capacity.</li>
              <li><strong>Doctors:</strong> The number of doctors available. This affects the hospital's ability to treat patients.</li>
              <li><strong>Nurses:</strong> The number of nurses available. This also affects the hospital's treatment capacity.</li>
              <li><strong>Patient Influx:</strong> The average number of new patients arriving per hour.</li>
              <li><strong>Average Treatment Time:</strong> The average number of days a patient stays in the hospital.</li>
            </ul>

            <h4 className="font-bold mt-4">How to Read the Data:</h4>
            <ul className="list-disc pl-5">
              <li><strong>Hospital Statistics:</strong> Shows current numbers for occupied beds, waiting patients, treated patients, and discharged patients.</li>
              <li><strong>Performance Metrics:</strong> 
                <ul className="list-circle pl-5">
                  <li>Occupancy Rate: The percentage of beds currently in use.</li>
                  <li>Staff-to-Patient Ratio: The number of staff (doctors + nurses) per patient.</li>
                </ul>
              </li>
              <li><strong>Recommendations:</strong> Suggestions for improving hospital performance based on current metrics.</li>
              <li><strong>Time Series Data:</strong> A graph showing how key metrics change over time during the simulation.</li>
            </ul>

            <h4 className="font-bold mt-4">Controls:</h4>
            <ul className="list-disc pl-5">
              <li><strong>Start/Pause:</strong> Begins or pauses the simulation.</li>
              <li><strong>Reset:</strong> Returns all values to their initial state.</li>
              <li><strong>Trigger Mass Casualty:</strong> Simulates a sudden influx of patients, testing the hospital's capacity to handle emergencies.</li>
            </ul>

            <p className="mt-4">Experiment with different parameters to see how they affect the hospital's performance over time!</p>
          </div>
        </div>
        <div className="items-center px-4 py-3">
          <button
            id="ok-btn"
            className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
