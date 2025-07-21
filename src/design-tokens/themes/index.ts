import type { SectorThemes } from '../types';
import { publicTheme } from './public';
import { healthTheme } from './health';
import { educationTheme } from './education';
import { medicalTheme } from './medical';
import { productivityTheme } from './productivity';
import { enterpriseTheme } from './enterprise';

export const sectorThemes: SectorThemes = {
  public: publicTheme,
  health: healthTheme,
  education: educationTheme,
  medical: medicalTheme,
  productivity: productivityTheme,
  enterprise: enterpriseTheme,
};

export * from './public';
export * from './health';
export * from './education';
export * from './medical';
export * from './productivity';
export * from './enterprise';