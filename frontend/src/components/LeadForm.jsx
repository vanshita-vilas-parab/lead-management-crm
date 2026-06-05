import { useState, useEffect } from "react";
import { createLead, updateLead } from "../api/leadApi";

const STATUS_OPTIONS = ["New", "Contacted", "Qualified", "Converted", "Lost"];

const EMPTY_FORM = {
  name: "", email: "", phone: "", company: "", status: "New", notes: "",
};

export default function LeadForm({ editLead, onSuccess, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If editing, pre-fill the form
  useEffect(() => {
    if (editLead) setForm(editLead);
    else setForm(EMPTY_FORM);
  }, [editLead]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError("Name and Email are required.");
      return;
    }
    setLoading(true);
    try {
      if (editLead) {
        await updateLead(editLead._id, form);
      } else {
        await createLead(form);
      }
      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        JSON.stringify(err.response?.data) || 
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // Modal backdrop
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl w-full max-w-lg animate-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="font-display text-lg font-bold text-white">
            {editLead ? "Edit Lead" : "Add New Lead"}
          </h2>
          <button onClick={onCancel}
            className="text-gray-500 hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-2.5 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Name *</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="Arjun Sharma" className="input-field" />
            </div>
            <div>
              <label className="label">Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="arjun@email.com" className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                placeholder="9876543210" className="input-field" />
            </div>
            <div>
              <label className="label">Company</label>
              <input name="company" value={form.company} onChange={handleChange}
                placeholder="TechCorp Pvt Ltd" className="input-field" />
            </div>
          </div>

          <div>
            <label className="label">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="input-field">
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} className="bg-[#1a1d27]">{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange}
              rows={3} placeholder="Add any relevant notes..." className="input-field resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? "Saving..." : editLead ? "Update Lead" : "Add Lead"}
            </button>
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}