import {
  Shield,
  HeartPulse,
  Wrench,
  Briefcase,
  Car,
  Users,
  Star,
  Flame,
  Truck,
  Building2,
  Store,
  Landmark,
  Gem,
  CarFront,
  FlaskConical,
  Home,
  UtensilsCrossed,
  Bike,
  Flower2,
} from 'lucide-react';

export const ICON_MAP = {
  shield: Shield,
  'heart-pulse': HeartPulse,
  wrench: Wrench,
  briefcase: Briefcase,
  car: Car,
  users: Users,
  star: Star,
  flame: Flame,
  truck: Truck,
  building: Building2,
  store: Store,
  landmark: Landmark,
  gem: Gem,
  'car-front': CarFront,
  flask: FlaskConical,
  home: Home,
  utensils: UtensilsCrossed,
  bike: Bike,
  flower: Flower2,
};

export function getIcon(name) {
  return ICON_MAP[name] ?? Briefcase;
}

export function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
