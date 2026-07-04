import { memo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import ScoreboardHeader from './ScoreboardHeader';
import JobPills from './JobPills';
import BusinessPanel from './BusinessPanel';
import PlayerGrid from './PlayerGrid';
import RobberySection from './RobberySection';
import { fetchNui } from '../utils/fetchNui';
import { useNuiEvent } from '../hooks/useNuiEvent';
import { cn } from '../lib/utils';

const DEFAULT_DATA = {
  serverName: 'Server',
  onlinePlayers: 0,
  maxSlots: 48,
  policeCount: 0,
  jobSections: [],
  players: [],
  robberies: [],
  localPlayer: null,
  settings: {},
};

const Scoreboard = memo(function Scoreboard({ visible, data }) {
  const board = data ?? DEFAULT_DATA;
  const settings = board.settings ?? {};
  const pillColors = settings.pillColors ?? {};
  const heistsEnabled = settings.showHeists ?? false;
  const [expandedSectionId, setExpandedSectionId] = useState(null);
  const [showHeistsPanel, setShowHeistsPanel] = useState(true);
  const [uiFocused, setUiFocused] = useState(true);

  useNuiEvent('scoreboardFocus', (payload) => {
    setUiFocused(payload?.focused !== false);
  });

  const handleClose = useCallback(() => {
    fetchNui('closeScoreboard').catch(() => {});
  }, []);

  useEffect(() => {
    if (!visible) {
      setExpandedSectionId(null);
      setShowHeistsPanel(true);
      setUiFocused(true);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        fetchNui('toggleScoreboardFocus').catch(() => {});
        return;
      }

      if (event.key === 'Escape' || event.key === 'Home') {
        event.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visible, handleClose]);

  const expandedSection = board.jobSections?.find((s) => s.id === expandedSectionId && !s.standalone);

  const handleToggleSection = (sectionId) => {
    setExpandedSectionId((prev) => (prev === sectionId ? null : sectionId));
  };

  return (
    <AnimatePresence>
      {visible && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center p-3">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'pointer-events-auto w-full max-w-7xl transition-opacity',
              !uiFocused && 'pointer-events-none opacity-90',
            )}
          >
            <Card className={cn(!uiFocused && 'ring-0')}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <ScoreboardHeader
                    serverName={board.serverName}
                    onlinePlayers={board.onlinePlayers}
                    maxSlots={board.maxSlots}
                    localPlayer={board.localPlayer}
                    onClose={handleClose}
                    useServerLogo={settings.useServerLogo}
                    serverLogoPath={settings.serverLogo}
                    pillColors={pillColors}
                  />

                  <JobPills
                    sections={board.jobSections}
                    expandedSectionId={expandedSectionId}
                    onToggleSection={handleToggleSection}
                    showStaffCount={settings.showStaffCount}
                    staffCount={board.staffCount ?? 0}
                    pillColors={pillColors}
                  />
                </div>

                {expandedSection && (
                  <div className="mt-4 mb-6">
                    <BusinessPanel section={expandedSection} />
                  </div>
                )}

                {settings.showPlayerList && board.players?.length > 0 && (
                  <div className={expandedSection ? undefined : 'pt-8'}>
                    <PlayerGrid players={board.players} pillColors={pillColors} />
                  </div>
                )}

                {heistsEnabled && !expandedSectionId && (
                  <>
                    <Separator className="my-2" />
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Heist Availability
                      </span>
                      <Button
                        type="button"
                        variant={showHeistsPanel ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setShowHeistsPanel((prev) => !prev)}
                      >
                        Heists: {showHeistsPanel ? 'On' : 'Off'}
                      </Button>
                    </div>
                    {showHeistsPanel && (
                      <RobberySection robberies={board.robberies} policeCount={board.policeCount} />
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

export default Scoreboard;
