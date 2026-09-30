import React, { useState } from 'react';

function GolfPoseAnalyzer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setAnalysisResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a video file first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      console.log("Sending request to backend...");
      const response = await fetch('http://10.2.0.70:5001/analyze/', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let the browser set it with the correct boundary
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error("Error during analysis:", err);
      setError("An error occurred during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sport-analyzer">
      <h2>🏌️‍♂️ Golf Pose Analyzer</h2>
      <p>Upload a video of your swing to analyze your form.</p>

      <div className="upload-section">
        <input type="file" onChange={handleFileChange} accept="video/*,image/*" />
        <button onClick={handleUpload} disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze Swing'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {isLoading && <div className="loader"></div>}

      {analysisResult && (
        <div className="results-section">
          <h3>Analysis Results</h3>
          {analysisResult.length > 0 ? (
            <div className="poses-grid">
              {analysisResult.map((pose, index) => (
                <div key={index} className="pose-card">
                  <h4>{pose.pose_name}</h4>
                  <img src={pose.image_url} alt={`${pose.pose_name} pose`} />
                  <div className="angles-table">
                    <h5>Joint Angles</h5>
                    <table>
                      <tbody>
                        {Object.entries(pose.angles).map(([joint, angle]) => (
                          <tr key={joint}>
                            <td>{joint.replace('_', ' ')}</td>
                            <td>{angle.toFixed(2)}°</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No poses could be detected. Please try a different image with a clearer view of the person.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default GolfPoseAnalyzer;
