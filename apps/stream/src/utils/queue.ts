import * as crypto from 'node:crypto';
import EventEmitter from 'node:events';

export enum QueueEvent {
  ENQUEUE = 'enqueue',
  DEQUEUE = 'dequeue',
}

type QueueEventMap<T> = {
  [QueueEvent.ENQUEUE]: [value: T];
  [QueueEvent.DEQUEUE]: [];
};

// Node 클래스: 각 요소를 표현하는 링크드 리스트 노드
class Node<T> {
  id: string;
  value: T;
  next: Node<T> | null = null;

  constructor(value: T) {
    this.id = crypto.randomUUID();
    this.value = value;
  }
}

// Queue 클래스: 링크드 리스트 기반의 큐
export default class Queue<T> extends EventEmitter<QueueEventMap<T>> {
  private head: Node<T> | null = null; // 헤드 포인터 (dequeue 시 사용)
  private tail: Node<T> | null = null; // 테일 포인터 (enqueue 시 사용)
  private length: number = 0; // 큐의 크기 추적

  // 큐에 요소 추가 (테일에 추가)
  enqueue(value: T): void {
    const newNode = new Node(value); // 새 노드 생성
    if (this.tail) {
      this.tail.next = newNode; // 테일 노드의 다음을 새 노드로 설정
    }
    this.tail = newNode; // 테일을 새 노드로 갱신

    // 큐가 비어있으면 헤드도 새 노드로 설정
    if (!this.head) {
      this.head = newNode;
    }
    this.length++;

    console.debug(QueueEvent.ENQUEUE, value);
    this.emit(QueueEvent.ENQUEUE, value);
  }

  // 큐의 첫 번째 요소 제거 (헤드에서 제거)
  dequeue(): T | undefined {
    if (!this.head) return undefined; // 큐가 비어있으면 undefined 반환

    const value = this.head.value; // 헤드 값 저장
    this.head = this.head.next; // 헤드를 다음 노드로 이동

    // 큐가 비게 되면 테일도 null로 설정
    if (!this.head) {
      this.tail = null;
    }
    this.length--;

    this.emit(QueueEvent.DEQUEUE);
    console.debug(QueueEvent.DEQUEUE, value);

    return value;
  }

  // 큐의 첫 번째 요소를 반환 (제거하지 않음)
  peek(): T | undefined {
    return this.head?.value;
  }

  // 큐가 비어있는지 확인
  isEmpty(): boolean {
    return this.length === 0;
  }

  // 큐의 크기 반환
  size(): number {
    return this.length;
  }

  // 큐 초기화
  clear(): void {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
}
