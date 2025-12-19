import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const PackageFeaturesManager = ({ isOpen, onClose }) => {
  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Fetch features
  const fetchFeatures = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }/api/package/features`,
        {
          credentials: 'include'
        }
      );
      const data = await response.json();

      if (data.success) {
        setFeatures(data.data);
      } else {
        setError(data.error || "Failed to fetch features");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFeatures();
    }
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Feature name is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const url = editingFeature
        ? `${
            import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
          }/api/package/features/${editingFeature._id}`
        : `${
            import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
          }/api/package/features`;

      const method = editingFeature ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(
          editingFeature
            ? "Feature updated successfully"
            : "Feature created successfully"
        );
        setFormData({ name: "", description: "" });
        setEditingFeature(null);
        setIsFormOpen(false);
        fetchFeatures();
      } else {
        setError(data.error || "Failed to save feature");
      }
    } catch (err) {
      setError("Failed to save feature");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feature?"))
      return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }/api/package/features/${id}`,
        {
          method: "DELETE",
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess("Feature deleted successfully");
        fetchFeatures();
      } else {
        setError(data.error || "Failed to delete feature");
      }
    } catch (err) {
      setError("Failed to delete feature");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (feature) => {
    setEditingFeature(feature);
    setFormData({
      name: feature.name,
      description: feature.description || "",
    });
    setIsFormOpen(true);
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            Manage Package Features
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success/Error Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-900/20 border border-green-500/50 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}

          {/* Add Feature Button */}
          {!isFormOpen && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Feature
            </button>
          )}

          {/* Add/Edit Form */}
          {isFormOpen && (
            <div className="mb-6 p-4 bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">
                {editingFeature ? "Edit Feature" : "Add New Feature"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Feature Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., Personal Training, Sauna Access"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    rows="2"
                    placeholder="Brief description of the feature"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingFeature ? "Update Feature" : "Add Feature"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingFeature(null);
                      setFormData({ name: "", description: "" });
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Features List */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white mb-3">
              Current Features ({features.length})
            </h3>

            {isLoading && features.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                <span className="ml-2 text-gray-400">Loading features...</span>
              </div>
            ) : features.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No features found. Add your first feature above.
              </div>
            ) : (
              features.map((feature) => (
                <div
                  key={feature._id}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{feature.name}</h4>
                    {feature.description && (
                      <p className="text-sm text-gray-400 mt-1">
                        {feature.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(feature)}
                      className="p-2 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(feature._id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageFeaturesManager;
