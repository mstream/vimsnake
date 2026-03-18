export interface FoodPosition {
  x: number;
  y: number;
}

export interface FoodState {
  position: FoodPosition | null;
}