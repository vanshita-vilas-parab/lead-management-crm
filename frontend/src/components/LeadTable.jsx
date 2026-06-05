import { deleteLead } from "../api/leadApi";

const STATUS_STYLES = {
  New:        "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Contacted:  "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Qualified:  "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Converted:  "bg-green-500/10 text-green-400 border-green-500/20",
  Lost:       "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function LeadTable({ leads, onEdit, onRefresh }) {
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete lead "${name}"? This cannot be undone.`)) return;
    try {
      await deleteLead(id);
      onRefresh();
    } catch {
      alert("Failed to delete lead.");
    }
  };

  if (leads.length === 0) {
    return (
      <div className="glass rounded-2xl p-16 text-center">
        <div className="text-4xl mb-3">📋</div>
        <p className="text-gray-400 text-sm">No leads found. Add your first lead!</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {["Name", "Email", "Phone", "Company", "Status", "Created", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {leads.map((lead, i) => (
              <tr key={lead._id}
                className="hover:bg-white/[0.02] transition-colors animate-in"
                style={{ animationDelay: `${i * 40}ms` }}>
                <td className="px-5 py-4">
                  <span className="font-medium text-white text-sm">{lead.name}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-gray-400 text-sm">{lead.email}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-gray-400 text-sm">{lead.phone || "—"}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-gray-400 text-sm">{lead.company || "—"}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[lead.status]}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-gray-500 text-xs">
                    {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(lead)}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-all">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(lead._id, lead.name)}
                      className="btn-danger">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}