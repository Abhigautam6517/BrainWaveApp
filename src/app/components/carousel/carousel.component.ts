import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Course {
  title: string;
  description: string;
  imagePath: string;
  accentColor: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
})
export class CarouselComponent {
  onImgError(e: Event) {
    const el = e.target as HTMLImageElement;
    if (el) el.classList.add('img-failed');
  }

  courses = signal<Course[]>([
    {
      title: 'AI Basics',
      description: 'Introduction to artificial intelligence, machine learning concepts, and hands-on projects for beginners.',
      imagePath: 'assets/images/carousel/AIBasics.jpg',
      accentColor: 'course-accent-1',
    },
    {
      title: 'Coding for Students',
      description: 'Learn programming fundamentals with modern languages and build your first apps and games.',
      imagePath: 'assets/images/carousel/codingStudents.jpg',
      accentColor: 'course-accent-2',
    },
    {
      title: 'Future Tech Skills',
      description: 'Explore robotics, data science, and emerging technologies that shape tomorrow\'s world.',
      imagePath: 'assets/images/carousel/FutureTechskills.jpg',
      accentColor: 'course-accent-3',
    },
  ]);
}
