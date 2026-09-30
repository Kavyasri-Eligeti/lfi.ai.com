// src/Pages/AnalyticsControlPanel.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AnalyticsControlPanel.css";

export default function BankingAnalytics() {
  const navigate = useNavigate();

  const handleOpenChurnAnalytics = () => {
    // Navigate to churn analytics or external link
    window.open("https://bankingchurn.lfidemo.com", "_blank", "noopener,noreferrer");
  };

  const handleOpenSegmentationAnalytics = () => {
    // Navigate to segmentation analytics
    // alert("Customer Segmentation Analytics - Coming Soon");
    window.open("https://bankingsegment.lfidemo.com", "_blank", "noopener,noreferrer");

};

  return (
    <div className="analytics-container">
      {/* Header with Logo */}
      <div className="analytics-header">
        <img
          src="/logo_new.png"
          alt="Linkfields Logo"
          className="analytics-logo"
        />
      </div>

      {/* Main Title */}
      <h1 className="analytics-title">Banking Analytics</h1>

      {/* Content Grid */}
      <div className="analytics-grid">
        {/* Card 1: Customer Churn Analytics */}
        <div className="analytics-card">
          <div className="analytics-visualization">
            <img
              src="/test.png"
              alt="Customer Churn Analytics"
              className="visualization-image"
            />
          </div>
          <button
            className="analytics-button"
            onClick={handleOpenChurnAnalytics}
          >
            Customer Churn Analytics
          </button>
        </div>

        {/* Card 2: Customer Segmentation Analytics */}
        <div className="analytics-card">
          <div className="analytics-visualization">
            <img
              src="/test1.png"
              alt="Customer Segmentation Analytics"
              className="visualization-image"
            />
          </div>
          <button
            className="analytics-button"
            onClick={handleOpenSegmentationAnalytics}
          >
            Customer Segmentation Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
