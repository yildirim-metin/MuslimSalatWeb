import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- Interfaces pour typer nos données ---
interface Challenge { id: number; title: string; active: boolean; }
interface Verse { id: number; surah: string; number: number; text: string; }
interface User { id: number; username: string; email: string; role: 'admin' | 'user'; }

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss' // Vérifie si ton fichier est bien .scss ou .css
})
export class Admin {

  // --- SIGNALS (État) ---

  // Signal pour gérer l'onglet actif
  currentTab = signal<'challenges' | 'verses' | 'users'>('challenges');

  // Données de démo (Mock Data)
  challenges = signal<Challenge[]>([
    { id: 1, title: 'Appelle un proche', active: true },
    { id: 2, title: 'Faire une aumône', active: false },
    { id: 3, title: 'Lire Sourate Al-Kahf', active: false },
  ]);

  verses = signal<Verse[]>([
    { id: 1, surah: 'Ash-Sharh', number: 6, text: 'A côté de la difficulté est, certes, une facilité.' },
    { id: 2, surah: 'Al-Baqarah', number: 286, text: 'Allah n\'impose à aucune âme une charge supérieure à sa capacité.' },
  ]);

  users = signal<User[]>([
    { id: 1, username: 'Amine', email: 'amine@example.com', role: 'admin' },
    { id: 2, username: 'Karim', email: 'karim@test.com', role: 'user' },
    { id: 3, username: 'Sara', email: 'sara@test.com', role: 'user' },
  ]);

  // --- ACTIONS (Méthodes) ---

  // Changer d'onglet
  setTab(tab: 'challenges' | 'verses' | 'users') {
    this.currentTab.set(tab);
  }

  // Supprimer un élément
  deleteItem(type: string, id: number) {
    // Confirmation simple
    if(!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
    
    // Logique de suppression selon le type
    if (type === 'challenge') {
      this.challenges.update(list => list.filter(c => c.id !== id));
    } else if (type === 'verse') {
      this.verses.update(list => list.filter(v => v.id !== id));
    } else if (type === 'user') {
      this.users.update(list => list.filter(u => u.id !== id));
    }
  }

  // Ajouter un élément (Placeholder)
  addItem(type: string) {
    alert(`Fonctionnalité d'ajout pour ${type} (À implémenter avec un Modal)`);
  }
}