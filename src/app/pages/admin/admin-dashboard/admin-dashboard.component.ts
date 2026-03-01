import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, User, ChangePasswordRequest } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  users = signal<User[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  adminEmail = signal<string | null>(null);

  showChangePwd = signal(false);
  changePwdModel: ChangePasswordRequest = { currentPassword: '', newPassword: '' };
  changePwdConfirm = '';
  changePwdLoading = signal(false);
  changePwdSuccess = signal<string | null>(null);
  changePwdError = signal<string | null>(null);

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.adminEmail.set(this.auth.getAdminEmail());
    this.auth.getUsers().subscribe({
      next: (list) => {
        this.users.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || err?.message || 'Failed to load users.');
        this.loading.set(false);
      },
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }

  formatDate(d: string | undefined): string {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleString();
    } catch {
      return d;
    }
  }

  toggleChangePwd(): void {
    this.showChangePwd.update((v) => !v);
    this.changePwdSuccess.set(null);
    this.changePwdError.set(null);
    this.changePwdModel = { currentPassword: '', newPassword: '' };
    this.changePwdConfirm = '';
  }

  submitChangePwd(): void {
    this.changePwdError.set(null);
    this.changePwdSuccess.set(null);
    if (this.changePwdModel.newPassword.length < 6) {
      this.changePwdError.set('New password must be at least 6 characters.');
      return;
    }
    if (this.changePwdModel.newPassword !== this.changePwdConfirm) {
      this.changePwdError.set('New password and confirm do not match.');
      return;
    }
    this.changePwdLoading.set(true);
    this.auth.changePassword(this.changePwdModel).subscribe({
      next: () => {
        this.changePwdLoading.set(false);
        this.changePwdSuccess.set('Password changed successfully.');
        this.changePwdModel = { currentPassword: '', newPassword: '' };
        this.changePwdConfirm = '';
      },
      error: (err) => {
        this.changePwdLoading.set(false);
        const msg = err?.error?.message || err?.message || 'Failed to change password.';
        this.changePwdError.set(msg);
      },
    });
  }
}
