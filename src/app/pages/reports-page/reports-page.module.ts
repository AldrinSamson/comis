import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsPageRoutingModule } from './reports-page-routing.module';
import { ReportsPageComponent , editIncidentDialog , pdfAuditDialog , pdfTransactionDialog } from './reports-page.component';
import { MaterialModule } from '../../material.module'; 
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
    entryComponents: [
        editIncidentDialog,
        pdfAuditDialog,
        pdfTransactionDialog
    ],
    declarations: [
        ReportsPageComponent,
        editIncidentDialog,
        pdfAuditDialog,
        pdfTransactionDialog
    ],
    imports: [CommonModule, ReportsPageRoutingModule , MaterialModule ,  SweetAlert2Module.forRoot()],
})
export class ReportsPageModule {}
