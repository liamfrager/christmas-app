import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { ImageFetchService } from '../../services/image-fetch.service';
import { RefreshService } from '../../services/refresh.service';

@Component({
  selector: 'app-image-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.css'
})
export class ImagePreviewComponent implements OnChanges{
  constructor(private imageFetchService: ImageFetchService) {}
  @Input({required: true}) url: string | undefined = undefined;
  imageUrl: string | null = null;

  ngOnChanges() {
    this.imageUrl = null;
    this.reloadImage();
  }

  @RefreshService.onRefresh()
  reloadImage() {
    if (this.url) {
        this.imageFetchService.getImageFromUrl(this.url).subscribe({
        next: (imageUrl) => {
          this.imageUrl = imageUrl;
        },
        error: (error) => {
          console.error('Error fetching image:', error);
          this.imageUrl = null;
        }
      });
    }
  }
}
