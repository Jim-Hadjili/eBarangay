import { useQueueDisplay } from "../hooks/useQueueDisplay";
import LoadingState from "../components/queueDisplay/LoadingState";
import VoiceEnableBanner from "../components/queueDisplay/VoiceEnableBanner";
import QueueDisplayHeader from "../components/queueDisplay/QueueDisplayHeader";
import EmptyQueueState from "../components/queueDisplay/EmptyQueueState";
import ServicesGrid from "../components/queueDisplay/ServicesGrid";
import QueueDisplayFooter from "../components/queueDisplay/QueueDisplayFooter";

export default function QueueDisplay() {
  const {
    servicesWithQueues,
    currentTime,
    loading,
    voiceEnabled,
    enableVoice,
    testAnnouncement,
  } = useQueueDisplay();

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen h-screen bg-blue-50 flex flex-col font-sans overflow-hidden">
      {!voiceEnabled && <VoiceEnableBanner onEnableVoice={enableVoice} />}

      <QueueDisplayHeader currentTime={currentTime} />

      <div className="flex-1 py-4 sm:py-6 lg:py-10 px-4 sm:px-8 lg:px-12 overflow-y-auto">
        {servicesWithQueues.length === 0 ? (
          <EmptyQueueState />
        ) : (
          <ServicesGrid servicesWithQueues={servicesWithQueues} />
        )}
      </div>

      <QueueDisplayFooter
        voiceEnabled={voiceEnabled}
        onEnableVoice={enableVoice}
        onTestAnnouncement={testAnnouncement}
      />
    </div>
  );
}
