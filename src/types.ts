export interface User {
  email: string;
  name: string;
}

export interface Meal {
  id: number;
  description: string;
  date: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Full Week';
}

export interface NutrientAnalysis {
  nutrients: {
    name: string;
    amount: number;
    unit: string;
    status: 'deficit' | 'optimal' | 'excess';
  }[];
  recommendations: string[];
  summary: {
    assessment: 'Optimal' | 'Caution' | 'Critical';
    score: number;
    description: string;
  };
  totalCalories: number;
}
