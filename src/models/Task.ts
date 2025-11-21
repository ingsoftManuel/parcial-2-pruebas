 export interface Task {
  id?: number;
  title: string;
  description?: string;
  is_completed: boolean;
  user_id: number;
}
