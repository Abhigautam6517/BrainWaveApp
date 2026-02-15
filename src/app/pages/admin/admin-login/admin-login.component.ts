import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService, AdminLoginRequest } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './admin-login.component.html',
})
export class AdminLoginComponent {
  model: AdminLoginRequest = { email: '', password: '' };
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage.set(null);
    this.loading.set(true);
    this.auth.login(this.model).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.loading.set(false);
        const body = err?.error;
        const msg =
          (typeof body === 'object' && body?.message) ||
          (typeof body === 'string' ? body : null) ||
          err?.message ||
          'Login failed. Check email and password.';
        this.errorMessage.set(msg);
      },
    });
  }
}
