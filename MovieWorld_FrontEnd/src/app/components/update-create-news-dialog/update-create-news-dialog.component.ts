import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, filter, finalize, switchMap, tap } from 'rxjs/operators';

import { News } from '../../models/News.model';
import { MovieService } from '../../services/movie.service';
import { PersonService } from '../../services/personService.service';
import { LanguageService } from '../../services/language.service';
import { Movie } from '../../models/Movie.model';
import { Person } from '../../models/Person.model';
import { DEFAULT_MOVIE } from '../../utils/validURLPath';

@Component({
  selector: 'app-update-create-news-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatAutocompleteModule, MatChipsModule, TranslateModule
  ],
  templateUrl: './update-create-news-dialog.component.html',
  styleUrl: './update-create-news-dialog.component.css'
})
export class UpdateCreateNewsDialogComponent implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly personService = inject(PersonService);
  private readonly languageService = inject(LanguageService);
  
  public newsUpdate!: News;
  public isLoading = false;
  public lang = this.languageService.currentLanguage;

  movieSearch = new FormControl<any>('');
  actorSearch = new FormControl<any>('');

  moviesQuered: Movie[] = [];
  actorsQuered: Person[] = [];

  constructor(
    public dialogRef: MatDialogRef<UpdateCreateNewsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.newsUpdate = { 
      ...this.data.news,
      relatedMovies: this.data.news.relatedMovies ? [...this.data.news.relatedMovies] : [],
      relatedActors: this.data.news.relatedActors ? [...this.data.news.relatedActors] : []
    };

    this.movieSearch.valueChanges.pipe(
      filter(val => typeof val === 'string' && val.length >= 2),
      debounceTime(400),
      tap(() => this.isLoading = true),
      switchMap(query => this.movieService.getMoviesByQuery(8, query, this.lang()).pipe(
        finalize(() => this.isLoading = false)
      ))
    ).subscribe(res => {
      if (res.success) this.moviesQuered = res.data;
    });

    this.actorSearch.valueChanges.pipe(
      filter(val => typeof val === 'string' && val.length >= 2),
      debounceTime(400),
      tap(() => this.isLoading = true),
      switchMap(query => this.personService.searchPeople(query).pipe(
        finalize(() => this.isLoading = false)
      ))
    ).subscribe(res => {
      if (res.success) this.actorsQuered = res.data;
    });
  }

  addMovie(movie: Movie): void {
    if (!this.newsUpdate.relatedMovies.find(m => m.movieId === movie.movieId)) {
      this.newsUpdate.relatedMovies.push(movie);
    }
    this.movieSearch.setValue('');
  }

  removeMovie(movieId: number): void {
    this.newsUpdate.relatedMovies = this.newsUpdate.relatedMovies.filter(m => m.movieId !== movieId);
  }

  addActor(person: Person): void {
    if (!this.newsUpdate.relatedActors.find(a => a.personId === person.personId)) {
      this.newsUpdate.relatedActors.push(person);
    }
    this.actorSearch.setValue('');
  }

  removeActor(personId: number): void {
    this.newsUpdate.relatedActors = this.newsUpdate.relatedActors.filter(a => a.personId !== personId);
  }

  getDefaultImage() : string {
    return DEFAULT_MOVIE;
  }

  onSave(): void {
    this.dialogRef.close(this.newsUpdate);
  }
}