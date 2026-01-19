import {
  LayoutDashboard,
  Briefcase,
  UserCog,
  Users,
  Monitor,
} from "lucide-react";
import {
  TabsContainer,
  TabsList,
  TabButton,
  TabsContent,
  TabPanel,
} from "../../components/ui/TabsContainer";
import OverviewTab from "./tabs/OverviewTab";
import ServicesTab from "./tabs/ServicesTab";
import AdminUsersTab from "./tabs/AdminUsersTab";
import PatientsTab from "./tabs/PatientsTab";
import QueueMonitoringTab from "./tabs/QueueMonitoringTab";

const tabs = [
  { label: "Overview", value: "overview", icon: LayoutDashboard },
  { label: "Services", value: "services", icon: Briefcase },
  { label: "Admin Users", value: "admin-users", icon: UserCog },
  { label: "Patients", value: "patients", icon: Users },
  {
    label: "Queue Monitoring",
    value: "queue-monitoring",
    icon: Monitor,
    shortLabel: "Queue",
  },
];

export default function ContentTabs() {
  return (
    <TabsContainer defaultTab="overview">
      <TabsList>
        {tabs.map((tab) => (
          <TabButton
            key={tab.value}
            value={tab.value}
            icon={tab.icon}
            label={tab.label}
            shortLabel={tab.shortLabel}
          />
        ))}
      </TabsList>

      <TabsContent>
        <TabPanel value="overview">
          <OverviewTab />
        </TabPanel>
        <TabPanel value="services">
          <ServicesTab />
        </TabPanel>
        <TabPanel value="admin-users">
          <AdminUsersTab />
        </TabPanel>
        <TabPanel value="patients">
          <PatientsTab />
        </TabPanel>
        <TabPanel value="queue-monitoring">
          <QueueMonitoringTab />
        </TabPanel>
      </TabsContent>
    </TabsContainer>
  );
}
