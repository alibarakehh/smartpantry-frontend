import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import "./../css/pantry.css";

const PantryPage = () => {
  const API_BASE = process.env.REACT_APP_API_BASE || "https://localhost:7253/api";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detectedProductId, setDetectedProductId] = useState(null);

  // Image upload & capture states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [useWebcam, setUseWebcam] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const webcamRef = useRef(null);

  // Detection & form
  const [detectedName, setDetectedName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [expiryDate, setExpiryDate] = useState("");

  // --- RECOMMENDED RECIPES HOOKS ---
const [recommendedRecipes, setRecommendedRecipes] = useState([]);
const [loadingRecipes, setLoadingRecipes] = useState(false);
const [selectedRecipe, setSelectedRecipe] = useState(null);
const [showRecipeModal, setShowRecipeModal] = useState(false);

const [openRecipeId, setOpenRecipeId] = useState(null);



const handleRecipeClick = async (recipe) => {
  try {
    // Fetch full recipe details from your backend
    const res = await axios.get(`${API_BASE}/Recipes/${recipe.recipeId}`);
    setSelectedRecipe(res.data);
    setShowRecipeModal(true);
  } catch {
    setSelectedRecipe(null);
    setShowRecipeModal(false);
  }
};



const fetchRecommendedRecipes = useCallback(async () => {
  setLoadingRecipes(true);
  try {
    const res = await axios.get(`${API_BASE}/RecommendedRecipes`);
    let data = res.data;
    if (!Array.isArray(data) && data?.$values) data = data.$values;
    // Deduplicate by recipeId
    // Deduplicate by name and servings
const seen = new Set();
const unique = (Array.isArray(data) ? data : []).filter((r) => {
  const key = (r.name || '').toLowerCase() + '-' + (r.servings || '');
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});
setRecommendedRecipes(unique);

  } catch (err) {
    setRecommendedRecipes([]);
  }
  setLoadingRecipes(false);
}, [API_BASE]);


useEffect(() => {
  fetchRecommendedRecipes();
}, [fetchRecommendedRecipes, products]); // re-fetch when pantry changes


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
  setExpiryDate(new Date().toISOString().split("T")[0]); // Pre-fill with today in "YYYY-MM-DD" format
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

  // Convert dataURL to Blob
  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };

  // Detect product and save detected name
  const detectProductAndSaveName = async (file) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      // Call your backend DetectProduct endpoint
      const response = await axios.post(`${API_BASE}/DetectProduct`, formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

      const data = response.data;
      setDetectedName(data.label || "");
      setLoading(false);
      setDetectedProductId(data.productId || null); // <-- Add this
    } catch (error) {
      setError("Failed to detect product.");
      setLoading(false);
    }
  };

  // Handle file input change (upload)
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      detectProductAndSaveName(file);
    }
  };

  // Capture photo from webcam
  const capturePhoto = () => {
    if (!webcamRef.current) return;
    const image = webcamRef.current.getScreenshot();
    if (image) {
      setImageSrc(image);
      const file = new File([dataURLtoBlob(image)], "capture.jpg", { type: "image/jpeg" });
      detectProductAndSaveName(file);
    }
  };

  

  
// const saveProduct = async () => {
//   if (!detectedName || !detectedProductId) {
//     setError("No detected product to save.");
//     return;
//   }
//   setLoading(true);
//   setError(null);

//   try {
//     const availableProduct = {
//       productId: detectedProductId,
//       quantity: quantity,
//       purchasingTime: new Date().toISOString(),
//       expiryDate: expiryDate ? expiryDate : null,
//       originalUnit: null
//     };
//     console.log("Saving available product with productId:", detectedProductId);

//     await axios.post(`${API_BASE}/AvailableProducts`, availableProduct);

//     setLoading(false);
//     closeDialog();
//     fetchPantry();
//   } catch (error) {
//     setError("Failed to save product.");
//     setLoading(false);
//   }
// };
const saveProduct = async () => {
  if (!detectedName || !detectedProductId) {
    setError("No detected product to save.");
    return;
  }
  setLoading(true);
  setError(null);

  const availableProduct = {
    productId: detectedProductId,
    quantity: quantity,
    purchasingTime: new Date().toISOString(),
    expiryDate: expiryDate ? expiryDate : null,
    originalUnit: null
  };
  console.log("Sending availableProduct:", availableProduct);

  try {
    await axios.post(`${API_BASE}/AvailableProducts`, availableProduct);
    setLoading(false);
    closeDialog();
    fetchPantry();
  } catch (error) {
    setError("Failed to save product.");
    setLoading(false);
  }
};


  // Filter products by expiry status
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

      <div className="recommended-recipes-card">
  <h2 className="rec-title">
    <span role="img" aria-label="chef">👩‍🍳</span> Recommended Recipes
  </h2>
  {loadingRecipes ? (
    <div className="rec-loading">
      <div className="rec-spinner" />
      <span>Looking for recipes…</span>
    </div>
  ) : recommendedRecipes.length === 0 ? (
    <div className="rec-empty">
      <span role="img" aria-label="no recipe">🥲</span>
      <span>No recipes can be made with your current pantry items.</span>
    </div>
  ) : (
    <ul className="rec-list">
  {recommendedRecipes.map((recipe) => (
    <li className="rec-item"
        key={recipe.recipeId}
        tabIndex={0}
        onClick={() => handleRecipeClick(recipe)}
        style={{cursor: "pointer"}}
        role="button"
        aria-pressed="false"
    >
      <div className="rec-item-header">
        <span className="rec-name">{recipe.name}</span>
        <span className="rec-servings">{recipe.servings ? `Serves: ${recipe.servings}` : ""}</span>
      </div>
      {/* No ingredients here! */}
    </li>
  ))}
</ul>

  )}

  {/* --- Recipe Details Modal --- */}
  {showRecipeModal && selectedRecipe && (
    <div className="recipe-modal-backdrop" onClick={() => setShowRecipeModal(false)}>
      <div className="recipe-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={() => setShowRecipeModal(false)}>×</button>
        <h2>{selectedRecipe.name}</h2>
        <p className="desc">{selectedRecipe.description}</p>
        <div className="modal-meta">
          <span><b>Cooking time:</b> {selectedRecipe.cookingTime} min</span>
          <span><b>Servings:</b> {selectedRecipe.servings}</span>
          <span><b>Origin:</b> {selectedRecipe.origin}</span>
        </div>
        <div className="ingredients-list">
          <h3>Ingredients</h3>
          <ul>
            {(selectedRecipe.productRecipes?.$values || selectedRecipe.productRecipes || []).map((pr, i) =>
              pr && pr.product ? (
                <li key={i}>
                  {pr.product.name}: {pr.quantityRequired} {pr.originalUnit || ""}
                </li>
              ) : null
            )}
          </ul>
        </div>
      </div>
    </div>
  )}
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
