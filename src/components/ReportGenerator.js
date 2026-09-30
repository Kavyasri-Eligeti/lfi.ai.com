import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import '../App.css';

const ReportGenerator = () => {
  const [selectedKPI, setSelectedKPI] = useState('All');
  const [timeRange, setTimeRange] = useState('30D');
  const [selectedSite, setSelectedSite] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiData, setApiData] = useState([]);
  const [file, setFile] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'];
  const SEVERITY_COLORS = {
    Critical: '#ef4444',
    Warning: '#f59e0b',
    Minor: '#fbbf24'
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setValidationError('');
    
    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
        setValidationError('Please select a CSV file');
        return;
      }
      
      if (selectedFile.size > 10 * 1024 * 1024) {
        setValidationError('File size must be less than 10MB');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const file = droppedFiles[0];
      const event = { target: { files: [file] } };
      handleFileChange(event);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('frequency', timeRange);

    try {
      const response = await fetch(' https://ungenuine-neville-oasitic.ngrok-free.dev/api/recommendations', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      let apiDataToSet = data.data || data || [];

      if (!Array.isArray(apiDataToSet)) {
        if (typeof apiDataToSet === 'object' && apiDataToSet !== null) {
          apiDataToSet = Object.values(apiDataToSet).find(val => Array.isArray(val)) || [];
        } else {
          apiDataToSet = [];
        }
      }

      setApiData(apiDataToSet);
      setDataLoaded(true);
      setLastRefreshTime(new Date());
      setUploadProgress(100);
      
      setTimeout(() => {
        setLoading(false);
        setUploadProgress(0);
      }, 500);
      
      clearInterval(progressInterval);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.message || 'Upload failed');
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleRefresh = useCallback(async () => {
    if (!file) return;

    setIsRefreshing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('frequency', timeRange);

    try {
      const response = await fetch('https://ungenuine-neville-oasitic.ngrok-free.dev/api/recommendations', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Refresh failed');
      }

      const data = await response.json();
      let apiDataToSet = data.data || data || [];

      if (!Array.isArray(apiDataToSet)) {
        if (typeof apiDataToSet === 'object' && apiDataToSet !== null) {
          apiDataToSet = Object.values(apiDataToSet).find(val => Array.isArray(val)) || [];
        } else {
          apiDataToSet = [];
        }
      }

      setApiData(apiDataToSet);
      setLastRefreshTime(new Date());
      setTimeout(() => setIsRefreshing(false), 500);
    } catch (err) {
      setError(err.message || 'Refresh failed');
      setIsRefreshing(false);
    }
  }, [file, timeRange]);

  useEffect(() => {
    let refreshInterval;
    if (autoRefresh && dataLoaded) {
      refreshInterval = setInterval(() => {
        handleRefresh();
      }, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [autoRefresh, dataLoaded, handleRefresh]);

  // Function to filter data based on selected time range
  const filterDataByTimeRange = (data, range) => {
    if (!Array.isArray(data) || data.length === 0) return [];
    
    // Get the latest date from the data
    const latestDate = Math.max(...data
      .filter(item => item.date)
      .map(item => new Date(item.date).getTime())
    );
    
    if (isNaN(latestDate)) return data;
    
    // Calculate the start date based on the selected range
    const startDate = new Date(latestDate);
    const days = range === '30D' ? 30 : range === '90D' ? 90 : 180;
    startDate.setDate(startDate.getDate() - days);
    
    // Filter data to only include the selected time range
    return data.filter(item => {
      if (!item.date) return false;
      const itemDate = new Date(item.date);
      return itemDate >= startDate;
    });
  };

  const processedData = useMemo(() => {
    if (!Array.isArray(apiData) || apiData.length === 0) return [];

    let filteredData = apiData;

    // Filter by train_window based on selected timeRange
    if (timeRange && filteredData.length > 0 && filteredData[0].train_window) {
      filteredData = filteredData.filter(item => item.train_window === timeRange);
    }

    if (selectedSite !== 'All') {
      filteredData = filteredData.filter(item => item.site_id === selectedSite);
    }

    if (selectedKPI !== 'All') {
      filteredData = filteredData.filter(item => item.kpi === selectedKPI);
    }

    // Apply category filter after site and KPI filters
    if (selectedCategory !== 'All') {
      filteredData = filteredData.filter(item => {
        const votes = item.anomaly_votes || 0;

        switch (selectedCategory) {
          case 'Critical':
            return votes === 3;
          case 'Warning':
            return votes === 2;
          case 'Minor':
            // Include data where only one model said it's an anomaly (anomaly_votes = 1)
            return votes === 1;
          default:
            return true;
        }
      });
    }

    // Sort by date to ensure proper chronological order
    const sortedData = filteredData.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
    });

    const finalData = sortedData.map(item => ({
      ...item,
      date: item.date ? new Date(item.date).toLocaleDateString() : 'N/A',
      dateValue: item.date ? new Date(item.date).getTime() : 0,
      KPI_Value: item.value,
      Threshold: item.threshold || 0,
      anomaly_votes: item.anomaly_votes || 0,
      is_anomaly: item.is_anomaly || false,
      severity: item.is_anomaly
        ? (item.anomaly_votes === 3 ? 'Critical' : item.anomaly_votes === 2 ? 'Warning' : 'Minor')
        : 'Normal'
    }));

    // Apply time range filter to the final data
    return filterDataByTimeRange(finalData, timeRange);
  }, [apiData, selectedSite, selectedKPI, selectedCategory, timeRange]);

  // Separate data for Anomaly Table - only filtered by frequency and category, NOT by site/KPI
  const anomalyTableData = useMemo(() => {
    if (!Array.isArray(apiData) || apiData.length === 0) return [];

    let filteredData = apiData;

    // Filter by train_window based on selected timeRange
    if (timeRange && filteredData.length > 0 && filteredData[0].train_window) {
      filteredData = filteredData.filter(item => item.train_window === timeRange);
    }

    // Only filter by category, NOT by site or KPI
    if (selectedCategory !== 'All') {
      filteredData = filteredData.filter(item => {
        if (!item.is_anomaly) return false;

        const votes = item.anomaly_votes || 0;
        switch (selectedCategory) {
          case 'Critical':
            return votes === 3;
          case 'Warning':
            return votes === 2;
          case 'Minor':
            return votes === 1;
          default:
            return true;
        }
      });
    } else {
      // Show only anomalies
      filteredData = filteredData.filter(item => item.is_anomaly);
    }

    // Sort by date
    const sortedData = filteredData.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
    });

    return sortedData.map(item => ({
      ...item,
      date: item.date ? new Date(item.date).toLocaleDateString() : 'N/A',
      severity: item.is_anomaly
        ? (item.anomaly_votes === 3 ? 'Critical' : item.anomaly_votes === 2 ? 'Warning' : 'Minor')
        : 'Normal'
    }));
  }, [apiData, selectedCategory, timeRange]);

  const summaryMetrics = useMemo(() => {
    if (!apiData.length) {
      return {
        totalSites: 0,
        totalAnomalySites: 0,
        totalKPIs: 0,
        uniqueImpactedKPIs: 0,
        criticalAnomalies: 0,
        warningKPIs: 0,
        minorImpactedKPIs: 0
      };
    }

    // Count TOTAL unique sites and KPIs from ALL data (not filtered by train_window)
    const allUniqueSites = new Set(
      apiData
        .map(item => item.site_id)
        .filter(site => site !== null && site !== undefined && site !== '')
    );

    const allUniqueKPIs = new Set(
      apiData
        .map(item => item.kpi)
        .filter(kpi => kpi !== null && kpi !== undefined && kpi !== '')
    );

    // Filter by train_window for anomaly-related counts
    let filteredData = apiData;
    if (timeRange && filteredData.length > 0 && filteredData[0].train_window) {
      filteredData = filteredData.filter(item => item.train_window === timeRange);
    }

    // Count anomaly sites and KPIs from filtered data
    const anomalySites = new Set(
      filteredData
        .filter(item => item.is_anomaly)
        .map(item => item.site_id)
        .filter(site => site !== null && site !== undefined && site !== '')
    );

    const impactedKPIs = new Set(
      filteredData
        .filter(item => item.is_anomaly)
        .map(item => item.kpi)
        .filter(kpi => kpi !== null && kpi !== undefined && kpi !== '')
    );

    const criticalAnomalies = filteredData.filter(item =>
      item.is_anomaly && (item.anomaly_votes || 0) === 3
    ).length;
    const warningKPIs = filteredData.filter(item =>
      item.is_anomaly && (item.anomaly_votes || 0) === 2
    ).length;
    const minorImpactedKPIs = filteredData.filter(item =>
      item.is_anomaly && (item.anomaly_votes || 0) === 1
    ).length;

    return {
      totalSites: allUniqueSites.size,
      totalAnomalySites: anomalySites.size,
      totalKPIs: allUniqueKPIs.size,
      uniqueImpactedKPIs: impactedKPIs.size,
      criticalAnomalies,
      warningKPIs,
      minorImpactedKPIs
    };
  }, [apiData, timeRange]);

  const anomalyKPISummary = useMemo(() => {
    if (!apiData.length) return [];

    // Filter by train_window only, not by other filters
    let filteredData = apiData;
    if (timeRange && filteredData.length > 0 && filteredData[0].train_window) {
      filteredData = filteredData.filter(item => item.train_window === timeRange);
    }

    const kpiCounts = {};
    filteredData.filter(item => item.is_anomaly).forEach(item => {
      if (item.kpi) {
        kpiCounts[item.kpi] = (kpiCounts[item.kpi] || 0) + 1;
      }
    });

    return Object.entries(kpiCounts).map(([kpi, count]) => ({
      kpi,
      count
    }));
  }, [apiData, timeRange]);

  const siteSummaryData = useMemo(() => {
    if (!apiData.length) return [];

    // Filter by train_window only, not by other filters
    let filteredData = apiData;
    if (timeRange && filteredData.length > 0 && filteredData[0].train_window) {
      filteredData = filteredData.filter(item => item.train_window === timeRange);
    }

    const siteCounts = {};
    filteredData.filter(item => item.is_anomaly).forEach(item => {
      if (item.site_id) {
        siteCounts[item.site_id] = (siteCounts[item.site_id] || 0) + 1;
      }
    });

    return Object.entries(siteCounts).map(([site, value]) => ({
      name: site,
      value
    }));
  }, [apiData, timeRange]);

  const rcaData = useMemo(() => {
    if (!selectedAnomaly) return [];

    const rcaArray = [];

    // Build RCA data from counter and percentage fields
    if (selectedAnomaly.rca_counter_1 && selectedAnomaly.rca_pct_1) {
      rcaArray.push({
        counter: selectedAnomaly.rca_counter_1,
        value: parseFloat(selectedAnomaly.rca_pct_1),
        percentage: selectedAnomaly.rca_pct_1,
        severity: 'Critical'
      });
    }

    if (selectedAnomaly.rca_counter_2 && selectedAnomaly.rca_pct_2) {
      rcaArray.push({
        counter: selectedAnomaly.rca_counter_2,
        value: parseFloat(selectedAnomaly.rca_pct_2),
        percentage: selectedAnomaly.rca_pct_2,
        severity: 'Warning'
      });
    }

    if (selectedAnomaly.rca_counter_3 && selectedAnomaly.rca_pct_3) {
      rcaArray.push({
        counter: selectedAnomaly.rca_counter_3,
        value: parseFloat(selectedAnomaly.rca_pct_3),
        percentage: selectedAnomaly.rca_pct_3,
        severity: 'Minor'
      });
    }

    console.log('RCA Data generated:', rcaArray);

    // If no RCA data available, return empty
    return rcaArray.length > 0 ? rcaArray : [];
  }, [selectedAnomaly]);

  const handlePointClick = (data) => {
    console.log('=== POINT CLICKED ===');
    console.log('Clicked data:', data);

    if (data) {
      console.log('Setting RCA data for:', data);
      setSelectedAnomaly(data);
    }
  };

  const handleCloseRCA = () => {
    console.log('Clearing RCA');
    setSelectedAnomaly(null);
  };

  const siteOptions = useMemo(() => {
    const sites = ['All', ...new Set(apiData.map(item => item.site_id))];
    return sites;
  }, [apiData]);

  const kpiOptions = useMemo(() => {
    const kpis = ['All', ...new Set(apiData.map(item => item.kpi))];
    return kpis;
  }, [apiData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{
          background: '#1f2937',
          border: '1px solid #4b5563',
          borderRadius: '4px',
          padding: '6px 8px',
          color: 'white',
          fontSize: '10px',
          maxWidth: '160px',
          boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.2)'
        }}>
          <p style={{
            margin: '0 0 4px 0',
            fontWeight: '600',
            color: '#e5e7eb',
            fontSize: '11px'
          }}>
            {data.date}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', gap: '8px' }}>
            <span style={{ color: '#9ca3af' }}>KPI:</span>
            <span style={{ color: '#10b981', fontWeight: '500' }}>{data.KPI_Value}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', gap: '8px' }}>
            <span style={{ color: '#9ca3af' }}>Threshold:</span>
            <span style={{ color: '#f59e0b', fontWeight: '500' }}>{data.Threshold}</span>
          </div>
          {data.is_anomaly && (
            <div style={{
              marginTop: '4px',
              padding: '2px 6px',
              borderRadius: '3px',
              background: 'rgba(239, 68, 68, 0.1)',
              borderLeft: `2px solid ${SEVERITY_COLORS[data.severity] || '#ef4444'}`
            }}>
              <span style={{
                color: SEVERITY_COLORS[data.severity] || '#ef4444',
                fontWeight: '600',
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {data.severity}
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const RCATooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: '#1f2937', padding: '12px', border: '1px solid #4b5563', borderRadius: '8px' }}>
          <p style={{ fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>{data.counter}</p>
          <p style={{ color: '#22d3ee', fontSize: '1.125rem', fontWeight: 'bold' }}>{data.percentage}</p>
        </div>
      );
    }
    return null;
  };

  const SkeletonLoader = () => (
    <div className="skeleton-loader">
      <div className="skeleton-grid">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="skeleton-item"></div>
        ))}
      </div>
      <div className="charts-grid">
        <div className="skeleton-chart"></div>
        <div className="skeleton-chart"></div>
      </div>
      <div className="skeleton-table"></div>
    </div>
  );

  const formatRefreshTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-overlay"></div>
        <div className="header-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '12px', position: 'relative' }}>
            <h1 className="header-title" style={{ margin: 0 }}>
              KPI MONITORING & METRIC SURVEILLANCE
            </h1>
            <img
              src="/logo_new.png"
              alt="LFI Logo"
              style={{
                height: '100px',
                width: 'auto',
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
                position: 'absolute',
                right: '20px'
              }}
            />
          </div>
          <p className="header-subtitle">Real-time Anomaly Detection & Analysis Dashboard</p>
          {lastRefreshTime && (
            <p className="last-update">
              Last updated: {formatRefreshTime(lastRefreshTime)}
            </p>
          )}
        </div>
      </header>

      <main className="main-content">
        {/* Sample Files Download Section */}
        <section className="section-card sample-files-section">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>Sample Files</h2>
              <p style={{ fontSize: '0.75rem', color: '#e9d5ff' }}>Don't have files? Download sample CSV files</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a
                href="/sample1.csv"
                download="sample1.csv"
                style={{ 
                  background: 'linear-gradient(to right, #06b6d4, #2563eb)', 
                  color: 'white', 
                  padding: '10px 20px', 
                  borderRadius: '8px', 
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  border: '2px solid #06b6d4',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s'
                }}
              >
                Download Sample 1
              </a>
              <a
                href="/sample2.csv"
                download="sample2.csv"
                style={{ 
                  background: 'linear-gradient(to right, #ec4899, #7c3aed)', 
                  color: 'white', 
                  padding: '10px 20px', 
                  borderRadius: '8px', 
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  border: '2px solid #ec4899',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s'
                }}
              >
                Download Sample 2
              </a>
            </div>
          </div>
        </section>

        {/* Upload Form */}
        <section className="section-card upload-section">
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: 'white', 
            marginBottom: '20px', 
            textAlign: 'center',
            background: 'linear-gradient(to right, #22d3ee, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Generate KPI Analysis Report
          </h2>

          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            {/* Frequency Dropdown */}
            <div className="form-group">
              <label htmlFor="frequency-select" className="form-label">Select Frequency</label>
              <select
                id="frequency-select"
                className="form-select"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="30D">30 Days</option>
                <option value="90D">90 Days</option>
                <option value="180D">180 Days</option>
              </select>
            </div>

            {/* File Upload */}
            <div className="form-group">
              <label htmlFor="file-upload" className="form-label">
                Upload CSV File
                <span style={{ fontSize: '0.75rem', color: '#e9d5ff', marginLeft: '8px', fontWeight: 'normal' }}>
                  (Max 10MB)
                </span>
              </label>
              <div
                className={`upload-area ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div>
                  <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="upload-text">
                    {file ? file.name : 'Drag & drop your CSV file here'}
                  </p>
                  <label htmlFor="file-input-browse" className="upload-subtext">
                    or click to browse
                  </label>
                  <input
                    id="file-input-browse"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="file-input-hidden"
                  />
                </div>
              </div>

              {validationError && (
                <div className="validation-error">
                  {validationError}
                </div>
              )}

              {file && !validationError && (
                <div className="file-display">
                  <div className="file-info">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setValidationError('');
                    }}
                    className="file-remove"
                  >
                    ×
                  </button>
                </div>
              )}

              {uploadProgress > 0 && (
                <div className="progress-container">
                  <div className="progress-header">
                    <span className="progress-label">Uploading...</span>
                    <span className="progress-value">{uploadProgress}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <div style={{ paddingTop: '24px', textAlign: 'center' }}>
              <button
                onClick={handleUpload}
                disabled={loading || !file || !!validationError}
                className="btn btn-generate"
              >
                {loading ? (
                  <span className="loading-spinner">
                    <svg className="spinner-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Generate Report'}
              </button>
            </div>
          </div>
        </section>

        {/* Error Display */}
        {error && (
          <div className="error-container">
            <div className="error-box">
              <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="error-text">{error}</span>
            </div>
          </div>
        )}

        {/* Refresh Controls */}
        {dataLoaded && (
          <section className="refresh-section">
            <div className="refresh-controls">
              <div className="auto-refresh-control">
                <label htmlFor="auto-refresh-toggle" className="toggle-label">Auto-Refresh</label>
                <button
                  id="auto-refresh-toggle"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`toggle-switch ${autoRefresh ? 'active' : ''}`}
                >
                  <span className="toggle-slider"></span>
                </button>
                {autoRefresh && (
                  <span className="refresh-indicator">(30s)</span>
                )}
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing || !file}
                className="btn btn-refresh"
              >
                <svg
                  style={{ width: '16px', height: '16px' }}
                  className={isRefreshing ? 'animate-spin' : ''}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </section>
        )}

        {/* Empty State */}
        {(!Array.isArray(apiData) || apiData.length === 0) && !error && (
          <div className="empty-state">
            <h3 className="empty-state-title">No Data Available</h3>
            <p className="empty-state-text">Upload a CSV file to begin analysis</p>
            <div className="empty-state-tip">
              <p className="empty-state-tip-text">
                <span className="tip-highlight">Tip:</span> Select a frequency (pickup days) and upload your CSV file to view the KPI monitoring dashboard with anomaly detection insights.
              </p>
            </div>
          </div>
        )}

        {/* Data Display Section */}
        {(Array.isArray(apiData) && apiData.length > 0) && (
          <>
            {loading && <SkeletonLoader />}
            {!loading && (
              <>
                {/* Summary Section */}
                <section className="summary-section">
                  <div className="summary-overlay"></div>
                  <div style={{ position: 'relative', zIndex: 10 }}>
                    <h2 className="section-title">
                      <span className="title-indicator"></span>
                      KPI and Site Summary
                      <span className="live-badge">Live Analytics</span>
                    </h2>

                    {/* Metrics */}
                    <div className="metrics-grid">
                      <div className="metric-card">
                        <div className="metric-label">Total Sites</div>
                        <div className="metric-value">{summaryMetrics.totalSites}</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-label">Anomaly Sites</div>
                        <div className="metric-value">{summaryMetrics.totalAnomalySites}</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-label">Total KPIs</div>
                        <div className="metric-value">{summaryMetrics.totalKPIs}</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-label">Impacted KPIs</div>
                        <div className="metric-value">{summaryMetrics.uniqueImpactedKPIs}</div>
                      </div>
                      <div className="metric-card critical">
                        <div className="metric-label critical">Critical</div>
                        <div className="metric-value critical">{summaryMetrics.criticalAnomalies}</div>
                      </div>
                      <div className="metric-card warning">
                        <div className="metric-label warning">Warning</div>
                        <div className="metric-value warning">{summaryMetrics.warningKPIs}</div>
                      </div>
                      <div className="metric-card minor">
                        <div className="metric-label minor">Minor</div>
                        <div className="metric-value minor">{summaryMetrics.minorImpactedKPIs}</div>
                      </div>
                    </div>

                    {/* Charts */}
                    <div className="charts-grid">
                      <div className="chart-card">
                        <h3 className="chart-title">
                          <span className="chart-indicator blue"></span>
                          Anomaly KPI Summary
                        </h3>
                        <div style={{ height: '300px' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                              data={anomalyKPISummary}
                              margin={{
                                top: 5,
                                right: 10,
                                left: 10,
                                bottom: 50,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                              <XAxis 
                                dataKey="kpi" 
                                stroke="#fff" 
                                angle={-45} 
                                textAnchor="end" 
                                height={80}
                                tick={{fontSize: 12}}
                                interval={0}
                              />
                              <YAxis stroke="#fff" />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#1f2937', 
                                  border: '1px solid #4b5563', 
                                  borderRadius: '8px',
                                  padding: '8px 12px'
                                }} 
                                labelStyle={{ fontWeight: 'bold', color: '#e5e7eb' }}
                              />
                              <Legend 
                                layout="horizontal"
                                verticalAlign="top"
                                align="center"
                                wrapperStyle={{
                                  paddingBottom: '10px',
                                  fontSize: '14px'
                                }}
                              />
                              <Bar 
                                dataKey="count" 
                                fill="#3b82f6" 
                                name="Total Anomalies" 
                                radius={[4, 4, 0, 0]} 
                                barSize={30}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="chart-card" style={{ position: 'relative' }}>
                        <h3 className="chart-title">
                          <span className="chart-indicator purple"></span>
                          Site Summary
                        </h3>
                        <div style={{ marginTop: '20px' }}>
                          <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                              <Pie
                                data={siteSummaryData}
                                cx="50%"
                                cy="45%"
                                labelLine={{
                                  stroke: '#9ca3af',
                                  strokeWidth: 1
                                }}
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                  // Safety check to prevent undefined access
                                  if (!siteSummaryData[index]) return null;

                                  const RADIAN = Math.PI / 180;
                                  const radius = innerRadius + (outerRadius - innerRadius) * 1.5;
                                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                  return (
                                    <text
                                      x={x}
                                      y={y}
                                      fill="white"
                                      textAnchor={x > cx ? 'start' : 'end'}
                                      dominantBaseline="central"
                                      fontSize="12px"
                                      fontWeight="600"
                                    >
                                      {`${siteSummaryData[index].name} (${(percent * 100).toFixed(1)}%)`}
                                    </text>
                                  );
                                }}
                                outerRadius={90}
                                innerRadius={45}
                                fill="#8884d8"
                                dataKey="value"
                                paddingAngle={3}
                                isAnimationActive={false}
                              >
                                {siteSummaryData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                              <Legend
                                wrapperStyle={{ paddingTop: '15px' }}
                                iconType="circle"
                                layout="horizontal"
                                align="center"
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Category Filter Section */}
                <section className="section-card" style={{
                  padding: '24px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  marginBottom: '24px'
                }}>
                  <h3 className="section-title" style={{ marginBottom: '20px' }}>
                    <span className="title-indicator" style={{ background: 'linear-gradient(to bottom, #f59e0b, #d97706)' }}></span>
                    Filter by Severity
                  </h3>
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}>
                    <button
                      onClick={() => setSelectedCategory('All')}
                      style={{
                        padding: '12px 28px',
                        borderRadius: '8px',
                        border: selectedCategory === 'All' ? '2px solid #22d3ee' : '2px solid transparent',
                        background: selectedCategory === 'All'
                          ? 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)'
                          : 'rgba(75, 85, 99, 0.5)',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: selectedCategory === 'All' ? '0 4px 6px -1px rgba(34, 211, 238, 0.3)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedCategory !== 'All') {
                          e.target.style.background = 'rgba(75, 85, 99, 0.8)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedCategory !== 'All') {
                          e.target.style.background = 'rgba(75, 85, 99, 0.5)';
                        }
                      }}
                    >
                      All Anomalies
                    </button>
                    <button
                      onClick={() => setSelectedCategory('Critical')}
                      style={{
                        padding: '12px 28px',
                        borderRadius: '8px',
                        border: selectedCategory === 'Critical' ? '2px solid #ef4444' : '2px solid transparent',
                        background: selectedCategory === 'Critical'
                          ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                          : 'rgba(75, 85, 99, 0.5)',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: selectedCategory === 'Critical' ? '0 4px 6px -1px rgba(239, 68, 68, 0.3)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedCategory !== 'Critical') {
                          e.target.style.background = 'rgba(75, 85, 99, 0.8)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedCategory !== 'Critical') {
                          e.target.style.background = 'rgba(75, 85, 99, 0.5)';
                        }
                      }}
                    >
                      Critical
                    </button>
                    <button
                      onClick={() => setSelectedCategory('Warning')}
                      style={{
                        padding: '12px 28px',
                        borderRadius: '8px',
                        border: selectedCategory === 'Warning' ? '2px solid #f59e0b' : '2px solid transparent',
                        background: selectedCategory === 'Warning'
                          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                          : 'rgba(75, 85, 99, 0.5)',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: selectedCategory === 'Warning' ? '0 4px 6px -1px rgba(245, 158, 11, 0.3)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedCategory !== 'Warning') {
                          e.target.style.background = 'rgba(75, 85, 99, 0.8)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedCategory !== 'Warning') {
                          e.target.style.background = 'rgba(75, 85, 99, 0.5)';
                        }
                      }}
                    >
                      Warning
                    </button>
                    <button
                      onClick={() => setSelectedCategory('Minor')}
                      style={{
                        padding: '12px 28px',
                        borderRadius: '8px',
                        border: selectedCategory === 'Minor' ? '2px solid #fbbf24' : '2px solid transparent',
                        background: selectedCategory === 'Minor'
                          ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                          : 'rgba(75, 85, 99, 0.5)',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: selectedCategory === 'Minor' ? '0 4px 6px -1px rgba(251, 191, 36, 0.3)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedCategory !== 'Minor') {
                          e.target.style.background = 'rgba(75, 85, 99, 0.8)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedCategory !== 'Minor') {
                          e.target.style.background = 'rgba(75, 85, 99, 0.5)';
                        }
                      }}
                    >
                      Minor
                    </button>
                  </div>

                  {/* Display anomaly count for selected category */}
                  <div style={{
                    marginTop: '20px',
                    textAlign: 'center',
                    color: '#e5e7eb',
                    fontSize: '0.875rem'
                  }}>
                    Showing <span style={{
                      fontWeight: 'bold',
                      color: '#22d3ee',
                      fontSize: '1.125rem'
                    }}>{anomalyTableData.length}</span> {selectedCategory === 'All' ? 'anomalies' : `${selectedCategory.toLowerCase()} anomalies`}
                  </div>
                </section>

                {/* KPI Analysis Section */}
                <section className="kpi-section">
                  <h2 className="section-title">
                    <span className="title-indicator" style={{ background: 'linear-gradient(to bottom, #a855f7, #7c3aed)' }}></span>
                    KPI Analysis & Trends
                  </h2>

                  {/* Filters */}
                  <div className="filters-grid">
                    <div className="form-group">
                      <label className="form-label">Site</label>
                      <select
                        className="form-select"
                        value={selectedSite}
                        onChange={(e) => setSelectedSite(e.target.value)}
                      >
                        {siteOptions.map(site => (
                          <option key={site} value={site}>
                            {site === 'All' ? 'All Sites' : site}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">KPI Name</label>
                      <select
                        className="form-select"
                        value={selectedKPI}
                        onChange={(e) => setSelectedKPI(e.target.value)}
                      >
                        {kpiOptions.map(kpi => (
                          <option key={kpi} value={kpi}>
                            {kpi === 'All' ? 'All KPIs' : kpi}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="charts-grid">
                    {/* KPI Trend Analysis */}
                    <div className="chart-card">
                      <h3 className="chart-title">
                        <span className="chart-indicator green"></span>
                        KPI Trend Analysis
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: '8px', fontWeight: 'normal' }}>
                          (Click on any point to view Counter Details)
                        </span>
                      </h3>
                      {processedData.length === 0 ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '250px',
                          flexDirection: 'column',
                          gap: '12px'
                        }}>
                          <svg style={{ width: '64px', height: '64px', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <p style={{ color: '#9ca3af', fontSize: '1rem', fontWeight: '600' }}>
                            No data available for the selected filters
                          </p>
                          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            Try selecting different Site, KPI, or Category filters
                          </p>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height={250}>
                          <LineChart data={processedData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                            <XAxis dataKey="date" stroke="#fff" angle={-45} textAnchor="end" height={80} />
                            <YAxis stroke="#fff" />
                            <Tooltip content={CustomTooltip} />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="KPI_Value"
                              stroke="#10b981"
                              strokeWidth={2}
                              name="KPI Value"
                              dot={(props) => {
                                const { cx, cy, payload } = props;
                                if (!payload.is_anomaly) return null; // Only show dots for anomalies

                                return (
                                  <g
                                    onClick={() => handlePointClick(payload)}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    {/* Larger invisible clickable area */}
                                    <circle
                                      cx={cx}
                                      cy={cy}
                                      r={15}
                                      fill="transparent"
                                      style={{
                                        cursor: 'pointer',
                                      }}
                                    />
                                    {/* Visual outer glow */}
                                    <circle
                                      cx={cx}
                                      cy={cy}
                                      r={10}
                                      fill="rgba(239, 68, 68, 0.3)"
                                      style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                      }}
                                    />
                                    {/* Inner dot */}
                                    <circle
                                      cx={cx}
                                      cy={cy}
                                      r={6}
                                      fill={payload.is_anomaly ? '#ef4444' : '#10b981'}
                                      stroke="#fff"
                                      strokeWidth={2}
                                      style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                      }}
                                      onMouseEnter={(e) => {
                                        e.target.setAttribute('r', 8);
                                        e.target.previousElementSibling.setAttribute('r', 12);
                                      }}
                                      onMouseLeave={(e) => {
                                        e.target.setAttribute('r', 6);
                                        e.target.previousElementSibling.setAttribute('r', 10);
                                      }}
                                    />
                                  </g>
                                );
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="Threshold"
                              stroke="#f59e0b"
                              strokeWidth={2}
                              name="Threshold"
                              strokeDasharray="5 5"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </div>

                    {/* RCA Panel - Always visible, populated when point is clicked */}
                    <div className="chart-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3 className="chart-title" style={{ marginBottom: 0 }}>
                          <span className="chart-indicator red"></span>
                          Root Cause Analysis
                          {selectedAnomaly && (
                            <span style={{ fontSize: '0.75rem', color: '#22d3ee', marginLeft: '8px', fontWeight: 'normal' }}>
                              ({selectedAnomaly.date} - {selectedAnomaly.site_id} - {selectedAnomaly.kpi})
                            </span>
                          )}
                        </h3>
                        {selectedAnomaly && (
                          <button
                            onClick={handleCloseRCA}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#9ca3af',
                              fontSize: '1.5rem',
                              cursor: 'pointer',
                              padding: '0 8px',
                              transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#fff'}
                            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                          >
                            ×
                          </button>
                        )}
                      </div>

                      {!selectedAnomaly ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '250px',
                          flexDirection: 'column',
                          gap: '12px'
                        }}>
                          <svg style={{ width: '64px', height: '64px', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p style={{ color: '#9ca3af', fontSize: '1rem', fontWeight: '600' }}>
                            Click on any point in KPI Trend Analysis
                          </p>
                          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            Counter usage details will appear here
                          </p>
                        </div>
                      ) : (
                        <>
                          {selectedAnomaly.is_anomaly && (
                            <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '0.875rem', color: '#fca5a5', fontWeight: '600' }}>⚠️ Anomaly Detected</span>
                                <span className={`anomaly-badge ${selectedAnomaly.severity.toLowerCase()}`}>
                                  {selectedAnomaly.severity}
                                </span>
                              </div>
                            </div>
                          )}

                          {rcaData.length === 0 ? (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '200px',
                              background: 'rgba(75, 85, 99, 0.1)',
                              borderRadius: '8px',
                              border: '1px solid #4b5563'
                            }}>
                              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                                No counter data available for this point
                              </p>
                            </div>
                          ) : (
                            <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={rcaData} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                              <XAxis type="number" stroke="#fff" domain={[0, 100]} />
                              <YAxis dataKey="counter" type="category" stroke="#fff" width={150} />
                              <Tooltip content={RCATooltip} />
                              <Bar
                                dataKey="value"
                                radius={[0, 8, 8, 0]}
                                label={(props) => {
                                  const { x, y, width, height, index } = props;
                                  const percentage = rcaData[index]?.percentage || '';
                                  return (
                                    <text
                                      x={x + width + 10}
                                      y={y + height / 2}
                                      fill="#fff"
                                      fontSize={14}
                                      fontWeight="bold"
                                      textAnchor="start"
                                      dominantBaseline="middle"
                                    >
                                      {percentage}
                                    </text>
                                  );
                                }}
                              >
                                {rcaData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.severity]} />
                                ))}
                              </Bar>
                            </BarChart>
                            </ResponsiveContainer>
                          )}

                          {selectedAnomaly.recommendation && (
                            <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(34, 211, 238, 0.1)', borderRadius: '6px', border: '1px solid rgba(34, 211, 238, 0.3)' }}>
                              <div style={{ fontSize: '0.875rem', color: '#22d3ee', fontWeight: '600', marginBottom: '4px' }}>💡 Recommended Action</div>
                              <div style={{ fontSize: '0.875rem', color: '#d1d5db' }}>{selectedAnomaly.recommendation}</div>
                            </div>
                          )}

                          {selectedAnomaly.root_cause && (
                            <div style={{ marginTop: '8px', padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                              <div style={{ fontSize: '0.875rem', color: '#f59e0b', fontWeight: '600', marginBottom: '4px' }}>🔍 Root Cause</div>
                              <div style={{ fontSize: '0.875rem', color: '#d1d5db' }}>{selectedAnomaly.root_cause}</div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="legend-box" style={{ maxWidth: '400px' }}>
                    <h4 className="legend-title">
                      <span className="chart-indicator indigo"></span>
                      Anomaly Severity Legend
                    </h4>
                    <div className="legend-items">
                      <div className="legend-item">
                        <span className="legend-dot critical"></span>
                        <span>For Critical</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-dot warning"></span>
                        <span>For Warning</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-dot minor"></span>
                        <span>For Minor</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Anomaly Details Table */}
                <section className="table-section">
                  <h3 className="section-title">
                    <span className="title-indicator" style={{ background: 'linear-gradient(to bottom, #ef4444, #dc2626)' }}></span>
                    Detailed Anomaly Analysis
                    <span style={{ fontSize: '0.875rem', color: '#9ca3af', marginLeft: '8px', fontWeight: 'normal' }}>
                      (Showing all anomalies for {timeRange})
                    </span>
                  </h3>
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Site</th>
                          <th>KPI</th>
                          <th>Value</th>
                          <th>Severity</th>
                          <th>Recommendation</th>
                          <th>Root Cause</th>
                        </tr>
                      </thead>
                      <tbody>
                        {anomalyTableData.map((item, index) => (
                            <tr key={index}>
                              <td>{item.date}</td>
                              <td>{item.site_id}</td>
                              <td>{item.kpi}</td>
                              <td>{item.value?.toFixed(2)}</td>
                              <td>
                                <span className={`anomaly-badge ${item.severity.toLowerCase()}`}>
                                  {item.severity}
                                </span>
                              </td>
                              <td>{item.recommendation || '-'}</td>
                              <td>{item.root_cause || '-'}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ReportGenerator;