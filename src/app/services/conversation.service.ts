import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ContinueConversationResponse } from '../models/continue-conversation-response.model';
import { StartConversationResponse } from '../models/start-conversation-response.model';
import { SKIP_GLOBAL_LOADING } from './skip-global-loading.token';

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private http = inject(HttpClient);

  async startConversation(message: string) {
    return await firstValueFrom(
      this.http.post<StartConversationResponse>(
        '/api/start-conversation',
        { message },
        { context: new HttpContext().set(SKIP_GLOBAL_LOADING, true) }
      )
    );
  }

  async continueConversation(conversationId: string, message: string) {
    return await firstValueFrom(
      this.http.post<ContinueConversationResponse>(
        '/api/continue-conversation',
        { conversationId, message },
        { context: new HttpContext().set(SKIP_GLOBAL_LOADING, true) }
      )
    );
  }
}
