import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ChatHistorySummary } from '../models/chat-history-summary.model';
import { Conversation } from '../models/conversation.model';

@Injectable({ providedIn: 'root' })
export class ChatHistoryService {
  private http = inject(HttpClient);

  async getAllConversations() {
    return await firstValueFrom(this.http.get<ChatHistorySummary[]>('/api/get-chat-history'));
  }

  async getConversationById(id: string) {
    return await firstValueFrom(
      this.http.get<Conversation>(`/api/get-chat-conversation/${id}`)
    );
  }
}
