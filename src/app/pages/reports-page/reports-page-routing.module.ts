import { ReportsPageComponent } from './reports-page.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: ReportsPageComponent,
        data: { shouldReuse: true, key: 'reports' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReportsPageRoutingModule {}
