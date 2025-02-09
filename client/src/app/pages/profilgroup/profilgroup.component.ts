import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profilgroup',
  imports: [CommonModule, FormsModule],
  templateUrl: './profilgroup.component.html',
  styleUrl: './profilgroup.component.css'
})
export class ProfilgroupComponent implements OnInit {
  userId: number | null = null;
  groupId: number | null = null;

  groupName!: string;
  users: any[] = [];
  newGroupName: string = '';  // Variable pour le nouveau nom du groupe

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('id');
      if (userId) {
        this.userId = +userId;
        console.log('User ID from URL:', this.userId);
      }

      const groupId = params.get('idGroup');
      if (groupId) {
        this.groupId = +groupId;
        console.log('Group ID from URL:', this.groupId);
        this.loadGroupData();
      } else {
        console.error('Group ID is missing or invalid');
      }
    });
  }

  loadGroupData() {
    if (this.groupId !== null) {
      this.adminService.getGroup(this.groupId).subscribe((response: any) => {
        this.groupName = response[0].name;
      });

      this.adminService.getUsersInGroup(this.groupId).subscribe((response: any) => {
        this.users = response.users;
      });
    } else {
      console.error('Group ID is null, cannot fetch group data');
    }
  }

  addUserToGroup(userName: string) {
    if (this.groupId !== null) {
      this.adminService.addUserToGroup(this.groupId, userName).subscribe(() => {
        this.loadGroupData();
      });
    }
  }

  removeUserFromGroup(userId: number) {
    if (this.groupId !== null) {
      this.adminService.removeUserFromGroup(this.groupId, userId).subscribe(() => {
        this.loadGroupData();
      });
    }
  }

  updateGroupName() {
    if (this.groupId !== null && this.newGroupName.trim()) {
      this.adminService.updateGroupName(this.groupId, this.newGroupName).subscribe(() => {
        this.groupName = this.newGroupName;  // Mettre à jour le nom du groupe localement
        this.newGroupName = '';  // Réinitialiser le champ de saisie
      });
    } else {
      console.error('Group ID is null or new group name is empty');
    }
  }

  getHummerClass(hummer: number): string {
    if (hummer >= 1 && hummer <= 34) {
      return 'hummer-low';  // Rouge
    } else if (hummer >= 35 && hummer <= 67) {
      return 'hummer-medium';  // Orange
    } else if (hummer >= 68 && hummer <= 100) {
      return 'hummer-high';  // Vert
    }
    return '';
  }
  
  getCallStatusClass(callStatus: boolean): string {
    return callStatus ? 'call-active' : 'call-inactive';
  }

  goToAdminPage(): void {
    if (this.userId) {
      this.router.navigate([`/admin/${this.userId}`]);
    }
  }
  
  goToManageUserPage(): void {
    if (this.userId) {
      this.router.navigate([`/manageuser/${this.userId}`]);
    }
  }  
}
