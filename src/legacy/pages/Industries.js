// src/Pages/Industries.js
import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import {
  FaIndustry,
  FaLaptopCode,
  FaGlobeAfrica,
  FaGolfBall,
  FaTractor,
  FaBolt,
  // FaBus,
  FaShieldAlt,
  FaShoppingCart,
  FaHospital,
  // FaFootballBall,
  FaPhotoVideo,
  // FaHardHat,
  FaBrain,
  FaEye,
  FaRobot,
  FaChartBar,
  FaFlag,
  FaGlobe,
  FaFileAlt,
  FaBalanceScale,
  // FaMoneyBillWave,
  FaUserTie,
  FaComments,
  // FaGraduationCap,
  FaPhone,
  // FaUniversity,
  FaUmbrella,
  FaCube,
  FaChartLine,
} from "react-icons/fa";
import { FaMagnifyingGlassChart } from "react-icons/fa6";
import { FaChromecast } from "react-icons/fa";
// import { FaBuildingFlag } from "react-icons/fa6";
import { RiBankLine } from 'react-icons/ri';
import { MdCellTower } from "react-icons/md";
import { RiBuildingFill } from "react-icons/ri";
// import { SiEducative } from "react-icons/si";
import { AiOutlineDollarCircle, AiOutlineLineChart, AiOutlineDatabase } from "react-icons/ai";
import { FaUserShield } from "react-icons/fa";
import { FaFileSignature } from "react-icons/fa";
import { FaProjectDiagram } from "react-icons/fa";
import { FaTachometerAlt } from "react-icons/fa";

export default function Industries() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  // const navigate = useNavigate();

  useEffect(() => {
    const prevHtmlBg = document.documentElement.style.backgroundColor;
    const prevBodyBg = document.body.style.backgroundColor;
    document.documentElement.style.backgroundColor = "#a0c4ff";
    document.body.style.backgroundColor = "#a0c4ff";
    return () => {
      document.documentElement.style.backgroundColor = prevHtmlBg;
      document.body.style.backgroundColor = prevBodyBg;
    };
  }, []);

  // Applications
  const apps = {
    golfAnalyzer: {
      name: "Golf Pose Analyzer",
      icon: <FaGolfBall size={32} color="#20c997" />,
      path: "/golf-analyzer",
    },
    RAG: {
      name: "RAG Chatbot",
      icon: <FaComments size={32} color="#007bff" />,
      path: "https://rag.lfiai.com/",
    },
     RAGmobile: {
      name: "RAG Chatbot Mobile App",
      icon: <FaComments size={32} color="#007bff" />,
      path: "https://ragmobile.lfiai.com/",
    },
    unmannedKiosk: {
      name: "Unmanned Kiosk",
      icon: <FaRobot size={32} color="#6f42c1" />,
      path: "https://uks.lfiai.com/",
    },
    resumeSummarizer: {
      name: "Resume Summarization",
      icon: <FaFileAlt size={32} color="#6f42c1" />,
      path: "/resume-summarizer",
    },
    jdCvComparison: {
      name: "JD & CV Comparison",
      icon: <FaBalanceScale size={32} color="#20c997" />,
      path: "/jd-cv-comparison",
    },
     CybersecurityLMS: {
      name: "Cybersecurity LMS",
      icon: <FaShieldAlt size={32} color="#20c997" />,
      path: "http://10.2.0.70:5003",
    },
    //  ChurnPrediction: {
    //   name: "Churn Prediction",
    //   icon: <FaShieldAlt size={32} color="#20c997" />,
    //   path: "http://10.2.0.70:5004",
    // },
    BankingAnalytics: {
      name: "Customer churn & Segmentation",
      icon: <RiBuildingFill size={32} color="#20c997" />,
      path: "/BankingAnalytics",
    },
    TelecomAnalytics: {
      name: "Customer churn & Segmentation",
      icon: <MdCellTower size={32} color="#20c997" />,
      path: "/TelecomAnalytics",
    },
      BankingTelecomAnalytics: {
      name: "(Banking+Telecom) customer Analytics",
      icon: <RiBuildingFill size={32} color="#20c997" />,
      path: "/BankingTelecomAnalytics",
    },
      BankingTelecomAnalytics1: {
      name: "(Banking+Telecom) customer Analytics",
      icon: <MdCellTower size={32} color="#20c997" />,
      path: "/BankingTelecomAnalytics",
    },
     claims_detection: {
      name: "Claims Fraud and Anomaly Detection",
      icon: <FaShieldAlt  size={32} color="#20c997" />,
      path: "https://insurancefraud.lfidemo.com",
    },

    TextIQ: {
      name: "TextIQ",
      icon: <img
        src="/images/textIQ_transparent.png"
        alt="TextIQ"
        style={{
          width: '72px',
          height: '72px',
          objectFit: 'contain'
        }}
      />,
      path: "https://textiq.lfidemo.com/",
    },
    vajraX: {
      name: "vajraX",
      icon: <img
        src="/images/vajraX.png"
        alt="vajraX"
        style={{
          width: '72px',
          height: '72px',
          objectFit: 'contain'
        }}
      />,
      path: "https://vajrax.lfidemo.com/",
    },
    // TextIQMobile: {
    //   name: "textIQ - Mobile",
    //   icon: <img 
    //     src="/images/textIQ_transparent.png" 
    //     alt="TextIQ" 
    //     style={{ 
    //       width: '72px', 
    //       height: '72px',
    //       objectFit: 'contain'
    //     }} 
    //   />,
    //   path: "https://ragmobile.lfiai.com",
    // },
    FinSight: {
      name: "FinSight",
      icon: <img 
        src="/images/Finsight_transparent.png" 
        alt="FinSight" 
        style={{ 
          width: '72px', 
          height: '72px',
          objectFit: 'contain'
        }} 
      />,
      path: "https://finsight.lfidemo.com/",
    },
    // SiteSense: {
    //   name: "SiteSense",
    //   icon: <img 
    //     src="/images/SiteSense_transparent.png" 
    //     alt="SiteSense" 
    //     style={{ 
    //       width: '80px', 
    //       height: '80px',
    //       objectFit: 'contain'
    //     }} 
    //   />,
    //   path: "http://10.2.3.61:8080/",
    // },
    Engage360: {
      name: "Engage360",
      icon: <img 
        src="/images/Engage360.png" 
        alt="Engage360" 
        style={{ 
          width: '80px', 
          height: '80px',
          objectFit: 'contain'
        }} 
      />,
      path: "https://engage360.lfidemo.com/",
    },
    EduPilot: {
      name: "EduPilot",
      icon: <img 
        src="/images/EduPilot_transparent.png" 
        alt="EduPilot" 
        style={{ 
          width: '80px', 
          height: '80px',
          objectFit: 'contain'
        }} 
      />,
      path: "https://edupilot.lfiai.com/",
    },
    InternalPortal: {
      name: "Internal Portal",
      icon: <img 
        src="/logo_n.png" 
        alt="Internal Portal" 
        style={{ 
          width: '18px', 
          height: '18px',
          objectFit: 'contain'
        }} 
      />,
      path: "https://internal.lfidemo.com/",
    },
    ConsulateSA: {
      name: "Consulate SA",
      icon: <img 
        src="/images/ashok_chakra.png" 
        alt="ashok chakra" 
        style={{ 
          width: '60px', 
          height: '50px',
          objectFit: 'contain'
        }} 
      />,
      path: "https://consulate-sa.lfidemo.com/",
    },
    ConsulateLA: {
      name: "Consulate LA",
      icon: <img 
        src="/images/ashok_chakra.png" 
        alt="ashok chakra" 
        style={{ 
          width: '60px', 
          height: '50px',
          objectFit: 'contain'
        }} 
      />,
      path: "https://consulate-la.lfidemo.com/",
    },
    CreditRisk: {
      name: "CreditRisk",
      icon: <FaBalanceScale size={32} color="#dc3545" />,
      path: "https://creditrisk.lfidemo.com",
    },
     Smart_KPI_Monitoring: {
      name: "Smart KPI Monitoring",
      icon: <FaGlobe size={32} color="#dc3545" />,
      path: "https://kpi.lfidemo.com",
    },
    Digital_Twin: {
      name: "Digital Twin",
      icon: <FaCube size={32} color="#20c997" />,
      path: "https://uks.lfiai.com/",
    },
    Underwriting_optimisation: {
      name: "Underwriting optimisation & pricing segmentation",
      icon: <AiOutlineDollarCircle size={32} color="#dc3545" />,
      path: "https://underwriting.lfidemo.com",
    },
    Demand_Forecasting: {
      name: "Demand Forecasting",
      icon: <AiOutlineLineChart size={32} color="#dc3545" />,
      path: "https://forecasting.lfidemo.com/",
    },
    Inventory_optimization: {
      name: "Inventory optimization",
      icon: <AiOutlineDatabase size={32} color="#dc3545" />,
      path: "https://forecasting.lfidemo.com",
    },
    Claims_CLV_Underwriting: {
      name: "Claims + CLV + Underwriting",
      icon: <FaShieldAlt size={32} color="#dc3545" />,
      path: "https://insuranceplatform.lfidemo.com",
    },
    Energy_Equipment_Failure: {
      name: "Energy Equipment Failure and Predictive Maintenance",
      icon: <FaBolt size={32} color="#ffc107" />,
      path: "https://equipment.lfidemo.com",
    },
    Customer_Behaviour_Analytics: {
      name: "360 Customer Behaviour Analytics",
      icon: <FaChartBar size={32} color="#ffc107" />,
      path: "https://customeranalytics.lfidemo.com",
    },
    Banking_Claims_Fraud: {
      name: "Banking Claims Fraud Detection",
      icon: <FaShieldAlt size={32} color="#dc3545" />,
      path: "https://bankingclaimsfraud.lfidemo.com",
    },
     NBO: {
      name: "NBO",
      icon: <FaChartLine size={32} color="#28a745" />,
      path: "https://bankingtelcorevenuenbo.lfidemo.com",
    },
    CLV_Analytics_BankingTelecom: {
      name: "CLV Analytics (Banking+Telecom)",
      icon: <FaChartLine size={32} color="#17a2b8" />,
      path: "https://clvbankingtelecom.lfidemo.com",
    },
    CLV_Analytics: {
      name: "CLV Analytics",
      icon: <FaUmbrella size={32} color="#6f42c1" />,
      path: "https://clvinsurance.lfidemo.com",
    },
    Banking_Sentiment_Analysis: {
      name: "Sentiment Analysis",
      icon: <FaMagnifyingGlassChart size={32} color="#6f42c1" />,
      path: "https://bankingsentimentanalysis.lfidemo.com/",
    },
    // Streamlit: {
    //   name: "Streamlit",
    //   icon: <FaChromecast size={32} color="#6f42c1" />,
    //   path: "https://telecomnbodataaddon.lfidemo.com/",
    // },
    Streamlit: {
      name: "NBO Data Recommendation Engine",
      icon: <FaBrain size={32} color="#28a745" />,
      path: "https://telecomnbodataaddon.lfidemo.com/",
    },
    Lapse_Prediction_Retention_Analytics: {
      name: "Lapse Prediction and Retention Analytics",
      icon: <FaUserShield size={32} color="#17a2b8" />,
      path: "https://insurancelapseprediction.lfidemo.com/",
    },
    Risk_Score_Prediction: {
      name: "Risk Score Prediction",
      icon: <FaTachometerAlt size={32} color="#fd7e14" />,
      path: "https://insuranceriskscore.lfidemo.com/",
    },
    Signature_Fraud_Detection: {
      name: "Signature Fraud Detection",
      icon: <FaFileSignature size={32} color="#dc3545" />,
      path: "https://signaturefrauddetect.lfidemo.com/",
    },
    Network_Fraud_Detection: {
      name: "Network Fraud Detection",
      icon: <FaProjectDiagram size={32} color="#dc3545" />,
      path: "https://networkfrauddetect.lfidemo.com/",
    },
    SEO: {
      name: "Digital Growth Intelligence",
      icon: <FaMagnifyingGlassChart size={32} color="#6f42c1" />,
      path: "https://seo.lfidemo.com/",
    },
  };

  // Category to apps mapping
  const categoryApps = {
    insurance: ["claims_detection","Risk_Score_Prediction","Digital_Twin","Underwriting_optimisation","Claims_CLV_Underwriting","CLV_Analytics", "Lapse_Prediction_Retention_Analytics"],
    retail: ["Demand_Forecasting","Inventory_optimization"],
    hospitals: [],
    security: [],
    manufacturing: ["Demand_Forecasting","Inventory_optimization"],
    energy: ["Energy_Equipment_Failure"],
    agriculture: [],
    sports: [],
    media: [],
    hr: [],
    general: ["FinSight", "Engage360", "EduPilot","TextIQ", "vajraX", "ConsulateSA", "ConsulateLA", "InternalPortal", "SEO"],
    banking: ["Customer_Behaviour_Analytics","Banking_Claims_Fraud","NBO","CLV_Analytics_BankingTelecom","BankingAnalytics","BankingTelecomAnalytics","CreditRisk","Digital_Twin","Banking_Sentiment_Analysis", "Streamlit"],
    telecom: ["TelecomAnalytics", "BankingTelecomAnalytics1","Smart_KPI_Monitoring","CLV_Analytics_BankingTelecom","Digital_Twin", "Streamlit"],
    education: [],
    machineLearning: ["TelecomAnalytics","BankingAnalytics","BankingTelecomAnalytics1","CreditRisk","Smart_KPI_Monitoring","Underwriting_optimisation","Demand_Forecasting","Inventory_optimization","Claims_CLV_Underwriting"],
    computerVision: [],
    genAI: ["FinSight", "Engage360", "EduPilot","TextIQ", "vajraX", "ConsulateSA", "ConsulateLA", "InternalPortal", "SEO"],
    advancedAnalytics: ["Digital_Twin"],
    southAfrica: ["TelecomAnalytics"],
    southKorea: [],
    others: ["CybersecurityLMS","BankingAnalytics","BankingTelecomAnalytics","Claims_CLV_Underwriting"],
  };

  const handleCardClick = (category) => {
    setSelectedCard(selectedCard === category ? null : category);
    setSelectedCategory(null);
    setSelectedSubGroup(null);
  };

  const handleCategoryClick = (category, e) => {
    e.stopPropagation();
    const next = selectedCategory === category ? null : category;
    setSelectedCategory(next);
    setSelectedSubGroup(null);
  };

  const handleAppClick = (app, e) => {
    e.stopPropagation();
    window.open(app.path, "_blank", "noopener,noreferrer");
  };

  // Parent categories
  const categories = {
    Industries: {
      icon: <FaIndustry size={40} color="#007bff" />,
      items: [
        { name: "Agriculture", icon: <FaTractor size={32} color="#28a745" />, id: "agriculture", onClick: handleCategoryClick },
        { name: "Energy", icon: <FaBolt size={32} color="#ffc107" />, id: "energy", onClick: handleCategoryClick },
        { name: "Manufacturing", icon: <FaIndustry size={32} color="#17a2b8" />, id: "manufacturing", onClick: handleCategoryClick },
        { name: "Security", icon: <FaShieldAlt size={32} color="#6f42c1" />, id: "security", onClick: handleCategoryClick },
        { name: "Retail", icon: <FaShoppingCart size={32} color="#fd7e14" />, id: "retail", onClick: handleCategoryClick },
        { name: "Hospitals", icon: <FaHospital size={32} color="#dc3545" />, id: "hospitals", onClick: handleCategoryClick },
        // { name: "Sports", icon: <FaFootballBall size={32} color="#20c997" />, id: "sports", onClick: handleCategoryClick },
        { name: "Media", icon: <FaPhotoVideo size={32} color="#e83e8c" />, id: "media", onClick: handleCategoryClick },
        { name: "HR", icon: <FaUserTie size={32} color="#007bff" />, id: "hr", onClick: handleCategoryClick },
        { name: "General", icon: <FaGlobe size={32} color="#6c757d" />, id: "general", onClick: handleCategoryClick },
        { name: "Insurance", icon: <FaUmbrella size={32} color="#ff5733" />, id: "insurance", onClick: handleCategoryClick },
        { name: "Banking", icon: <RiBankLine size={32} color="#28a745" />, id: "banking", onClick: handleCategoryClick },
        { name: "Telecom", icon: <FaPhone size={32} color="#20c997" />, id: "telecom", onClick: handleCategoryClick },
        // { name: "Education", icon: <FaGraduationCap size={32} color="#6f42c1" />, id: "education", onClick: handleCategoryClick },
      ],
    },
    Technologies: {
      icon: <FaLaptopCode size={40} color="#6610f2" />,
      items: [
        { name: "Machine Learning", icon: <FaBrain size={32} color="#e83e8c" />, id: "machineLearning", onClick: handleCategoryClick },
        { name: "Computer Vision", icon: <FaEye size={32} color="#0dcaf0" />, id: "computerVision", onClick: handleCategoryClick },
        { name: "GenAI", icon: <FaRobot size={32} color="#6f42c1" />, id: "genAI", onClick: handleCategoryClick },
        { name: "Advanced Analytics", icon: <FaChartBar size={32} color="#198754" />, id: "advancedAnalytics", onClick: handleCategoryClick },
      ],
    },
    Regions: {
      icon: <FaGlobeAfrica size={40} color="#198754" />,
      items: [
        { name: "South Africa", icon: <FaFlag size={32} color="#007bff" />, id: "southAfrica", onClick: handleCategoryClick },
        { name: "South Korea", icon: <FaFlag size={32} color="#ff0000" />, id: "southKorea", onClick: handleCategoryClick },
        { name: "Others", icon: <FaFlag size={32} color="#28a745" />, id: "others", onClick: handleCategoryClick },
      ],
    },
  };

  // Render app card
  const renderAppCard = (appKey) => {
    const app = apps[appKey];
    return (
      <div
        key={appKey}
        className="card shadow-sm text-center p-2 mb-2 app-card"
        style={{ cursor: "pointer" }}
        onClick={(e) => handleAppClick(app, e)}
      >
        <div className="d-flex align-items-center justify-content-start flex-wrap">
          <div className="me-2">
            {React.cloneElement(app.icon, {
              size: window.innerWidth < 576 ? 20 : 32
            })}
          </div>
          <span style={{ fontSize: 'clamp(0.7rem, 2.5vw, 0.9rem)', wordBreak: 'break-word' }}>
            {app.name}
          </span>
        </div>
      </div>
    );
  };

  // Render apps for a category
  // const renderCategoryApps = (category) => (
  //   <div className="mt-2">
  //     {categoryApps[category]?.map((appKey) => renderAppCard(appKey))}
  //   </div>
  // );

  const [selectedSubGroup, setSelectedSubGroup] = useState(null);

  const generalProductApps = ["FinSight", "Engage360", "EduPilot", "TextIQ", "vajraX", "InternalPortal", "SEO"];
  const generalPocApps = ["ConsulateSA", "ConsulateLA"];

  const insuranceFraudApps = ["claims_detection", "Signature_Fraud_Detection", "Network_Fraud_Detection"];
  const insuranceOtherApps = categoryApps.insurance.filter(
    (appKey) => !insuranceFraudApps.includes(appKey)
  );

  const bankingFraudApps = ["Banking_Claims_Fraud", "Signature_Fraud_Detection"];
  const bankingOtherApps = categoryApps.banking.filter(
    (appKey) => !bankingFraudApps.includes(appKey)
  );

  // Categories that render an expandable sub-group panel instead of a flat app list
  const panelCategories = ["general", "insurance", "banking"];
  const isPanelCategory = (category) => panelCategories.includes(category);

  const renderCategoryApps = (category) => {
    if (isPanelCategory(category)) return null;
    return (
      <div className="mt-2">
        {categoryApps[category]?.map((appKey) => renderAppCard(appKey))}
      </div>
    );
  };

  const renderGeneralAppRow = (appKey) => {
    const app = apps[appKey];
    return (
      <div
        key={appKey}
        onClick={(e) => handleAppClick(app, e)}
        className="d-flex align-items-center"
        style={{
          cursor: "pointer",
          padding: "8px 10px",
          marginTop: "6px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          transition: "background 0.15s, border-color 0.15s",
          gap: "10px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#f8fafc";
          e.currentTarget.style.borderColor = "#0d6efd";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#ffffff";
          e.currentTarget.style.borderColor = "#e5e7eb";
        }}
      >
        <div
          className="d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ width: "32px", height: "32px" }}
        >
          {React.cloneElement(app.icon, app.icon.type === "img"
            ? { style: appKey === "InternalPortal"
                ? { ...(app.icon.props.style || {}) }
                : { ...(app.icon.props.style || {}), width: "28px", height: "28px" } }
            : { size: 22 })}
        </div>
        <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#1f2937", textAlign: "left" }}>
          {app.name}
        </span>
      </div>
    );
  };

  const renderGeneralRow = (key, label, list) => {
    const isActive = selectedSubGroup === key;
    return (
      <div style={{ position: "relative" }}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            setSelectedSubGroup(isActive ? null : key);
          }}
          className="d-flex align-items-center justify-content-between"
          style={{
            cursor: "pointer",
            padding: "10px 12px",
            borderRadius: "8px",
            border: isActive ? "1.5px solid #0d6efd" : "1px solid #e5e7eb",
            background: isActive ? "#eaf2ff" : "#ffffff",
            color: isActive ? "#0d6efd" : "#1f2937",
            fontWeight: 600,
            transition: "background 0.2s, border-color 0.2s, color 0.2s",
          }}
        >
          <span style={{ fontSize: "0.9rem" }}>{label}</span>
          <span
            style={{
              display: "inline-block",
              transition: "transform 0.2s",
              fontSize: "1rem",
              lineHeight: 1,
            }}
          >
            &rsaquo;
          </span>
        </div>
        {isActive && (
          <div
            className="d-none d-md-block"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: 0,
              left: "calc(100% + 12px)",
              width: "100%",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "10px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              zIndex: 30,
            }}
          >
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                padding: "2px 4px 8px",
              }}
            >
              {label}
            </div>
            {list.map((appKey) => renderGeneralAppRow(appKey))}
          </div>
        )}
        {isActive && (
          <div className="d-md-none mt-1">
            {list.map((appKey) => renderGeneralAppRow(appKey))}
          </div>
        )}
      </div>
    );
  };

  const renderPanel = (category) => {
    const panelStyle = {
      background: "#ffffff",
      borderTop: "none",
      borderRadius: "0 0 8px 8px",
      border: "1px solid rgba(0,0,0,0.125)",
      borderTopWidth: 0,
      marginTop: "-1px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
      position: "relative",
      zIndex: 20,
    };

    if (category === "insurance") {
      return (
        <div className="p-2" style={panelStyle} onClick={(e) => e.stopPropagation()}>
          <div className="mb-2">
            {renderGeneralRow("insuranceFraud", "Fraud Detection", insuranceFraudApps)}
          </div>
          {insuranceOtherApps.map((appKey) => renderAppCard(appKey))}
        </div>
      );
    }

    if (category === "banking") {
      return (
        <div className="p-2" style={panelStyle} onClick={(e) => e.stopPropagation()}>
          <div className="mb-2">
            {renderGeneralRow("bankingFraud", "Fraud Detection", bankingFraudApps)}
          </div>
          {bankingOtherApps.map((appKey) => renderAppCard(appKey))}
        </div>
      );
    }

    return (
      <div className="p-2" style={panelStyle} onClick={(e) => e.stopPropagation()}>
        <div className="mb-2">{renderGeneralRow("products", "Products", generalProductApps)}</div>
        <div>{renderGeneralRow("pocs", "POCs", generalPocApps)}</div>
      </div>
    );
  };

  return (
    <div
      className="min-vh-100"
      style={{
        background: "#a0c4ff",
        padding: "0.25rem 0 2rem 0",
      }}
    >
      <div className="container px-3 px-md-4">
        <div className="text-center mb-3 mb-md-4">
          <img
            src="/logo_new.png"
            alt="Linkfields Logo"
            className="img-fluid"
            style={{
              height: "auto",
              maxHeight: "120px",
              width: "auto",
              maxWidth: "100%",
              display: "block",
              marginBottom: "10px",
              marginLeft: "auto",
              marginRight: "0",
            }}
          />
          <h2
            className="h3 h2-md"
            style={{
              marginTop: '-30px',
              fontSize: 'clamp(1.25rem, 4vw, 1.75rem)'
            }}
          >
            Project Catalogue
          </h2>
        </div>

        <div className="row justify-content-center g-2 g-md-3">
          {Object.keys(categories).map((category) => (
            <div className="col-6 col-sm-4 col-md-3 col-lg-3 mb-2 mb-md-3" key={category}>
              <div
                className={`card shadow-sm text-center p-2 p-md-3 h-100 ${
                  selectedCard === category
                    ? "border-primary"
                    : selectedCard
                    ? "opacity-50"
                    : ""
                }`}
                style={{ cursor: "pointer", transition: "0.3s" }}
                onClick={() => handleCardClick(category)}
              >
                <div className="mb-1 mb-md-2">
                  {React.cloneElement(categories[category].icon, {
                    size: window.innerWidth < 576 ? 28 : 40
                  })}
                </div>
                <h5 className="card-title mb-0" style={{ fontSize: 'clamp(0.85rem, 3vw, 1.25rem)' }}>
                  {category}
                </h5>
              </div>
            </div>
          ))}
        </div>

        {selectedCard && (
          <div className="mt-3 mt-md-5">
            <h4 className="mb-3 mb-md-4 text-center" style={{ fontSize: 'clamp(1rem, 3.5vw, 1.5rem)' }}>
              {selectedCard}
            </h4>
            <div className="row justify-content-center g-2 g-md-3">
              {categories[selectedCard].items.map((item, idx) => {
                const isPanelOpen = isPanelCategory(item.id) && selectedCategory === item.id;
                return (
                  <div
                    className="col-6 col-sm-4 col-md-3 col-lg-3 mb-2 mb-md-3"
                    key={idx}
                    style={isPanelOpen ? { alignSelf: "flex-start" } : {}}
                  >
                    <div
                      className={`card shadow-sm text-center p-2 p-md-3 ${
                        selectedCategory === item.id ? "border-primary" : ""
                      }`}
                      style={{
                        cursor: "pointer",
                        transition: "0.2s",
                        ...(isPanelOpen ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : {}),
                      }}
                      onClick={(e) => item.onClick?.(item.id, e)}
                    >
                      <div className="mb-1 mb-md-2">
                        {React.cloneElement(item.icon, {
                          size: window.innerWidth < 576 ? 24 : 32
                        })}
                      </div>
                      <h6 className="card-title mb-0" style={{ fontSize: 'clamp(0.75rem, 2.5vw, 1rem)' }}>
                        {item.name}
                      </h6>
                      {selectedCategory === item.id && !isPanelCategory(item.id) &&
                        renderCategoryApps(item.id)}
                    </div>
                    {isPanelOpen && renderPanel(item.id)}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
