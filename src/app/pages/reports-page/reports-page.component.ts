import { Component, OnInit, Inject , ViewChildren, QueryList } from '@angular/core';
import { DataService } from '../../core/services/genericCRUD/data.service';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef ,MatDialogConfig ,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators , FormControl } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';

import { Transaction } from '../../core/models/Transaction';
import { Incident } from '../../core/models/Incident';
import { Audit } from 'src/app/core/models/Audit';

@Component({
    selector: 'app-reports-page',
    templateUrl: './reports-page.component.html',
    styleUrls: ['./reports-page.component.scss'],
})
export class ReportsPageComponent implements OnInit {
    incident : any;
    incidentRaw : Incident[] = [];
    displayedColumnsIncidents : string[] = ['date' , 'bID' ,'bName', 'itemID'];

    transaction : any;
    transactionRaw : Transaction [] = [];
    displayedColumnsTransaction : string[] = ['borrowerID' , 'itemID' , 'purpose' , 'dateBorrowed' , 'dateReturned' , 'hasIncident'];

    audit : any; 
    auditRaw : any;
    displayedColumnsAudit : string[] = ['date' , 'actionType' , 'actor'];
  
    constructor(
      public DS: DataService,
      public dialog: MatDialog,
    ) { }

    @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  
    ngOnInit() {
      this.readIncident();
      this.readTransaction();
      this.readAudit();
    }
  
    async readIncident() {
      const promise = this.DS.readPromise(Incident);
      const [res] = await Promise.all([promise]);
      this.incident = new MatTableDataSource(this.incidentRaw = res);
      this.incident.paginator = this.paginator.toArray()[1];
    }

    async readTransaction() {
      const promise = this.DS.readPromise(Transaction);
      const [res] = await Promise.all([promise]);
      this.transaction = new MatTableDataSource(this.transactionRaw = res);
      this.transaction.paginator = this.paginator.toArray()[0];
    }

    async readAudit(){
      const promise = this.DS.readPromise(Audit);
      const [res] = await Promise.all([promise]);
      this.audit = new MatTableDataSource(this.auditRaw = res);
      this.audit.paginator = this.paginator.toArray()[2];
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

    openPdfTransaction(){
      const dialogConfig = new MatDialogConfig();
      this.dialog.open(pdfTransactionDialog , dialogConfig).afterClosed().subscribe(result => {
      });
    }

    openPdfAudit(){
      const dialogConfig = new MatDialogConfig();
      this.dialog.open(pdfAuditDialog , dialogConfig).afterClosed().subscribe(result => {
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

  @Component({
    selector : 'pdf-transaction-dialog',
    templateUrl : './dialog/pdf-transaction-dialog.html',
    styleUrls: ['./reports-page.component.scss'],
  })
  
  export class pdfTransactionDialog implements OnInit {
  
  
    constructor(
      public DS: DataService,
      public dialogRef: MatDialogRef<pdfTransactionDialog>,
      public fb: FormBuilder,
      @Inject(MAT_DIALOG_DATA) public data: any
      ) {

      }
  
    ngOnInit() {
     
    } 
    
  
    onNoClick(): void {
      this.dialogRef.close();
      }  
  }

  @Component({
    selector : 'pdf-audit-dialog',
    templateUrl : './dialog/pdf-audit-dialog.html',
    styleUrls: ['./reports-page.component.scss'],
  })
  
  export class pdfAuditDialog implements OnInit {
  
    constructor(
      public DS: DataService,
      public dialogRef: MatDialogRef<pdfAuditDialog>,
      public fb: FormBuilder,
      @Inject(MAT_DIALOG_DATA) public data: any
      ) {

      }
  
    ngOnInit() {
    } 
  
    onNoClick(): void {
      this.dialogRef.close();
      }  
  }
