"use client";

import { useState, useEffect, useCallback } from "react";
import { format, startOfQuarter, endOfQuarter, subQuarters, isWithinInterval, parseISO } from "date-fns";
import { 
  Mail, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Send, 
  Eye, 
  Users, 
  ChevronRight,
  ChevronLeft,
  Save,
  AlertCircle,
  TrendingUp,
  Archive
} from "lucide-react";
import { client } from "@/sanity/lib/client";
import { allPostsQuery } from "@/sanity/lib/queries";

// Import our new components
import PostSelector from "@/components/newsletter/PostSelector";
import SubscriberFilter from "@/components/newsletter/SubscriberFilter";
import NewsletterPreview from "@/components/newsletter/NewsletterPreview";
import SendWorkflow from "@/components/newsletter/SendWorkflow";

// Workflow stages
const STAGES = {
  SELECT: "select",
  REVIEW: "review",
  SCHEDULE: "schedule",
  SEND: "send"
};

// Quarter options generator
const getQuarterOptions = () => {
  const options = [];
  const now = new Date();
  
  for (let i = 0; i < 4; i++) {
    const date = subQuarters(now, i);
    const start = startOfQuarter(date);
    const end = endOfQuarter(date);
    const year = format(start, "yyyy");
    const quarter = Math.floor(start.getMonth() / 3) + 1;
    
    options.push({
      id: `Q${quarter}-${year}`,
      label: `Q${quarter} ${year}`,
      start,
      end,
      isCurrent: i === 0
    });
  }
  
  return options;
};

export default function NewsletterAdminPage() {
  // Data state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState([]);
  
  // Workflow state
  const [currentStage, setCurrentStage] = useState(STAGES.SELECT);
  
  // Content state
  const [selectedQuarter, setSelectedQuarter] = useState(getQuarterOptions()[0]);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [editorNote, setEditorNote] = useState("");
  const [newsletterTitle, setNewsletterTitle] = useState("");
  
  // Filter state
  const [subscriberFilters, setSubscriberFilters] = useState({ 
    status: "active", 
    category: "all" 
  });
  
  // Schedule state
  const [scheduledFor, setScheduledFor] = useState(null);
  
  // UI state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [sendHistory, setSendHistory] = useState([]);

  // Fetch posts and subscribers on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedPosts, subscribersRes] = await Promise.all([
          client.fetch(allPostsQuery),
          fetch("/api/newsletter").then(r => r.json())
        ]);
        
        setPosts(fetchedPosts);
        setSubscribers(subscribersRes.subscribers || []);
        
        // Auto-select posts from current quarter and set title
        const currentQuarter = getQuarterOptions()[0];
        autoSelectPosts(fetchedPosts, currentQuarter);
        setNewsletterTitle(`Shama Landscapes Journal - ${currentQuarter.label}`);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    fetchSendHistory();
  }, []);

  // Fetch send history
  const fetchSendHistory = async () => {
    try {
      const res = await fetch("/api/newsletter/history");
      const data = await res.json();
      setSendHistory(data.history || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  // Auto-select posts based on quarter
  const autoSelectPosts = (allPosts, quarter) => {
    const inQuarter = allPosts.filter(post => {
      if (!post.publishedAt) return false;
      const postDate = parseISO(post.publishedAt);
      return isWithinInterval(postDate, { start: quarter.start, end: quarter.end });
    });
    setSelectedPosts(inQuarter.map(p => p._id));
  };

  // Handle quarter change
  const handleQuarterChange = (quarter) => {
    setSelectedQuarter(quarter);
    autoSelectPosts(posts, quarter);
    setNewsletterTitle(`Shama Landscapes Journal - ${quarter.label}`);
  };

  // Post selection handlers
  const togglePostSelection = (postId) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const selectAllPosts = (ids) => {
    setSelectedPosts(prev => [...new Set([...prev, ...ids])]);
  };

  const deselectAllPosts = (ids) => {
    setSelectedPosts(prev => prev.filter(id => !ids.includes(id)));
  };

  // Navigation handlers
  const nextStage = () => {
    const stages = Object.values(STAGES);
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex < stages.length - 1) {
      setCurrentStage(stages[currentIndex + 1]);
    }
  };

  const prevStage = () => {
    const stages = Object.values(STAGES);
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex > 0) {
      setCurrentStage(stages[currentIndex - 1]);
    }
  };

  // Send newsletter
  const handleSend = async () => {
    setSending(true);
    setSendResult(null);
    
    try {
      const selectedPostsData = posts.filter(p => selectedPosts.includes(p._id));
      
      const res = await fetch("/api/send-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newsletterTitle,
          posts: selectedPostsData,
          editorNote: editorNote,
          scheduledFor: scheduledFor,
          filters: subscriberFilters
        })
      });
      
      const result = await res.json();
      setSendResult(result);
      
      if (result.success) {
        setCurrentStage("sent");
        fetchSendHistory(); // Refresh history
      }
    } catch (error) {
      console.error("Send error:", error);
      setSendResult({ success: false, error: error.message });
    } finally {
      setSending(false);
    }
  };

  // Get filtered subscriber count
  const getFilteredSubscriberCount = () => {
    let filtered = subscribers.filter(s => {
      if (subscriberFilters.status !== "all" && s.status !== subscriberFilters.status) return false;
      return true;
    });
    
    if (subscriberFilters.category !== "all") {
      filtered = filtered.filter(s => 
        s.categoryInterest?.includes(subscriberFilters.category)
      );
    }
    
    return filtered.length;
  };

  // Prepare data for workflow validation
  const workflowData = {
    selectedPosts: posts.filter(p => selectedPosts.includes(p._id)),
    title: newsletterTitle,
    scheduledFor
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E9C46A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#264653] font-medium">Loading newsletter composer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Page Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-[#264653] flex items-center justify-center">
                <Mail className="w-6 h-6 text-[#E9C46A]" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#264653] tracking-tight">
                  Newsletter <span className="text-[#E9C46A]">Composer</span>
                </h1>
              </div>
            </div>
            <p className="text-gray-500 ml-1">
              Compile quarterly updates and send to your subscribers
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-4">
            <div className="text-center px-4 py-2 bg-shama-clay rounded-xl">
              <div className="text-2xl font-black text-[#264653]">{sendHistory.length}</div>
              <div className="text-xs text-gray-500 font-medium">Sent</div>
            </div>
            <div className="text-center px-4 py-2 bg-[#E9C46A]/20 rounded-xl">
              <div className="text-2xl font-black text-[#264653]">
                {subscribers.filter(s => s.status === "active").length}
              </div>
              <div className="text-xs text-gray-500 font-medium">Subscribers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Component */}
      <SendWorkflow
        currentStage={currentStage}
        onStageChange={setCurrentStage}
        data={workflowData}
        onNext={nextStage}
        onBack={prevStage}
        onSend={handleSend}
        sending={sending}
        sendResult={sendResult}
      />

      {/* Main Content Area - Changes based on stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* STAGE: SELECT */}
          {currentStage === STAGES.SELECT && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Quarter Selection */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <label className="flex items-center gap-2 text-sm font-bold text-[#264653] mb-4">
                  <Calendar className="w-4 h-4" />
                  Select Quarter
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {getQuarterOptions().map((quarter) => (
                    <button
                      key={quarter.id}
                      onClick={() => handleQuarterChange(quarter)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedQuarter.id === quarter.id
                          ? "border-[#264653] bg-[#264653] text-white shadow-lg"
                          : "border-gray-200 hover:border-[#264653]/30 bg-white"
                      }`}
                    >
                      <div className="text-xs uppercase tracking-wider opacity-70 mb-1">
                        {quarter.isCurrent ? "Current" : "Past"}
                      </div>
                      <div className="font-bold text-lg">{quarter.label}</div>
                      <div className={`text-xs mt-1 ${selectedQuarter.id === quarter.id ? "text-white/70" : "text-gray-500"}`}>
                        {format(quarter.start, "MMM d")} - {format(quarter.end, "MMM d")}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <label className="flex items-center gap-2 text-sm font-bold text-[#264653] mb-4">
                  <Mail className="w-4 h-4" />
                  Newsletter Details
                </label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Newsletter Title
                    </label>
                    <input
                      type="text"
                      value={newsletterTitle}
                      onChange={(e) => setNewsletterTitle(e.target.value)}
                      placeholder="e.g., Shama Landscapes Journal - Q1 2024"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#264653] focus:ring-2 focus:ring-[#264653]/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Editor&apos;s Note (Optional)
                    </label>
                    <textarea
                      value={editorNote}
                      onChange={(e) => setEditorNote(e.target.value)}
                      placeholder="Add a personal message to your subscribers..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#264653] focus:ring-2 focus:ring-[#264653]/20 outline-none transition-all resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      {editorNote.length}/500 characters
                    </p>
                  </div>
                </div>
              </div>

              {/* Post Selector Component */}
              <PostSelector
                posts={posts}
                selectedPosts={selectedPosts}
                onTogglePost={togglePostSelection}
                onSelectAll={selectAllPosts}
                onSelectNone={deselectAllPosts}
                selectedQuarter={selectedQuarter}
              />
            </div>
          )}

          {/* STAGE: REVIEW */}
          {currentStage === STAGES.REVIEW && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Summary Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-[#264653] mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#E9C46A]" />
                  Review Summary
                </h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-shama-clay rounded-xl">
                    <div className="text-3xl font-black text-[#264653] mb-1">
                      {selectedPosts.length}
                    </div>
                    <div className="text-sm text-gray-600">Posts included</div>
                  </div>
                  <div className="p-4 bg-[#E9C46A]/20 rounded-xl">
                    <div className="text-3xl font-black text-[#264653] mb-1">
                      {getFilteredSubscriberCount()}
                    </div>
                    <div className="text-sm text-gray-600">Recipients</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Title</span>
                    <span className="font-semibold text-[#264653] text-right max-w-md">
                      {newsletterTitle}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Editor&apos;s Note</span>
                    <span className="text-gray-500 text-right max-w-md">
                      {editorNote ? "Included" : "None"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Send Status</span>
                    <span className="font-semibold text-[#264653]">
                      {subscriberFilters.status === "active" ? "Active subscribers only" : "All subscribers"}
                    </span>
                  </div>
                  {subscriberFilters.category !== "all" && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Category Filter</span>
                      <span className="font-semibold text-[#264653]">
                        {subscriberFilters.category.replace(/-/g, " ")}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setPreviewOpen(true)}
                  className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 bg-[#264653] hover:bg-[#1a3238] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  <Eye className="w-5 h-5" />
                  Preview Newsletter
                </button>
              </div>

              {/* Selected Posts List */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-[#264653] mb-4 flex items-center gap-2">
                  <Archive className="w-4 h-4" />
                  Included Posts
                </h3>
                <div className="space-y-3">
                  {posts
                    .filter(p => selectedPosts.includes(p._id))
                    .map((post, idx) => (
                      <div key={post._id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                        <span className="w-8 h-8 rounded-full bg-[#264653] text-white text-sm flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#264653] truncate">{post.title}</p>
                          <p className="text-xs text-gray-500">
                            {post.publishedAt ? format(parseISO(post.publishedAt), "MMM d, yyyy") : "No date"}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* STAGE: SCHEDULE */}
          {currentStage === STAGES.SCHEDULE && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-[#264653] mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#E9C46A]" />
                  Schedule Delivery
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Send Now Option */}
                  <button
                    onClick={() => setScheduledFor(null)}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      !scheduledFor
                        ? "border-[#264653] bg-[#264653] text-white shadow-lg"
                        : "border-gray-200 hover:border-[#264653]/30 bg-white"
                    }`}
                  >
                    <Send className={`w-8 h-8 mb-3 ${!scheduledFor ? "text-[#E9C46A]" : "text-gray-400"}`} />
                    <div className="font-bold text-lg mb-1">Send Immediately</div>
                    <div className={`text-sm ${!scheduledFor ? "text-white/70" : "text-gray-500"}`}>
                      Deliver to subscribers right now
                    </div>
                  </button>

                  {/* Schedule Option */}
                  <button
                    onClick={() => setScheduledFor(format(new Date(Date.now() + 86400000), "yyyy-MM-dd'T'09:00"))}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      scheduledFor
                        ? "border-[#E9C46A] bg-[#E9C46A]/10 shadow-lg"
                        : "border-gray-200 hover:border-[#E9C46A]/30 bg-white"
                    }`}
                  >
                    <Clock className={`w-8 h-8 mb-3 ${scheduledFor ? "text-[#E9C46A]" : "text-gray-400"}`} />
                    <div className="font-bold text-lg mb-1 text-[#264653]">Schedule for Later</div>
                    <div className={`text-sm ${scheduledFor ? "text-[#264653]/70" : "text-gray-500"}`}>
                      Choose a specific date and time
                    </div>
                  </button>
                </div>

                {/* Schedule Details */}
                {scheduledFor && (
                  <div className="p-6 bg-shama-clay rounded-xl border-2 border-[#E9C46A] animate-in fade-in">
                    <label className="block text-sm font-bold text-[#264653] mb-4">
                      Choose Date & Time
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">Date</label>
                        <input
                          type="date"
                          value={scheduledFor ? scheduledFor.split('T')[0] : ""}
                          onChange={(e) => {
                            const time = scheduledFor ? scheduledFor.split('T')[1] : "09:00";
                            setScheduledFor(`${e.target.value}T${time}`);
                          }}
                          min={format(new Date(), "yyyy-MM-dd")}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#264653] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">Time</label>
                        <input
                          type="time"
                          value={scheduledFor ? scheduledFor.split('T')[1] : "09:00"}
                          onChange={(e) => {
                            const date = scheduledFor ? scheduledFor.split('T')[0] : format(new Date(), "yyyy-MM-dd");
                            setScheduledFor(`${date}T${e.target.value}`);
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#264653] outline-none"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-[#264653]/70 mt-3">
                      Recommended: Tuesday-Thursday, 9:00-11:00 AM for best open rates
                    </p>
                  </div>
                )}
              </div>

              {/* Best Practices */}
              <div className="bg-linear-to-br from-[#264653] to-[#1a3238] rounded-2xl shadow-lg p-6 text-white">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#E9C46A]" />
                  Best Practices
                </h4>
                <ul className="space-y-3 text-sm text-white/80">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[#E9C46A]" />
                    <span>Send between Tuesday-Thursday for highest engagement</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[#E9C46A]" />
                    <span>Morning hours (9-11 AM) typically see better open rates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[#E9C46A]" />
                    <span>Avoid Mondays (busy inboxes) and Fridays (weekend mode)</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* STAGE: SEND / RESULT */}
          {currentStage === "sent" && sendResult && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center animate-in zoom-in">
              {sendResult.success ? (
                <>
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#264653] mb-2">
                    {sendResult.scheduled ? "Newsletter Scheduled!" : "Newsletter Sent!"}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {sendResult.scheduled 
                      ? `Scheduled for ${format(new Date(sendResult.scheduledFor), "MMMM d, yyyy 'at' h:mm a")}`
                      : `Successfully delivered to ${sendResult.recipientCount || 0} subscribers`
                    }
                  </p>
                  {sendResult.results && (
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6">
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        {sendResult.results.filter(r => r.status === "sent").length} sent
                      </span>
                      {sendResult.results.filter(r => r.status === "failed").length > 0 && (
                        <span className="flex items-center gap-1 text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          {sendResult.results.filter(r => r.status === "failed").length} failed
                        </span>
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-[#264653] text-white rounded-xl font-semibold hover:bg-[#1a3238] transition-colors"
                  >
                    Create New Newsletter
                  </button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#264653] mb-2">Send Failed</h2>
                  <p className="text-gray-600 mb-6">{sendResult.error || "Something went wrong"}</p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setCurrentStage(STAGES.SCHEDULE)}
                      className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-[#264653] transition-colors"
                    >
                      Go Back
                    </button>
                    <button
                      onClick={handleSend}
                      disabled={sending}
                      className="px-6 py-3 bg-[#264653] text-white rounded-xl font-semibold hover:bg-[#1a3238] transition-colors disabled:opacity-50"
                    >
                      Try Again
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Subscriber Filter (shown in all stages except sent) */}
        {currentStage !== "sent" && (
          <div className="space-y-6">
            <SubscriberFilter
              subscribers={subscribers}
              filters={subscriberFilters}
              onFilterChange={setSubscriberFilters}
            />

            {/* Send History Mini */}
            {sendHistory.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h4 className="font-bold text-[#264653] mb-4 flex items-center gap-2">
                  <Archive className="w-4 h-4" />
                  Recent Newsletters
                </h4>
                <div className="space-y-3">
                  {sendHistory.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div>
                        <p className="font-medium text-sm text-[#264653] truncate max-w-37.5">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(item.sent_at), "MMM d, yyyy")}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {item.recipient_count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <NewsletterPreview
          title={newsletterTitle}
          posts={posts.filter(p => selectedPosts.includes(p._id))}
          editorNote={editorNote}
          scheduledFor={scheduledFor}
          recipientCount={getFilteredSubscriberCount()}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  );
}