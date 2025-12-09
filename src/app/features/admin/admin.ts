import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MissionService } from '@core/services/mission.service';
import { Mission } from '@core/models/mission.model';

interface Challenge {
  id: number;
  title: string;
  active: boolean;
}
interface Verse {
  id: number;
  surah: string;
  number: number;
  text: string;
}
interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  // Créer un new service pour les USER et l'injecter ici
  private readonly _missionService = inject(MissionService);

  currentTab = signal<'challenges' | 'verses' | 'users'>('challenges');

  // --- Gestion de la Modale ---
  isModalOpen = signal(false);
  isSubmitting = signal(false);

  newMission: Partial<Mission> = {
    name: '',
    level: 'Facile',
  };

  // challenges utilise le signal de missionService
  challenges = this._missionService.missions;

  verses = signal<Verse[]>([
    {
      id: 1,
      surah: 'Ash-Sharh',
      number: 6,
      text: 'A côté de la difficulté est, certes, une facilité.',
    },
    {
      id: 2,
      surah: 'Al-Baqarah',
      number: 286,
      text: "Allah n'impose à aucune âme une charge supérieure à sa capacité.",
    },
  ]);

  // créer un service qui va contenir la liste de utilisation - VOIR missionService plus haut
  // users devrait utiliser le signal de userService (comme pour challenges)
  users = signal<User[]>([
    { id: 1, username: 'Amine', email: 'amine@example.com', role: 'admin' },
    { id: 2, username: 'Karim', email: 'karim@test.com', role: 'user' },
    { id: 3, username: 'Sara', email: 'sara@test.com', role: 'user' },
  ]);

  ngOnInit(): void {
    this._missionService.GetAll();
  }

  setTab(tab: 'challenges' | 'verses' | 'users') {
    this.currentTab.set(tab);
  }

  // modifier la ligne de code dans le if(user)
  deleteItem(type: string, id: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    if (type === 'challenge') {
      this._missionService.Remove(id);
    } else if (type === 'verse') {
      this.verses.update((list) => list.filter((v) => v.id !== id));
    } else if (type === 'user') {
      this.users.update((list) => list.filter((u) => u.id !== id));
    }
  }

  // ajouter un if(type === 'user')
  addItem(type: string) {
    if (type === 'challenge') {
      this.newMission = { name: '', level: 'Facile' };
      this.isModalOpen.set(true);
    }
  }

  // ajouter un if(type === 'user')
  updateItem(type: string, id: number) {
    if (type === 'challenge') {
      this.newMission = this.challenges().find((m) => m.id === id) ?? {};
      this.isModalOpen.set(true);
    }
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  // Meme méthode pour saveUser
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
}
