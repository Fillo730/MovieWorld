import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  constructor(private messageService: MessageService) {}

  success(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Successo',
      detail: message,
      life: 2000
    });
  }

  error(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Errore',
      detail: message,
      life: 2000
    });
  }
}