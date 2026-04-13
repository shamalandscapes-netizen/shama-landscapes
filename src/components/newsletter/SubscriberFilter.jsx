"use client";

import { useState, useMemo } from "react";
import { 
  Users, 
  Filter, 
  Mail, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Tag,
  Search,
  ChevronDown,
  ChevronUp,
  PieChart,
  TrendingUp,
  UserCheck,
  UserX
} from "lucide-react";

const CATEGORIES = [
  { id: "sustainable-design", label: "Sustainable Design", color: "#0F7F40" },
  { id: "indigenous-plants", label: "Indigenous Plants", color: "#BD7563" },
  { id: "urban-planning", label: "Urban Planning", color: "#3596D5" },
  { id: "garden-maintenance", label: "Garden Maintenance", color: "#E9C46A" },
  { id: "commercial-landscaping", label: "Commercial Landscaping", color: "#264653" },
  { id: "residential-design", label: "Residential Design", color: "#BD7563" },
  { id: "water-conservation", label: "Water Conservation", color: "#3596D5" },
  { id: "soil-health", label: "Soil Health", color: "#0F7F40" },
];

const STATUSES = [
  { id: "active", label: "Active", icon: CheckCircle, color: "#0F7F40", description: "Receiving newsletters" },
  { id: "unsubscribed", label: "Unsubscribed", icon: XCircle, color: "#BD7563", description: "Opted out" },
  { id: "bounced", label: "Bounced", icon: AlertCircle, color: "#DC2626", description: "Delivery failed" },
];

export default function SubscriberFilter({ 
  subscribers, 
  filters, 
  onFilterChange,
  onPreviewAudience 
}) {
  const [expanded, setExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSubscriberList, setShowSubscriberList] = useState(false);

  // Calculate stats
  const stats = useMemo(() => {
    const total = subscribers.length;
    const byStatus = {};
    const byCategory = {};
    
    STATUSES.forEach(s => byStatus[s.id] = 0);
    CATEGORIES.forEach(c => byCategory[c.id] = 0);

    subscribers.forEach(sub => {
      // Count by status
      const status = sub.status || "active";
      byStatus[status] = (byStatus[status] || 0) + 1;

      // Count by category (subscribers can have multiple interests)
      if (sub.categoryInterest?.length) {
        sub.categoryInterest.forEach(cat => {
          byCategory[cat] = (byCategory[cat] || 0) + 1;
        });
      }
    });

    // Calculate filtered count based on current filters
    const filtered = subscribers.filter(sub => {
      if (filters.status !== "all" && sub.status !== filters.status) return false;
      if (filters.category !== "all" && !sub.categoryInterest?.includes(filters.category)) return false;
      return true;
    });

    return { total, byStatus, byCategory, filtered: filtered.length };
  }, [subscribers, filters]);

  // Get filtered subscribers for preview
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter(sub => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          sub.email?.toLowerCase().includes(query) ||
          sub.name?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (filters.status !== "all" && sub.status !== filters.status) return false;
      if (filters.category !== "all" && !sub.categoryInterest?.includes(filters.category)) return false;
      return true;
    });
  }, [subscribers, filters, searchQuery]);

  // Toggle category selection
  const toggleCategory = (catId) => {
    onFilterChange({
      ...filters,
      category: filters.category === catId ? "all" : catId
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#264653] flex items-center justify-center">
              <Users className="w-5 h-5 text-[#E9C46A]" />
            </div>
            <div>
              <h3 className="font-bold text-[#264653] text-lg">Audience</h3>
              <p className="text-sm text-gray-500">
                <span className="font-bold text-[#E9C46A]">{stats.filtered.toLocaleString()}</span> subscribers will receive this newsletter
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-200">
          {/* Quick Stats Row */}
          <div className="grid grid-cols-3 border-b border-gray-200">
            <div className="p-4 text-center border-r border-gray-200">
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                <UserCheck className="w-3 h-3" />
                Active
              </div>
              <div className="text-2xl font-black text-shama-green">
                {stats.byStatus.active || 0}
              </div>
            </div>
            <div className="p-4 text-center border-r border-gray-200">
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                <UserX className="w-3 h-3" />
                Inactive
              </div>
              <div className="text-2xl font-black text-shama-terra">
                {(stats.byStatus.unsubscribed || 0) + (stats.byStatus.bounced || 0)}
              </div>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                <PieChart className="w-3 h-3" />
                Total
              </div>
              <div className="text-2xl font-black text-[#264653]">
                {stats.total}
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="p-6 border-b border-gray-200">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              <Filter className="w-3 h-3" />
              Subscriber Status
            </label>
            <div className="space-y-2">
              <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                filters.status === "all" 
                  ? "border-[#264653] bg-[#264653]/5" 
                  : "border-gray-200 hover:border-[#264653]/30"
              }`}>
                <input
                  type="radio"
                  name="status"
                  value="all"
                  checked={filters.status === "all"}
                  onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
                  className="sr-only"
                />
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  {filters.status === "all" && <div className="w-2.5 h-2.5 rounded-full bg-[#264653]" />}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[#264653]">All Subscribers</div>
                  <div className="text-xs text-gray-500">{stats.total} total</div>
                </div>
                <Users className="w-4 h-4 text-gray-400" />
              </label>

              {STATUSES.map(status => (
                <label 
                  key={status.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    filters.status === status.id 
                      ? "border-[#264653] bg-[#264653]/5" 
                      : "border-gray-200 hover:border-[#264653]/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={status.id}
                    checked={filters.status === status.id}
                    onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
                    className="sr-only"
                  />
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    {filters.status === status.id && <div className="w-2.5 h-2.5 rounded-full bg-[#264653]" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-[#264653] flex items-center gap-2">
                      <status.icon className="w-4 h-4" style={{ color: status.color }} />
                      {status.label}
                    </div>
                    <div className="text-xs text-gray-500">{status.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#264653]">{stats.byStatus[status.id] || 0}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Category Interests */}
          <div className="p-6 border-b border-gray-200">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              <Tag className="w-3 h-3" />
              Interest Categories
              <span className="text-[10px] font-normal normal-case text-gray-400 ml-auto">
                Click to filter
              </span>
            </label>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onFilterChange({ ...filters, category: "all" })}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  filters.category === "all"
                    ? "bg-[#264653] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All Interests
              </button>
              
              {CATEGORIES.map(cat => {
                const count = stats.byCategory[cat.id] || 0;
                const isSelected = filters.category === cat.id;
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    disabled={count === 0}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                      isSelected
                        ? "text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } ${count === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                    style={{
                      backgroundColor: isSelected ? cat.color : undefined
                    }}
                  >
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: isSelected ? "white" : cat.color }}
                    />
                    {cat.label}
                    <span className={`text-xs ${isSelected ? "text-white/80" : "text-gray-400"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {filters.category !== "all" && (
              <div className="mt-4 p-3 bg-[#E9C46A]/10 rounded-lg border border-[#E9C46A]/30">
                <p className="text-sm text-[#264653]">
                  <span className="font-semibold">Filtered:</span> Only subscribers interested in {" "}
                  <span className="font-bold">
                    {CATEGORIES.find(c => c.id === filters.category)?.label}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Audience Preview Toggle */}
          <div className="p-6">
            <button
              onClick={() => setShowSubscriberList(!showSubscriberList)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#264653]" />
                <span className="font-semibold text-[#264653]">
                  Preview Recipients ({filteredSubscribers.length})
                </span>
              </div>
              {showSubscriberList ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {/* Subscriber List */}
            {showSubscriberList && (
              <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden animate-in slide-in-from-top-2">
                {/* Search in list */}
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search subscribers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:border-[#264653] outline-none text-sm"
                    />
                  </div>
                </div>

                {/* List */}
                <div className="max-h-64 overflow-y-auto">
                  {filteredSubscribers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <p className="text-sm">No subscribers match current filters</p>
                    </div>
                  ) : (
                    filteredSubscribers.slice(0, 50).map((sub, idx) => (
                      <div 
                        key={sub.id || sub.email} 
                        className={`flex items-center justify-between p-3 ${
                          idx !== filteredSubscribers.length - 1 ? "border-b border-gray-100" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#264653]/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-[#264653]">
                              {(sub.name || sub.email || "?").charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-sm text-[#264653]">
                              {sub.name || "No name"}
                            </div>
                            <div className="text-xs text-gray-500">{sub.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {sub.categoryInterest?.slice(0, 2).map(cat => (
                            <span 
                              key={cat}
                              className="w-2 h-2 rounded-full"
                              style={{ 
                                backgroundColor: CATEGORIES.find(c => c.id === cat)?.color || "#ccc" 
                              }}
                              title={CATEGORIES.find(c => c.id === cat)?.label}
                            />
                          ))}
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            sub.status === "active" 
                              ? "bg-green-100 text-green-700" 
                              : sub.status === "unsubscribed"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {sub.status || "active"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                  {filteredSubscribers.length > 50 && (
                    <div className="p-3 text-center text-xs text-gray-500 bg-gray-50">
                      And {filteredSubscribers.length - 50} more...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Summary Footer */}
          <div className="p-6 bg-[#264653] text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-80">Ready to send to</div>
                <div className="text-3xl font-black text-[#E9C46A]">
                  {stats.filtered.toLocaleString()}
                </div>
                <div className="text-xs opacity-60 mt-1">subscribers</div>
              </div>
              <div className="text-right">
                {filters.status !== "all" && (
                  <div className="text-xs opacity-80 mb-1">
                    Status: {STATUSES.find(s => s.id === filters.status)?.label}
                  </div>
                )}
                {filters.category !== "all" && (
                  <div className="text-xs opacity-80">
                    Category: {CATEGORIES.find(c => c.id === filters.category)?.label}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}