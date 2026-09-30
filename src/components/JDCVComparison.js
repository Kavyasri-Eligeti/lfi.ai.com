// src/components/JDCVComparison.js
import React, { useState } from 'react';
import { FaUpload, FaSpinner, FaFilePdf } from 'react-icons/fa';

const JDCVComparison = () => {
  const [jdFile, setJdFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJDFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setJdFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a valid PDF file for Job Description');
      setJdFile(null);
    }
  };

  const handleCVFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setCvFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a valid PDF file for Resume');
      setCvFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jdFile || !cvFile) {
      setError('Please upload both Job Description and Resume');
      return;
    }

    const formData = new FormData();
    formData.append('jd_pdf', jdFile);
    formData.append('cv_pdf', cvFile);

    try {
      setLoading(true);
      setError('');
      setResult(null);

      const response = await fetch('http://10.2.0.70:5002/match-jd-cv/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.[0]?.msg || 'Failed to process the files');
      }

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err.message || 'An error occurred while processing your request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">JD & CV Matching</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="jd-upload" className="form-label">
                        <FaFilePdf className="me-2" />
                        Upload Job Description (PDF)
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="jd-upload"
                        accept=".pdf"
                        onChange={handleJDFileChange}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="cv-upload" className="form-label">
                        <FaFilePdf className="me-2" />
                        Upload Resume (PDF)
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="cv-upload"
                        accept=".pdf"
                        onChange={handleCVFileChange}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div className="d-grid">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={!jdFile || !cvFile || loading}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="fa-spin me-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaUpload className="me-2" />
                        Compare
                      </>
                    )}
                  </button>
                </div>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
              </form>

              {result && (
                <div className="mt-4">
                  <h4>Matching Results:</h4>
                  <div className="card">
                    <div className="card-body">
                      <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                        {result}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JDCVComparison;