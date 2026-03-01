import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './registration.component.html',
})
export class RegistrationComponent {
  model: User = {
    name: '',
    email: '',
    phone: '',
    userType: '',
  };

  loading = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  /** Allow only digits and max 10 characters in phone */
  onPhoneInput(): void {
    const digits = this.model.phone.replace(/\D/g, '').slice(0, 10);
    this.model.phone = digits;
  }

  constructor(private userService: UserService) {}

  onSubmit() {
    this.successMessage.set(null);
    this.errorMessage.set(null);
    this.loading.set(true);

    this.userService.register(this.model).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Registration successful! We will be in touch soon.');
        this.model = { name: '', email: '', phone: '', userType: '' };
      },
      error: (err) => {
        this.loading.set(false);
        const body = err?.error;
        const msg = (typeof body === 'object' && body?.message) || (typeof body === 'string' ? body : null) || err?.message || 'Registration failed. Please try again.';
        this.errorMessage.set(msg);
      },
    });
  }
}
