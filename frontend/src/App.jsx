import { useState, useEffect, useCallback } from "react";
import { getAllLeads } from "./api/leadApi";
import Navbar from "./components/Navbar";
import LeadForm from "./components/LeadForm";
import LeadTable from "./components/LeadTable";

export default function App() {
  const [leads, setLeads]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editLead, setEditLead]     = useState(null);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState("");

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllLeads(search, statusFilter);
      setLeads(res.data.data);
    } catch {
      console.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  // Re-fetch whenever search or filter changes
  useEffect(() => {
    const delay = setTimeout(fetchLeads, 300); // debounce search
    return () => clearTimeout(delay);
  }, [fetchLeads]);

  const handleEdit = (lead) => {
    setEditLead(lead);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditLead(null);
    fetchLeads();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditLead(null);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-1">
            Lead Management
          </h1>
          <p className="text-gray-500 text-sm">
            Track and manage your sales pipeline
          </p>
        </div>

        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, email, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field sm:w-44">
            <option value="" className="bg-[#1a1d27]">All Statuses</option>
            {["New","Contacted","Qualified","Converted","Lost"].map((s) => (
              <option key={s} value={s} className="bg-[#1a1d27]">{s}</option>
            ))}
          </select>

          {/* Add Lead Button */}
          <button onClick={() => setShowForm(true)} className="btn-primary whitespace-nowrap">
            + Add Lead
          </button>
        </div>

        {/* Lead Count */}
        <p className="text-xs text-gray-600 mb-4">
          {loading ? "Loading..." : `${leads.length} lead${leads.length !== 1 ? "s" : ""} found`}
        </p>

        {/* Table */}
        {loading ? (
          <div className="glass rounded-2xl p-16 text-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading leads...</p>
          </div>
        ) : (
          <LeadTable leads={leads} onEdit={handleEdit} onRefresh={fetchLeads} />
        )}
      </main>

      {/* Modal */}
      {showForm && (
        <LeadForm
          editLead={editLead}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
}