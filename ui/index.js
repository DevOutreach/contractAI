import React, { useState, useRef } from "react";
import StyledButton from "@integratedComponents/StyledButton";

// Generated proto files
import { AnalyzeRequest } from "./analysis_pb.js";
import { AnalysisService } from "./analysis_pb_service.js";

import "./style.css";

/**
 * Main UI component for the Legal Analysis Service
 *
 * @param {Object} props
 * @param {Object} props.serviceClient gRPC service client provided by the platform
 * @param {boolean} props.isComplete Whether the service execution is complete
 */
const ServiceUI = ({ serviceClient, isComplete }) => {
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const isAllowedToRun = () => !!text.trim();

  const onActionEnd = (response) => {
    const { message, status, statusMessage } = response;
    setLoading(false);

    console.log("gRPC Response:", response);

    if (status !== 0) {
      setOutput({ error: `Error: ${statusMessage}` });
      return;
    }

    // Store full response
    setOutput(response);
  };

  const submitAction = () => {
    if (!isAllowedToRun()) return;

    try {
      setLoading(true);
      const methodDescriptor = AnalysisService.Analyze;

      const request = new AnalyzeRequest();
      request.setUserInput(text.trim());

      console.log("Sending request:", request.toObject());

      serviceClient.unary(methodDescriptor, {
        request,
        preventCloseServiceOnEnd: false,
        onEnd: onActionEnd,
      });
    } catch (err) {
      console.error("Client error:", err);
      setOutput({ error: `Client error: ${err.message}` });
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      if (isAllowedToRun()) submitAction();
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const renderResults = (data) => {
    const responseObj = data.message;
    
    if (!responseObj || !responseObj.getResult) {
      return (
        <div className="content-box error">
          <h4 className="error-title">Error</h4>
          <p>No valid response received from the server.</p>
        </div>
      );
    }

    const result = responseObj.getResult();
    const dataMap = result?.getDataMap?.();

    if (!dataMap || dataMap.getLength() === 0) {
      return (
        <div className="content-box warning">
          <h4 className="warning-title">No Data</h4>
          <p>No analysis data available.</p>
        </div>
      );
    }

    // Convert the map to an object for easier access
    const resultObj = {};
    Array.from(dataMap.entries()).forEach(([key, value]) => {
      resultObj[key] = value;
    });

    // Parse the JSON string if it's stored as a string
    let parsedData = {};
    try {
      parsedData = resultObj.analysis ? JSON.parse(resultObj.analysis) : {};
    } catch (e) {
      console.error("Failed to parse analysis data:", e);
      parsedData = {};
    }

    // Fallback to direct map values if no parsed data
    const analysisData = Object.keys(parsedData).length > 0 ? parsedData : resultObj;

    return (
      <div className="results-grid">
        <div className="content-box topic-card">
          <h4>Topic</h4>
          <p className="result-text">{analysisData.topic || "N/A"}</p>
        </div>

        <div className="content-box summary-card">
          <h4>Summary</h4>
          <p className="result-text">{analysisData.summary || "N/A"}</p>
        </div>

        <div className="content-box differences-card">
          <h4>Differences</h4>
          <ul className="result-list">
            {analysisData.differences && analysisData.differences.length > 0 ? (
              analysisData.differences.map((diff, index) => (
                <li key={index}>{diff}</li>
              ))
            ) : analysisData.differences_string ? (
              analysisData.differences_string.split('\n').map((line, index) => (
                <li key={index}>{line}</li>
              ))
            ) : (
              <li>No differences detected</li>
            )}
          </ul>
        </div>

        <div className="content-box risk-card">
          <h4>Risk Flags</h4>
          <ul className="result-list">
            {analysisData.risk_flags && analysisData.risk_flags.length > 0 ? (
              analysisData.risk_flags.map((flag, index) => (
                <li key={index}>{flag}</li>
              ))
            ) : analysisData.risk_analysis ? (
              analysisData.risk_analysis.split('\n').map((line, index) => (
                <li key={index}>{line}</li>
              ))
            ) : (
              <li>No significant risks identified</li>
            )}
          </ul>
        </div>

        <div className="content-box neutral-card">
          <h4>Suggested Neutral Text</h4>
          <p className="result-text italic">{analysisData.suggested_neutral_text || analysisData.suggested_text || "N/A"}</p>
        </div>

        <div className="content-box fake-score-card">
          <h4>Fake Contract Analysis</h4>
          <p><strong>Score:</strong> {analysisData.fake_contract_score !== undefined ? analysisData.fake_contract_score + " / 100" : "N/A"}</p>
          <ul className="result-list">
            {analysisData.fake_contract_signals && analysisData.fake_contract_signals.length > 0 ? (
              analysisData.fake_contract_signals.map((signal, index) => (
                <li key={index}>{signal}</li>
              ))
            ) : (
              <li>No fake contract signals detected</li>
            )}
          </ul>
        </div>
      </div>
    );
  };

  const ServiceInput = () => {
    return (
      <div className="input-section">
        <div className="content-box">
          <h4>Input</h4>
          <div className="input-wrapper">
            <label className="input-label">Paste two contract clauses below</label>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyPress}
              placeholder="Clause A: ...Clause B: ..."
              rows={7}
              className="styled-textarea"
            />
          </div>
          
          <div className="action-wrapper">
            <StyledButton
              btnText={loading ? "⏳ Analyzing..." : "🔍 Analyze Clauses"}
              variant="contained"
              onClick={submitAction}
              disabled={!isAllowedToRun() || loading}
              className="analyze-button"
            />
          </div>
          
          {loading && (
            <p className="status-message">⏳ Analyzing with LegalEase AI...</p>
          )}
        </div>
      </div>
    );
  };

  const ServiceOutput = () => {
    if (!output) {
      return (
        <div className="content-box">
          <h4>Output</h4>
          <p className="waiting-text">Waiting for response...</p>
        </div>
      );
    }

    if (output.error) {
      return (
        <div className="content-box error">
          <h4 className="error-title">Error</h4>
          <p>{output.error}</p>
        </div>
      );
    }

    return (
      <div className="output-section">
        <div className="content-box">
          <h4>Analysis Results</h4>
          {renderResults(output)}
        </div>
      </div>
    );
  };

  return (
    <div className="service-container">
      <div className="service-header">
        <h1 className="main-title">⚖️ LegalEase AI</h1>
        <p className="subtitle">
          Paste two contract clauses below — the AI will analyze differences, risks, and suggest a balanced rewrite.
        </p>
      </div>

      {!isComplete ? <ServiceInput /> : <ServiceOutput />}
    </div>
  );
};

export default ServiceUI;