import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom';
import styles from './ShakerTable.module.css';

// Register the necessary components for a bar chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Output = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [showChart, setShowChart] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const data = results.data;
          const times = data.map(row => row.time);
          const accelerations = data.map(row => row.acceleration);

          setChartData({
            labels: times,
            datasets: [{
              label: 'Acceleration',
              data: accelerations,
              backgroundColor: 'rgba(255, 0, 0, 0.2)',
              borderColor: 'rgba(255, 0, 0, 1)',
              borderWidth: 1
            }]
          });
        }
      });
    }
  };

  const handleSimulateClick = () => {
    setShowChart(true);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles.outputPage}>
      <nav className={styles.navbar}>
        <Link to="/">
          <button className={`${styles.navButton} ${styles.homeButton}`}>Back to Home page</button>
        </Link>
        <div className={styles.navButtonsRight}>
          <Link to="/top-10-earthquakes">
            <button className={styles.navButton}>Top 10 Strongest Earthquakes</button>
          </Link>
          <Link to="/casualties">
            <button className={styles.navButton}>Casualties</button>
          </Link>
        </div>
      </nav>
      <div className={styles.content}>
        <h1>SHAKER-TABLE OUTPUT</h1>
        <div className={styles.buttonContainer}>
          <span className={styles.fileName}>{fileName}</span>
          <button className={styles.navButton} onClick={handleUploadClick}>
            Upload Data
          </button>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button className={styles.navButton} onClick={handleSimulateClick}>
            Simulate
          </button>
        </div>
        {showChart && chartData.labels.length > 0 && (
          <div className={styles.chartContainer}>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Output;
