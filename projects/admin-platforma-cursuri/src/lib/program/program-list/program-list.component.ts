import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {ColDef} from 'ag-grid-community';
import {ProgramService} from '../../services/program';
import {Program} from '../../../../../common/program';
import {ProgramActionsListComponent} from '../program-actions-list/program-actions-list.component';
import {ProgramEditComponent} from '../program-edit/program-edit.component';

@Component({
  selector: 'lib-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.scss']
})
export class ProgramListComponent implements OnInit, OnDestroy {

  constructor(private programService: ProgramService,
              private dialog: MatDialog) { }


  programSubscription: Subscription;
  programs: Program[] = [];

  defaultColDef: ColDef = {
    resizable: true
  };

  columnDefs = [
    {
      headerName: 'Categorie',
      field: 'category',
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: 'Activ',
      field: 'status',
      width: 100,
      valueFormatter: params => {
        if (params.data) {
          if (params.data.status) {
            return 'Activ';
          }
          return 'Inactiv';
        }
        return '-';
      }
    },
    {
      headerName: 'Interval',
      field: 'interval',
      width: 150,
    },
    { headerName: 'Actions',
      flex: 1,
      cellRendererFramework: ProgramActionsListComponent
    }
  ];

  rowData: any;

  authSubscription: Subscription;
  token: string = '';

  ngOnInit(): void {
    this.loadPrograms();
  }

  loadPrograms(): void {
    this.programService.getPrograms();
    this.programSubscription = this.programService.getProgramListener()
      .subscribe(programs => {
        this.programs = programs;
        this.rowData =  this.programs;
      });
  }


  ngOnDestroy(): void {
    if (this.programSubscription) {
      this.programSubscription.unsubscribe();
    }
  }


  async create(): Promise<void> {
    const newProgram: Program = {
      createdAt: undefined,
      status: false,
      category: '',
      interval: '',
      slug: undefined,
      updatedAt: undefined,
      _v: null,
      _id: undefined
    };
    this.dialog.open(ProgramEditComponent, {
      data: newProgram,
      disableClose: true
    });
  }


}
