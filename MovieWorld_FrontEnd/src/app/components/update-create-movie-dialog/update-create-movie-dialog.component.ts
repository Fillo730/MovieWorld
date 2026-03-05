import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, filter, finalize, switchMap, tap } from 'rxjs/operators';

import { Person } from '../../models/Person.model';
import { DEFAULT_MOVIE } from '../../utils/validURLPath';
import { PersonService } from '../../services/persons.service';
import { Genre } from '../../models/Genre.model';
import { Movie } from '../../models/Movie.model';
import { Format } from '../../models/Format.model';

@Component({
  selector: 'app-update-create-movie-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, 
    MatIconModule, MatCheckboxModule, MatAutocompleteModule, MatChipsModule, TranslateModule
  ],
  templateUrl: './update-create-movie-dialog.component.html',
  styleUrl: './update-create-movie-dialog.component.css'
})
export class UpdateCreateMovieDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<UpdateCreateMovieDialogComponent>);
  private personService = inject(PersonService);

  movie: Movie;
  genres: Genre[] = [];
  formats: Format[] = [];
  selectedGenreIds: number[] = [];
  
  directorSearchCtrl = new FormControl('');
  actorSearchCtrl = new FormControl('');
  filteredDirectors: Person[] = [];
  filteredActors: Person[] = [];
  isLoading = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.genres = data.genres || [];
    this.formats = data.formats || [];
    
    this.movie = data.movie ? JSON.parse(JSON.stringify(data.movie)) : {
      movieId: 0,
      title: '',
      story: '',
      cost: 0,
      year: new Date().getFullYear(),
      genres: [],
      format: { id: this.formats[0]?.id || 0, name: '' },
      imagePath: null,
      trailerUrl: '',
      isCult: false,
      director: null,
      actors: []
    };

    if (this.movie.genres) {
      this.selectedGenreIds = this.movie.genres.map(g => g.id);
    }

    if (this.movie.director) {
      this.directorSearchCtrl.setValue(this.movie.director.fullName);
    }
  }

  ngOnInit() {
    this.directorSearchCtrl.valueChanges.pipe(
      filter(val => typeof val === 'string' && val.length >= 2),
      debounceTime(400),
      tap(() => this.isLoading = true),
      switchMap(query => this.personService.searchPeople(query ?? "").pipe(
        finalize(() => this.isLoading = false)
      ))
    ).subscribe(res => {
      if (res.success) this.filteredDirectors = res.data;
    });

    this.actorSearchCtrl.valueChanges.pipe(
      filter(val => typeof val === 'string' && val.length >= 2),
      debounceTime(400),
      tap(() => this.isLoading = true),
      switchMap(query => this.personService.searchPeople(query ?? "").pipe(
        finalize(() => this.isLoading = false)
      ))
    ).subscribe(res => {
      if (res.success) this.filteredActors = res.data;
    });
  }

  displayFn(person: any): string {
    return person && person.fullName ? person.fullName : (typeof person === 'string' ? person : '');
  }

  onGenreChange() {
    this.movie.genres = this.selectedGenreIds.map(id => {
      const foundGenre = this.genres.find(g => g.id === id);
      return { id: id, name: foundGenre ? foundGenre.name : '' };
    });
  }

  onDirectorSelected(event: MatAutocompleteSelectedEvent) {
    this.movie.director = event.option.value;
    this.directorSearchCtrl.setValue(this.movie.director?.fullName || '');
  }

  onActorSelected(event: MatAutocompleteSelectedEvent) {
    const actor = event.option.value;
    if (!this.movie.actors.some(a => a.personId === actor.personId)) {
      this.movie.actors.push(actor);
    }
    this.actorSearchCtrl.setValue('');
  }

  removeActor(personId: number) {
    this.movie.actors = this.movie.actors.filter(a => a.personId !== personId);
  }

  onSaveClick(): void {
    this.onGenreChange();
    const f = this.formats.find(x => x.id === Number(this.movie.format.id));
    if (f) this.movie.format.name = f.name;
    this.dialogRef.close(this.movie);
  }

  handleImageError(event: any) {
    event.target.src = DEFAULT_MOVIE;
  }

  onNoClick() {
    this.dialogRef.close();
  }
}