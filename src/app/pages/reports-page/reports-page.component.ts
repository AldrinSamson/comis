import { Component, OnInit, Inject  } from '@angular/core';
import { DataService } from '../../core/services/genericCRUD/data.service';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef ,MatDialogConfig ,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators , FormControl } from '@angular/forms';

import { Transaction } from '../../core/models/Transaction';
import { Incident } from '../../core/models/Incident';

@Component({
    selector: 'app-reports-page',
    templateUrl: './reports-page.component.html',
    styleUrls: ['./reports-page.component.scss'],
})
export class ReportsPageComponent implements OnInit {
    incident : any;
    incidentRaw : Incident[] = [];
    displayedColumns : string[] = ['date' , 'bID' ,'bName', 'itemID'];
  
    constructor(
      public DS: DataService,
      public dialog: MatDialog,
    ) { }
  
    ngOnInit() {
      this.readIncident();
    }
  
    async readIncident() {
      const promise = this.DS.readPromise(Incident);
      const [res] = await Promise.all([promise]);
      this.incidentRaw = res;
      this.incident = new MatTableDataSource(this.incidentRaw);
    }
  
    openEditIncident(row){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        id : row._id,
        date : row.date,
        tID : row.tID,
        bID : row.bID,
        bName : row.bName,
        adminDescription : row.adminDescription,
        borrowerDescription : row.borrowerDescription
      }
  
      this.dialog.open(editIncidentDialog , dialogConfig).afterClosed().subscribe(result => {
        this.readIncident()
      });
    }
  
  }
  
  @Component({
    selector : 'edit-incident-dialog',
    templateUrl : './dialog/edit-incident-dialog.html',
    styleUrls: ['./reports-page.component.scss'],
  })
  
  export class editIncidentDialog implements OnInit {
  
    editIncidentForm : any;
    transactionRaw : Transaction[] = [];
    transaction : any;
    displayedColumns : string[] = ['itemID' , 'purpose' , 'dateBorrowed' ];
  
    constructor(
      public DS: DataService,
      public dialogRef: MatDialogRef<editIncidentDialog>,
      public fb: FormBuilder,
      @Inject(MAT_DIALOG_DATA) public data: any
      ) {
        this.editIncidentForm = this.fb.group({
          id : [data.id],
          adminDescription : [data.adminDescription],
          borrowerDescription : new FormControl({value: data.borrowerDescription, disabled: true}, Validators.required),
        })
      }
  
    ngOnInit() {
      this.readTransaction();
    } 
    
    async readTransaction() {
      let query = "id=" + this.data.tID;
      let type = "get";
      const promise = this.DS.readPromise(Transaction , type , query);
      const [res] = await Promise.all([promise]);
      this.transactionRaw.push(res);
      this.transaction = new MatTableDataSource(this.transactionRaw);
    }
  
    submitEditIncidentForm() {
      if (this.editIncidentForm.valid){
        this.DS.updatePromise(Incident , this.editIncidentForm.value);
        this.dialogRef.close();
      }
      
    }
  
    onNoClick(): void {
      this.dialogRef.close();
      }  
  }
