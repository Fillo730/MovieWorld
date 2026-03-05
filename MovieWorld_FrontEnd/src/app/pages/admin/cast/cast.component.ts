import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { UpdateCreateCastDialogComponent } from '../../../components/update-create-cast-dialog/update-create-cast-dialog.component';
import { CastFiltersComponent } from '../../../components/cast-filters/cast-filters.component';
import { CastListComponent } from "../../../components/cast-list/cast-list.component";
import { ToastService } from '../../../services/toast.service';
import { PersonService } from '../../../services/personService.service';
import { Person, Role } from '../../../models/Person.model';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';
import { PersonsFilter, DEFAULT_PERSONS_FILTERS } from '../../../models/filters/PersonsFilter.model';
import { scrollToTop } from '../../../utils/windowFunctions';
import { StateHandlerComponent } from '../../../components/state-handler/state-handler.component';

@Component({
  selector: 'cast-admin',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatIconModule, MatButtonModule, 
    MatChipsModule, MatDialogModule, CastFiltersComponent, 
    CastListComponent, StateHandlerComponent, TranslatePipe
  ],
  templateUrl: './cast.component.html',
  styleUrl: './cast.component.css'
})
export class CastAdminComponent implements OnInit {
  private personService = inject(PersonService);
  private dialog = inject(MatDialog);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);
  
  filteredCast: Person[] = [];
  totalCount: number = 0;
  filters: PersonsFilter = { ...DEFAULT_PERSONS_FILTERS };
  pageIndex: number = 0;
  pageSize: number = 20;
  isLoading: boolean = false;
  error: boolean = false;

  public lang = this.languageService.currentLanguage; 

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.error = false;
    
    this.personService.getPersons(this.pageIndex, this.pageSize, this.lang(), this.filters).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.filteredCast = response.data.items || [];
          this.totalCount = response.data.totalCount || 0;
        } else {
          this.error = true;
        }
        this.isLoading = false;
      },
      error: () => {
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  handlePageChange(event: any): void {
    this.pageIndex = event.page;
    this.pageSize = event.rows;
    this.loadData();
    scrollToTop();
  }

  onFilterChanged(newFilters: PersonsFilter): void {
    this.filters = newFilters;
    this.pageIndex = 0;
    this.loadData();
  }

  resetFilters(): void {
    this.filters = { ...DEFAULT_PERSONS_FILTERS };
    this.pageIndex = 0;
    this.loadData();
    this.toastService.success(this.translate.instant('Admin.CastPage.Messages.FiltersReset'));
  }

  updatePerson(personId: number): void {
    const person = this.filteredCast.find(p => p.personId === personId);
    const dialogRef = this.dialog.open(UpdateCreateCastDialogComponent, {
      width: '400px',
      data: {
        title: this.translate.instant('Admin.CastPage.Dialog.EditTitle'),
        successButtonLabel: this.translate.instant('Admin.CastPage.Buttons.Update'),
        cancelButtonLabel: this.translate.instant('Admin.CastPage.Buttons.Cancel'),
        person: { ...person }
      },
      panelClass: "dialog-with-theme"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.personService.updatePerson(result).subscribe(response => {
          if (response.success) {
            this.loadData();
            this.toastService.success(this.translate.instant('Admin.CastPage.Messages.UpdateSuccess', { name: result.name }));
          } else {
            this.toastService.error(this.translate.instant('Admin.CastPage.Messages.ErrorUpdate'));
          }
        });
      }
    });
  }

  deletePerson(personId: number): void {
    const person = this.filteredCast.find(p => p.personId === personId);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: this.translate.instant('Admin.CastPage.Dialog.DeleteTitle'),
        text: this.translate.instant('Admin.CastPage.Dialog.DeleteConfirm', { name: person?.fullName }),
        cancelButtonLabel: this.translate.instant('Admin.CastPage.Buttons.Cancel'),
        successButtonLabel: this.translate.instant('Admin.CastPage.Buttons.Delete'),
      },
      panelClass: "dialog-with-theme"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.personService.deletePerson(person?.personId ?? 0).subscribe(response => {
          if (response.success) {
            this.loadData();
            this.toastService.success(this.translate.instant('Admin.CastPage.Messages.DeleteSuccess'));
          } else {
            this.toastService.error(this.translate.instant('Admin.CastPage.Messages.ErrorDelete'));
          }
        });
      }
    });
  }

  addPerson(): void {
    const dialogRef = this.dialog.open(UpdateCreateCastDialogComponent, {
      width: '400px',
      data: {
        title: this.translate.instant('Admin.CastPage.Dialog.AddTitle'),
        successButtonLabel: this.translate.instant('Admin.CastPage.Buttons.Add'),
        cancelButtonLabel: this.translate.instant('Admin.CastPage.Buttons.Cancel'),
        person: { name: '', surname: '', imagePath: '', role: Role.Actor }
      },
      panelClass: "dialog-with-theme"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.personService.createPerson(result).subscribe(response => {
          if (response.success) {
            this.loadData();
            this.toastService.success(this.translate.instant('Admin.CastPage.Messages.AddSuccess', { name: result.name }));
          }else {
            this.toastService.error(this.translate.instant('Admin.CastPage.Messages.AddError'));
          }
        });
      }
    });
  }
}