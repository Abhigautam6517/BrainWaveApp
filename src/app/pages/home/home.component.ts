import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CarouselComponent } from '../../components/carousel/carousel.component';

interface FocusArea {
  label: string;
  value: number;
  colorClass: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent,
    FooterComponent,
    CarouselComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('focusSection') focusSection?: ElementRef<HTMLElement>;

  readonly focusAreas: FocusArea[] = [
    { label: 'AI & Machine Learning', value: 35, colorClass: 'chart-fill-1' },
    { label: 'Coding & Development', value: 30, colorClass: 'chart-fill-2' },
    { label: 'Future Tech & Robotics', value: 25, colorClass: 'chart-fill-3' },
    { label: 'Data & Soft Skills', value: 10, colorClass: 'chart-fill-4' },
  ];

  percentValues = [0, 0, 0, 0];
  hasAnimated = false;
  private observer?: IntersectionObserver;
  private animationFrameIds: number[] = [];
  private readonly animationDuration = 1200;

  ngAfterViewInit(): void {
    const section = this.focusSection?.nativeElement;
    if (!section) {
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      this.percentValues = this.focusAreas.map((item) => item.value);
      this.hasAnimated = true;
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || this.hasAnimated) {
            return;
          }

          this.hasAnimated = true;
          this.startAnimations();
          this.observer?.disconnect();
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    this.observer.observe(section);
  }

  ngOnDestroy(): void {
    this.animationFrameIds.forEach((id) => cancelAnimationFrame(id));
    this.observer?.disconnect();
  }

  private startAnimations(): void {
    this.focusAreas.forEach((item, index) => {
      this.animateValue(index, item.value);
    });
  }

  private animateValue(index: number, target: number): void {
    const start = this.percentValues[index];
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / this.animationDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);

      this.percentValues[index] = current;

      if (progress < 1) {
        this.animationFrameIds[index] = requestAnimationFrame(step);
      } else {
        this.percentValues[index] = target;
      }
    };

    this.animationFrameIds[index] = requestAnimationFrame(step);
  }
}
