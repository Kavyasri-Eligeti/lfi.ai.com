// src/components/ResumeSummarizer.js
import { ENDPOINTS } from '../../config/endpoints';
import React, { useState } from 'react';
import { FaUpload, FaSpinner, FaFilePdf } from 'react-icons/fa';

const ResumeSummarizer = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a valid PDF file');
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      setError('');
      setSummary('');

      const response = await fetch(ENDPOINTS.resumeSummarize, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.[0]?.msg || 'Failed to process the resume');
      }

      const data = await response.json();
      setSummary(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err.message || 'An error occurred while processing your request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Resume Summarization</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="resume-upload" className="form-label d-block">
                    <FaFilePdf className="me-2" />
                    Upload your resume (PDF only)
                  </label>
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      id="resume-upload"
                      accept=".pdf"
                      onChange={handleFileChange}
                      disabled={loading}
                    />
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={!file || loading}
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="fa-spin me-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaUpload className="me-2" />
                          Summarize
                        </>
                      )}
                    </button>
                  </div>
                  {error && <div className="alert alert-danger mt-2">{error}</div>}
                </div>
              </form>

              {summary && (
                <div className="mt-4">
                  <h4>Summary:</h4>
                  <div className="card">
                    <div className="card-body">
                      <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                        {summary}
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

export default ResumeSummarizer;