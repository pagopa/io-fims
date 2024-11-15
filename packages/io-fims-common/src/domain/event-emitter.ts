export interface EventEmitter<T> {
  emit(event: T): Promise<void>;
}
