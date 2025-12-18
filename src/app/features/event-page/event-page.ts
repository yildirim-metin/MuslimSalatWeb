import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserRole } from '@core/enums/user-role.enum';
import { Event } from '@core/models/event.model';
import { AuthService } from '@core/services/auth.service';
import { EventService } from '@core/services/event.service';

@Component({
  selector: 'app-event-page',
  imports: [FormsModule],
  templateUrl: './event-page.html',
  styleUrl: './event-page.scss',
})
export class EventPage implements OnDestroy {
  private readonly _eventService = inject(EventService);
  private readonly _authService = inject(AuthService);

  public isAdmin = computed(() => this._authService.role() === UserRole.Admin);

  public events = this._eventService.events;

  public isModalOpen = signal<boolean>(false);
  public isSubmitting = signal<boolean>(false);
  public modalType = signal<'create' | 'update'>('create');

  public currentEvent: Partial<Event> = this.resetEvent();

  public message = signal<string>('');
  public messageIntervalId = 0;
  public isMessageError = signal<boolean>(false);

  constructor() {
    this._eventService.getAll();
  }

  ngOnDestroy(): void {
    if (this.messageIntervalId > 0) {
      clearInterval(this.messageIntervalId);
    }
  }

  public onAddEvent() {
    this.currentEvent = this.resetEvent();
    this.modalType.set('create');
    this.isModalOpen.set(true);
  }

  public onUpdateEvent(e: Event) {
    this.currentEvent = { ...e };
    this.modalType.set('update');
    this.isModalOpen.set(true);
  }

  public onDeleteEvent(id: number) {
    if (!id) return;
    if (confirm('Confirmer la suppression ?')) {
      this._eventService.remove(id);
    }
  }

  public closeModal() {
    this.isModalOpen.set(false);
    this.currentEvent = this.resetEvent();
  }

  public async saveEvent() {
    this.isSubmitting.set(true);
    try {
      if (!this.currentEvent.name) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
      }

      const payload = this.currentEvent as Event;
      payload.idUserResponsible = this._authService.idUser();

      if (this.modalType() === 'create') {
        this._eventService.add(payload);
      } else {
        this._eventService.update(payload.id, payload);
      }

      this.closeModal();
      this._eventService.getAll();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private resetEvent(): Partial<Event> {
    return { name: '', responsible: undefined };
  }

  public async onSubscribeEvent(idEvent: number) {
    try {
      await this._eventService.subscribe(this._authService.idUser(), idEvent);
      this.isMessageError.set(false);
      this.message.set('Inscription réussie !');
    } catch (error) {
      this.isMessageError.set(true);
      this.message.set('Vous êtes déjà inscrit à cet évènement');
    }

    if (this.messageIntervalId > 0) {
      clearInterval(this.messageIntervalId);
    }

    this.messageIntervalId = setInterval(() => {
      this.message.set('');
    }, 1000);
  }

  currentUserId(): number {
    return this._authService.idUser();
  }
}
