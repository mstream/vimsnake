export type GameStatus = 'playing' | 'game-over';

export type CollisionType = 'boundary' | 'self';

export interface GridBounds {
  minimumX: number;
  maximumX: number;
  minimumY: number;
  maximumY: number;
}

export interface CollisionResult {
  hasCollision: boolean;
  collisionType: CollisionType | null;
}