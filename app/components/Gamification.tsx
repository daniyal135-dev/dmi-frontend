'use client';

import { useState, useEffect } from 'react';
import { Target, Search, Users, Medal, Zap, BookOpen, Shield, Flame } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  Icon: typeof Target;
  earned: boolean;
  progress: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  Icon: typeof Zap;
  unlocked: boolean;
}

const badgeDefs: Omit<Badge, 'earned' | 'progress'>[] = [
  {
    id: 'first-analysis',
    name: 'First analysis',
    description: 'Complete your first detection run',
    Icon: Target,
  },
  {
    id: 'expert-detector',
    name: 'Expert detector',
    description: 'Reach 50+ analyses in your history',
    Icon: Search,
  },
  {
    id: 'community-helper',
    name: 'Community helper',
    description: 'Help others in the forum',
    Icon: Users,
  },
  {
    id: 'accuracy-master',
    name: 'Consistency',
    description: 'Maintain strong agreement with model confidence',
    Icon: Medal,
  },
];

export default function Gamification() {
  const [points, setPoints] = useState(1250);
  const [level] = useState(3);
  const [streak] = useState(7);
  const [badges] = useState<Badge[]>(() =>
    badgeDefs.map((b, i) => ({
      ...b,
      earned: i === 0,
      progress: i === 0 ? 100 : [68, 40, 25][i - 1] ?? 25,
    }))
  );

  const [achievements] = useState<Achievement[]>([
    {
      id: 'speed-demon',
      title: 'Speed run',
      description: 'Finish an analysis in under 30 seconds',
      points: 100,
      Icon: Zap,
      unlocked: true,
    },
    {
      id: 'detective-pro',
      title: 'Multi-signal',
      description: 'Review image, video, and text results',
      points: 200,
      Icon: Search,
      unlocked: true,
    },
    {
      id: 'knowledge-seeker',
      title: 'Knowledge seeker',
      description: 'Read articles in the knowledge base',
      points: 150,
      Icon: BookOpen,
      unlocked: false,
    },
    {
      id: 'social-warrior',
      title: 'Archive contributor',
      description: 'Share vetted findings to the archive',
      points: 300,
      Icon: Shield,
      unlocked: false,
    },
  ]);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.72) {
        const newPoints = Math.floor(Math.random() * 50) + 10;
        setPoints((prev) => prev + newPoints);
        setNotificationText(`+${newPoints} points`);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2800);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getLevelProgress = () => {
    const currentLevelPoints = level * 500;
    const nextLevelPoints = (level + 1) * 500;
    const raw = ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
    return Math.min(Math.max(raw, 0), 100);
  };

  const card = 'rounded-2xl border border-app-border bg-app-surface shadow-sm';

  return (
    <div className={`${card} p-8 backdrop-blur-sm`}>
      <div className="mb-8 text-center">
        <h3 className="mb-2 text-lg font-semibold text-app-text sm:text-xl">Progress & badges</h3>
        <p className="text-sm text-app-muted">Light engagement layer on top of your real analyses.</p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className={`${card} border-app-accent/20 bg-app-accent-soft p-6`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-app-text">{points.toLocaleString()}</div>
            <div className="text-sm text-app-muted">Total points</div>
          </div>
        </div>
        <div className={`${card} p-6`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-app-text">Level {level}</div>
            <div className="text-sm text-app-muted">Current level</div>
          </div>
        </div>
        <div className={`${card} p-6`}>
          <div className="flex items-center justify-center gap-2 text-center">
            <Flame className="h-6 w-6 text-app-accent" aria-hidden />
            <div>
              <div className="text-2xl font-bold text-app-text">{streak}</div>
              <div className="text-sm text-app-muted">Day streak</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-2 flex justify-between text-xs text-app-muted">
          <span>
            Level {level} progress
          </span>
          <span>{getLevelProgress().toFixed(0)}%</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-app-bg-mid">
          <div
            className="h-2.5 rounded-full bg-app-accent transition-all duration-500"
            style={{ width: `${getLevelProgress()}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-app-muted">
          {points} / {(level + 1) * 500} to next level
        </div>
      </div>

      <div className="mb-8">
        <h4 className="mb-4 text-lg font-semibold text-app-text">Badges</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge) => {
            const Icon = badge.Icon;
            return (
              <div
                key={badge.id}
                className={`rounded-xl border p-4 transition-colors ${
                  badge.earned
                    ? 'border-app-accent/25 bg-app-accent-soft'
                    : 'border-app-border bg-app-bg-mid/50'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <span
                    className={`mb-3 inline-flex rounded-xl p-3 ${
                      badge.earned ? 'bg-app-accent text-white' : 'bg-app-surface-hover text-app-muted'
                    }`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h5 className={`mb-1 font-semibold ${badge.earned ? 'text-app-text' : 'text-app-muted'}`}>
                    {badge.name}
                  </h5>
                  <p className="text-xs text-app-muted">{badge.description}</p>
                  {!badge.earned && (
                    <div className="mt-3 w-full">
                      <div className="h-1.5 w-full rounded-full bg-app-bg-mid">
                        <div
                          className="h-1.5 rounded-full bg-app-accent"
                          style={{ width: `${badge.progress}%` }}
                        />
                      </div>
                      <div className="mt-1 text-xs text-app-muted">{badge.progress}%</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="mb-4 text-lg font-semibold text-app-text">Achievements</h4>
        <div className="space-y-2">
          {achievements.map((achievement) => {
            const Icon = achievement.Icon;
            return (
              <div
                key={achievement.id}
                className={`flex items-center gap-4 rounded-xl border px-4 py-3 ${
                  achievement.unlocked
                    ? 'border-l-4 border-l-app-accent border-app-border bg-app-accent-soft'
                    : 'border-app-border bg-app-bg-mid/80 opacity-90'
                }`}
              >
                <span
                  className={`inline-flex rounded-lg p-2 ${
                    achievement.unlocked ? 'bg-app-accent-soft text-app-accent' : 'bg-app-surface-hover text-app-muted'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <h5 className="font-semibold text-app-text">{achievement.title}</h5>
                  <p className="text-sm text-app-muted">{achievement.description}</p>
                </div>
                <div className={`shrink-0 text-sm font-bold ${achievement.unlocked ? 'text-app-accent' : 'text-app-muted'}`}>
                  +{achievement.points}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showNotification && (
        <div className="fixed top-24 right-6 z-50 rounded-lg border border-app-border bg-app-surface px-5 py-3 text-sm text-app-text shadow-lg shadow-red-950/10 backdrop-blur-md">
          {notificationText}
        </div>
      )}
    </div>
  );
}
