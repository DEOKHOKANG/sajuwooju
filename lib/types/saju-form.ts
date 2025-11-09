/**
 * 사주 입력 폼 타입 정의
 */

import { FortuneCategory } from "@/lib/prompts";

export interface SajuFormData {
  // Step 1: Category
  category: FortuneCategory;

  // Step 2: Basic Info
  name: string;
  gender: "male" | "female";

  // Step 3: Birth Date
  birthDate: string; // YYYY-MM-DD
  isLunar: boolean;

  // Step 4: Birth Time
  birthTime: string; // HH:MM
}

export interface CompatibilityFormData {
  // Step 1: Category (always 'compatibility')
  category: "compatibility";

  // Step 2: Person 1
  person1: {
    name: string;
    gender: "male" | "female";
    birthDate: string;
    birthTime: string;
    isLunar: boolean;
  };

  // Step 3: Person 2
  person2: {
    name: string;
    gender: "male" | "female";
    birthDate: string;
    birthTime: string;
    isLunar: boolean;
  };
}

export type FormStep = 1 | 2 | 3 | 4;

export interface StepConfig {
  step: FormStep;
  title: string;
  description: string;
}
