import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MissionService } from '@core/services/mission.service';
import { UserService } from '@core/services/user.service';
import { Mission } from '@core/models/mission.model';
import { User } from '@core/models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  private readonly _missionService = inject(MissionService);
  private readonly _userService = inject(UserService);

  currentTab = signal<'challenges' | 'users'>('challenges');
  modalType = signal<'challenge' | 'user'>('challenge');

  isModalOpen = signal(false);
  isSubmitting = signal(false);

  newMission: Partial<Mission> = { name: '', level: 'Facile' };
  newUser: any = { username: '', email: '', role: 'user', password: '' };

  challenges = this._missionService.missions;
  users = this._userService.users;

  ngOnInit(): void {
    this._missionService.GetAll();
    this._userService.GetAll();
  }

  setTab(tab: 'challenges' | 'users') {
    this.currentTab.set(tab);
  }

  deleteItem(type: string, id: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    if (type === 'challenge') {
      this._missionService.Remove(id);
    } else if (type === 'user') {
      this._userService.Remove(id);
    }
  }

  addItem(type: string) {
    this.isModalOpen.set(true);

    if (type === 'challenge') {
      this.modalType.set('challenge');
      this.newMission = { name: '', level: 'Facile' };
    } else if (type === 'user') {
      this.modalType.set('user');
      this.newUser = { username: '', email: '', role: 'user', password: '' };
    }
  }

  updateItem(type: string, id: number) {
    this.isModalOpen.set(true);

    if (type === 'challenge') {
      this.modalType.set('challenge');
      this.newMission = { ...this.challenges().find((m) => m.id === id) };
    } else if (type === 'user') {
      this.modalType.set('user');
      this.newUser = { ...this.users().find((u) => u.id === id), password: '' };
    }
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  async saveChallenge() {
    if (!this.newMission.name) return;

    this.isSubmitting.set(true);

    try {
      if (this.newMission.id != null && this.newMission.id > 0) {
        await this._missionService.Update(this.newMission.id, this.newMission as Mission);
      } else {
        await this._missionService.Add(this.newMission as Mission);
      }
      this.closeModal();
    } catch (error) {
      alert('Erreur lors de la création du défi.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async saveUser() {
    if (!this.newUser.username || !this.newUser.email) return;

    this.isSubmitting.set(true);

    try {
      if (this.newUser.id != null && this.newUser.id > 0) {
        await this._userService.Update(this.newUser.id, this.newUser);
      } else {
        await this._userService.Add(this.newUser);
      }
      this.closeModal();
    } catch (error) {
      alert('Erreur lors de la sauvegarde utilisateur.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}