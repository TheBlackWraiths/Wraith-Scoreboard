import { useState, useCallback, useEffect } from 'react';
import { useNuiEvent } from './hooks/useNuiEvent';
import Scoreboard from './components/Scoreboard';

const isEnvBrowser = !(window.invokeNative);
const DEV_BACKGROUND = './images/dev-background.png';

const DEV_PREVIEW_DATA = {
  serverName: 'Wraith RP',
  onlinePlayers: 8,
  maxSlots: 1024,
  staffCount: 2,
  policeCount: 3,
  localPlayer: {
    id: 1,
    name: 'James Grimshaw',
    job: 'Mechanic',
    tagColor: 'orange',
    onDuty: true,
    isStaff: true,
    ping: 12,
  },
  jobSections: [
    {
      id: 'law_enforcement',
      label: 'Law Enforcement',
      shortLabel: 'Police',
      icon: 'shield',
      color: 'blue',
      count: 3,
      standalone: true,
      businesses: [{ id: 'police', label: 'Police', count: 3, active: true }],
    },
    {
      id: 'medical',
      label: 'Medical Services',
      shortLabel: 'Medics',
      icon: 'heart-pulse',
      color: 'red',
      count: 1,
      standalone: true,
      businesses: [{ id: 'ems', label: 'EMS', count: 1, active: true }],
    },
    {
      id: 'mechanic',
      label: 'Mechanic Services',
      shortLabel: 'Mechanics',
      icon: 'wrench',
      color: 'orange',
      count: 1,
      standalone: true,
      businesses: [{ id: 'mechanic', label: 'Mechanic', count: 1, active: true }],
    },
    {
      id: 'restaurants',
      label: 'Restaurants',
      shortLabel: 'Restaurants',
      icon: 'utensils',
      color: 'yellow',
      count: 2,
      standalone: false,
      businesses: [
        { id: 'burgershot', label: 'Burger Shot', icon: 'utensils', count: 1, active: true },
        { id: 'pearl', label: 'Pearls', icon: 'utensils', count: 1, active: true },
        { id: 'pizza', label: 'Pizza This', icon: 'utensils', count: 0, active: false },
      ],
    },
  ],
  players: [
    { id: 1, name: 'James Alexander Grimshaw', job: 'Mechanic', tagColor: 'orange', onDuty: true, isStaff: true, ping: 12 },
    { id: 2, name: 'John Michael Smith', job: 'Police', tagColor: 'blue', onDuty: false, isStaff: true, ping: 24 },
    { id: 3, name: 'Jane Doe', job: 'Ambulance', tagColor: 'red', onDuty: false, ping: 31 },
    { id: 4, name: 'Mike Jones', job: 'Unemployed', tagColor: 'gray', onDuty: false, ping: 18 },
    { id: 5, name: 'Sarah Lee', job: 'Police', tagColor: 'blue', onDuty: true, ping: 45 },
    { id: 6, name: 'Tom Wilson', job: 'Real Estate', tagColor: 'blue', onDuty: true, ping: 22 },
    { id: 7, name: 'Amy Chen', job: 'Unemployed', tagColor: 'gray', onDuty: false, ping: 67 },
    { id: 8, name: 'Chris Park', job: 'Police', tagColor: 'blue', onDuty: true, ping: 29 },
  ],
  robberies: [
    { id: 'store', label: 'Store Robbery', icon: 'store', requiredPolice: 1, policeOnline: 3, available: true },
    { id: 'bank', label: 'Bank Heist', icon: 'landmark', requiredPolice: 4, policeOnline: 3, available: false },
    { id: 'car', label: 'Car Theft', icon: 'car-front', requiredPolice: 1, policeOnline: 3, available: true },
  ],
  settings: {
    showPlayerList: true,
    showHeists: true,
    showStaffCount: true,
    pillColors: {
      blue: '#3B82F6',
      red: '#EF4444',
      orange: '#F97316',
      green: '#22C55E',
      yellow: '#EAB308',
      gray: '#9CA3AF',
      staff: '#FACC15',
    },
    openKey: 'HOME',
  },
};

export default function App() {
  const [visible, setVisible] = useState(isEnvBrowser);
  const [data, setData] = useState(isEnvBrowser ? DEV_PREVIEW_DATA : null);

  const handleOpen = useCallback(() => setVisible(true), []);
  const handleClose = useCallback(() => setVisible(false), []);
  const handleUpdate = useCallback((payload) => setData(payload), []);

  useNuiEvent('openScoreboard', handleOpen);
  useNuiEvent('closeScoreboard', handleClose);
  useNuiEvent('updateScoreboard', handleUpdate);

  useEffect(() => {
    if (!isEnvBrowser) return;
    document.documentElement.classList.add('dev-preview');
    document.body.classList.add('dev-preview');
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setVisible((prev) => !prev);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.documentElement.classList.remove('dev-preview');
      document.body.classList.remove('dev-preview');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  if (isEnvBrowser) {
    return (
      <div className="dev-preview-shell">
        <div
          className="dev-preview-bg"
          style={{ backgroundImage: `url(${DEV_BACKGROUND})` }}
          aria-hidden
        />
        <Scoreboard visible={visible} data={data} />
      </div>
    );
  }

  return <Scoreboard visible={visible} data={data} />;
}
