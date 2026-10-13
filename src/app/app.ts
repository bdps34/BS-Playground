import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { GlobalLoadingIndicator } from './core/layout/global-loading-indicator/global-loading-indicator';
import { UserMessages } from './core/layout/user-messages/user-messages';

@Component({
  selector: 'root',
  imports: [RouterOutlet, UserMessages, GlobalLoadingIndicator],
  templateUrl: './app.html',
})
export class App {}
