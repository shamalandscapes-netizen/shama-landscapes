"use client";

import { 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  ChevronRight, 
  FileText, 
  Eye, 
  Clock, 
  Send,
  Save,
  ArrowRight,
  ArrowLeft,
  Loader2
} from "lucide-react";

const STAGES = [
  {
    id: "select",
    label: "Select",
    description: "Choose posts & content",
    icon: FileText,
    validate: (data) => ({
      valid: data.selectedPosts?.length > 0 && data.title?.trim(),
      message: data.selectedPosts?.length === 0 
        ? "Select at least one post" 
        : !data.title?.trim() 
        ? "Add a newsletter title"
        : null
    })
  },
  {
    id: "review",
    label: "Review",
    description: "Preview & verify",
    icon: Eye,
    validate: () => ({ valid: true })
  },
  {
    id: "schedule",
    label: "Schedule",
    description: "Set delivery time",
    icon: Clock,
    validate: (data) => ({
      valid: true,
      message: data.scheduledFor && new Date(data.scheduledFor) < new Date()
        ? "Schedule time must be in the future"
        : null
    })
  },
  {
    id: "send",
    label: "Send",
    description: "Deliver newsletter",
    icon: Send,
    validate: () => ({ valid: true })
  }
];

export default function SendWorkflow({ 
  currentStage, 
  onStageChange, 
  data,
  onNext,
  onBack,
  onSend,
  sending,
  sendResult
}) {
  const currentStageIndex = STAGES.findIndex(s => s.id === currentStage);
  
  // Check if can proceed to next stage
  const canProceed = () => {
    const stage = STAGES[currentStageIndex];
    const validation = stage.validate(data);
    return validation.valid && !sending;
  };

  // Get validation message for current stage
  const getValidationMessage = () => {
    const stage = STAGES[currentStageIndex];
    return stage.validate(data).message;
  };

  // Handle stage click (only allow clicking completed stages or current)
  const handleStageClick = (index) => {
    if (index <= currentStageIndex) {
      onStageChange(STAGES[index].id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Progress Header */}
      <div className="bg-linear-to-r from-[#264653] to-[#1a3238] p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Newsletter Workflow</h2>
            <p className="text-white/60 text-sm mt-1">
              Step {currentStageIndex + 1} of {STAGES.length}: {STAGES[currentStageIndex].label}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-2xl font-black text-[#E9C46A]">
                {Math.round(((currentStageIndex + 1) / STAGES.length) * 100)}%
              </div>
              <div className="text-[10px] uppercase tracking-wider text-white/50">Complete</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-[#E9C46A] -translate-y-1/2 transition-all duration-500"
            style={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}
          />
          <div className="relative flex justify-between">
            {STAGES.map((stage, index) => {
              const isCompleted = index < currentStageIndex;
              const isCurrent = index === currentStageIndex;
              const isPending = index > currentStageIndex;
              const Icon = stage.icon;

              return (
                <button
                  key={stage.id}
                  onClick={() => handleStageClick(index)}
                  disabled={index > currentStageIndex}
                  className={`group flex flex-col items-center gap-2 transition-all ${
                    index > currentStageIndex ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                    ${isCompleted 
                      ? "bg-[#E9C46A] border-[#E9C46A] text-[#264653]" 
                      : isCurrent
                      ? "bg-[#264653] border-[#E9C46A] text-[#E9C46A] ring-4 ring-[#E9C46A]/20"
                      : "bg-[#264653] border-white/20 text-white/40"
                    }
                  `}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="hidden sm:block text-center">
                    <div className={`text-xs font-bold transition-colors ${
                      isCompleted || isCurrent ? "text-white" : "text-white/40"
                    }`}>
                      {stage.label}
                    </div>
                    <div className={`text-[10px] transition-colors ${
                      isCompleted || isCurrent ? "text-white/60" : "text-white/30"
                    }`}>
                      {stage.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stage Content Placeholder - This is where the main content renders */}
      <div className="p-6 min-h-50">
        {getValidationMessage() && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {getValidationMessage()}
          </div>
        )}

        {/* Stage indicator for mobile */}
        <div className="sm:hidden mb-4 flex items-center justify-center gap-1">
          {STAGES.map((stage, idx) => (
            <div 
              key={stage.id}
              className={`h-1 rounded-full transition-all ${
                idx === currentStageIndex ? "w-6 bg-[#E9C46A]" : 
                idx < currentStageIndex ? "w-2 bg-[#E9C46A]/50" : 
                "w-2 bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="text-center text-gray-400 py-8">
          <p className="text-sm">Stage content renders here</p>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={currentStageIndex === 0 || sending}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
            currentStageIndex === 0
              ? "opacity-0 pointer-events-none"
              : "text-gray-600 hover:text-[#264653] hover:bg-white border border-transparent hover:border-gray-200"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Stage-specific actions */}
        <div className="flex items-center gap-3">
          {currentStage === "send" || currentStage === "sent" ? (
            <>
              {sendResult ? (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  sendResult.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {sendResult.success ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {sendResult.success ? "Sent successfully!" : "Failed to send"}
                  </span>
                </div>
              ) : (
                <button
                  onClick={onSend}
                  disabled={sending}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#E9C46A] hover:bg-[#d4b35f] text-[#264653] font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : data.scheduledFor ? (
                    <>
                      <Clock className="w-4 h-4" />
                      Schedule Newsletter
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Now
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <button
              onClick={onNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#264653] text-white font-semibold rounded-xl hover:bg-[#1a3238] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tips based on current stage */}
      <div className="px-6 py-3 bg-shama-clay border-t border-shama-terra/20">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-shama-terra/20 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-shama-terra text-xs font-bold">?</span>
          </div>
          <div className="text-sm text-[#264653]">
            <span className="font-semibold">Tip: </span>
            {currentStage === "select" && "Choose 3-5 posts for optimal engagement. Include a mix of topics to appeal to different interests."}
            {currentStage === "review" && "Double-check your title and editor's note. Preview how the email will look on mobile devices."}
            {currentStage === "schedule" && "Tuesday-Thursday, 9-11 AM typically sees the highest open rates for B2B newsletters."}
            {currentStage === "send" && "Once sent, you cannot recall the newsletter. Make sure everything looks perfect!"}
          </div>
        </div>
      </div>
    </div>
  );
}