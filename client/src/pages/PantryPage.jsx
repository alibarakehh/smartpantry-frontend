import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import "./../css/pantry.css";

const PantryPage = () => {
  const API_BASE = process.env.REACT_APP_API_BASE || "https://localhost:7253/api";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Image upload & capture states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [useWebcam, setUseWebcam] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const webcamRef = useRef(null);

  // Detection & form
  const [detectedName, setDetectedName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [expiryDate, setExpiryDate] = useState("");

  // Filter expiry (all, soon, expired)
  const [filterExpiry, setFilterExpiry] = useState("all");

  // Fetch pantry data
  const fetchPantry = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/AvailableProducts`);
      let data = res.data;
      if (!Array.isArray(data) && data?.$values) data = data.$values;
      setProducts(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("Failed to load pantry.");
      setProducts([]);
    }
    setLoading(false);
  }, [API_BASE]);

  useEffect(() => {
    fetchPantry();
  }, [fetchPantry]);

  // Helpers for expiry status
  const isExpiringSoon = (dateStr) => {
    if (!dateStr) return false;
    const now = new Date();
    const expiry = new Date(dateStr);
    const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays <= 3;
  };
  const isExpired = (dateStr) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  };

  // Open dialog to add product
  const openDialog = () => {
    setIsDialogOpen(true);
    setUseWebcam(false);
    setImageSrc(null);
    setDetectedName("");
    setQuantity(1);
    setExpiryDate("");
    setError(null);
  };

  // Close dialog & reset
  const closeDialog = () => {
    setIsDialogOpen(false);
    setImageSrc(null);
    setDetectedName("");
    setQuantity(1);
    setExpiryDate("");
    setError(null);
  };

  // Handle file input change (upload)
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      simulateDetection();
    }
  };

  // Capture photo from webcam
  const capturePhoto = () => {
    if (!webcamRef.current) return;
    const image = webcamRef.current.getScreenshot();
    if (image) {
      setImageSrc(image);
      simulateDetection();
    }
  };

  // Mock ML detection - replace with real ML call later
  const simulateDetection = () => {
    setDetectedName("");
    setLoading(true);
    setTimeout(() => {
      setDetectedName("Milk");
      setLoading(false);
    }, 1500);
  };

  // Save detected product
  const saveProduct = async () => {
    if (!detectedName) return;
    setLoading(true);
    setError(null);
    try {
      // Create product or get existing
      let productId;
      try {
        const res = await axios.post(`${API_BASE}/Products`, {
          name: detectedName,
        });
        productId = res.data.productId;
      } catch (e) {
        if (e.response?.status === 409) {
          const all = await axios.get(`${API_BASE}/Products`);
          const existing = all.data.find(
            (p) => p.name.toLowerCase() === detectedName.toLowerCase()
          );
          productId = existing?.productId;
        } else {
          throw e;
        }
      }

      // Add AvailableProduct
      await axios.post(`${API_BASE}/AvailableProducts`, {
        productId,
        quantity,
        expiryDate: expiryDate || null,
      });

      closeDialog();
      fetchPantry();
    } catch (e) {
      setError("Failed to save product.");
    }
    setLoading(false);
  };

  // Filter products by expiry
  const filteredProducts = products.filter((p) => {
    if (filterExpiry === "all") return true;
    if (filterExpiry === "soon") return isExpiringSoon(p.expiryDate);
    if (filterExpiry === "expired") return isExpired(p.expiryDate);
    return true;
  });

  return (
    <div className="pantry-container">
      <h1 className="pantry-title">Smart Pantry</h1>

      <div className="toolbar">
        <button className="btn primary" onClick={openDialog}>
          + Add Product (Upload or Camera)
        </button>

        <select
          className="filter-select"
          value={filterExpiry}
          onChange={(e) => setFilterExpiry(e.target.value)}
          aria-label="Filter products by expiry"
        >
          <option value="all">All Products</option>
          <option value="soon">Expiring Soon (&lt;= 3 days)</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <table className="pantry-table" aria-label="Available products">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Expiry Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="4" className="loading-cell">
                Loading products…
              </td>
            </tr>
          )}
          {!loading && filteredProducts.length === 0 && (
            <tr>
              <td colSpan="4" className="loading-cell">
                No products found.
              </td>
            </tr>
          )}
          {!loading &&
            filteredProducts.map((p) => (
              <tr key={p.availableProductId}>
                <td>{p.product?.name || "Unknown"}</td>
                <td>{p.quantity}</td>
                <td>{p.expiryDate ? p.expiryDate.split("T")[0] : "N/A"}</td>
                <td>
                  {isExpired(p.expiryDate) ? (
                    <span className="status expired">Expired</span>
                  ) : isExpiringSoon(p.expiryDate) ? (
                    <span className="status soon">Expiring Soon</span>
                  ) : (
                    <span className="status ok">OK</span>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Dialog */}
      {isDialogOpen && (
        <div
          className="dialog-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialogTitle"
          tabIndex="-1"
          onClick={closeDialog}
        >
          <div
            className="dialog-content"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="dialogTitle">Add Product Image</h2>

            {!imageSrc && (
              <>
                <label htmlFor="uploadInput" className="upload-label">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    id="uploadInput"
                    onChange={onFileChange}
                    hidden
                  />
                </label>

                <button
                  className="btn secondary"
                  onClick={() => setUseWebcam((prev) => !prev)}
                  aria-pressed={useWebcam}
                >
                  {useWebcam ? "Use Upload" : "Use Camera"}
                </button>
              </>
            )}

            {useWebcam && (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "environment" }}
                  className="webcam-video"
                />
                <button className="btn primary" onClick={capturePhoto}>
                  Capture Photo
                </button>
              </>
            )}

            {imageSrc && (
              <>
                <img src={imageSrc} alt="Captured" className="preview-img" />
                {loading ? (
                  <p className="info-text">Detecting product...</p>
                ) : detectedName ? (
                  <p className="detected-name">Detected: {detectedName}</p>
                ) : null}

                <label>
                  Quantity:
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                  />
                </label>

                <label>
                  Expiry Date:
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </label>

                {error && <p className="error-text">{error}</p>}

                <div className="dialog-buttons">
                  <button className="btn secondary" onClick={closeDialog}>
                    Cancel
                  </button>
                  <button
                    className="btn primary"
                    onClick={saveProduct}
                    disabled={!detectedName || loading}
                  >
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PantryPage;
