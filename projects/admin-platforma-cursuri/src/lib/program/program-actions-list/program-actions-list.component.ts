import {Component} from '@angular/core';
import {AgFrameworkComponent} from 'ag-grid-angular';
import {BaseColDefParams} from 'ag-grid-community/dist/lib/entities/colDef';
import {MatDialog} from '@angular/material/dialog';
import {ToastService} from 'angular-toastify';
import {AuthService} from '../../../../../auth/src/lib/services/auth';
import {ProgramService} from '../../services/program';
import {Program} from '../../../../../common/program';
import {ProgramEditComponent} from '../program-edit/program-edit.component';

@Component({
  selector: 'lib-program-actions-list',
  templateUrl: './program-actions-list.component.html',
  styleUrls: ['./program-actions-list.component.scss']
})
export class ProgramActionsListComponent implements AgFrameworkComponent<BaseColDefParams> {

  constructor(private dialog: MatDialog,
              private programService: ProgramService,
              private toastService: ToastService) { }

  program: Program;

  agInit(params: BaseColDefParams): void {
    this.program = params.data;
  }

  edit(): void {
    this.dialog.open(ProgramEditComponent,
      {
        data: this.program,
        disableClose: true
      });
  }

  async delete(): Promise<void> {
    if (window.confirm(`Esti sigur că vrei să stergi pretul ${this.program.category}?`))
    {
      try {
        this.programService.programRemove(this.program.slug);

      } catch (error) {
        this.toastService.error('Nu s-a putut șterge pretul!');
      }
    } else {

    }
  }
}
