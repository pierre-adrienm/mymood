import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { SupervisorComponent } from './pages/supervisor/supervisor.component';
import { StudentComponent } from './pages/student/student.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { ConfirmationComponent } from './pages/confirmation/confirmation.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ModifprofileComponent } from './pages/modifprofile/modifprofile.component';
import { FormationsComponent } from './pages/formations/formations.component';
import { UsergroupComponent } from './pages/usergroup/usergroup.component';
import { ProfilgroupComponent } from './pages/profilgroup/profilgroup.component';
import { ManageuserComponent } from './pages/manageuser/manageuser.component';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
    {path:'',component: LoginComponent},
    {path:'admin/:id',component: AdminComponent, canActivate: [AuthGuard]},
    {path:'admin/:id/profilegroup/:idGroup',component:ProfilgroupComponent,canActivate: [AuthGuard]},
    {path:'manageuser/:id',component:ManageuserComponent, canActivate: [AuthGuard]},
    {path:'supervisor/:id',component: SupervisorComponent, canActivate: [AuthGuard]},
    {path:'supervisor/:id/formations/:idFormations',component: FormationsComponent, canActivate: [AuthGuard]},
    {path:'supervisor/:id/formations/:idFormations/user/:idUser', component:UsergroupComponent, canActivate:[AuthGuard]},
    {path:'student/:id',component: StudentComponent, canActivate: [AuthGuard]},
    {path:'confirmation/:id',component: ConfirmationComponent, canActivate: [AuthGuard]},
    {path:'feedback/:id',component:FeedbackComponent, canActivate:[AuthGuard]},
    {path:'profile/:id',component:ProfileComponent,canActivate:[AuthGuard]},
    {path:'modifprofile/:id',component:ModifprofileComponent,canActivate:[AuthGuard]},
    {path:'unauthorized',component: UnauthorizedComponent}
];
