import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Lightbox } from '../lightbox/lightbox';

export interface GalleryImage {
  url: string;
  alt?: string;
}

export interface ProductGalleryInput {
  images?: GalleryImage[];
  variantImages?: GalleryImage[];
}

@Component({
  selector: 'app-product-gallery',
  imports: [],
  templateUrl: './product-gallery.html',
  styleUrl: './product-gallery.scss',
})
export class ProductGallery {
  private dialog = inject(MatDialog);

  images = input<GalleryImage[]>([]);
  variantImages = input<GalleryImage[]>([]);

  activeIndex = signal(0);
  activeImage = computed<GalleryImage>(() => {
    const images = this.resolvedImages();
    const index = this.activeIndex();

    return images[index] ?? images[0];
  });

  resolvedImages = computed<GalleryImage[]>(() => {
    const variant = this.variantImages();
    const base = this.images();

    if (variant.length) return variant;
    if (base.length) return base;

    return [{
      url: 'fallback.png',
      alt: 'fallback'
    }];
  });

  constructor() {
    effect(() => {
      const images = this.resolvedImages();

      if (this.activeIndex() >= images.length) {
        this.activeIndex.set(0);
      }
    });
  }
  select(index: number) {
    this.activeIndex.set(index);
  }

  //#region Lightbox

  openLightbox() {
    this.dialog.open(Lightbox, {
      data: {
        images: this.resolvedImages(),
        startIndex: this.activeIndex()
      },
      panelClass: 'lightbox-panel',
      backdropClass: 'lightbox-backdrop'
    });
  }
  //#endregion

  //#region Swiper (mobile)
  private touchStartX = 0;
  private touchStartY = 0;
  private isSwiping = false;

  onTouchStart(event: TouchEvent) {
    const touch = event.changedTouches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.isSwiping = true;
  }

  onTouchEnd(event: TouchEvent) {
    if (!this.isSwiping) return;

    const touch = event.changedTouches[0];

    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;

    // 🔥 evita conflito com scroll vertical
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    const threshold = 50;

    if (deltaX > threshold) {
      this.prev();
    } else if (deltaX < -threshold) {
      this.next();
    }

    this.isSwiping = false;
  }

  next() {
    const images = this.resolvedImages();
    this.activeIndex.set((this.activeIndex() + 1) % images.length);
  }

  prev() {
    const images = this.resolvedImages();
    this.activeIndex.set(
      (this.activeIndex() - 1 + images.length) % images.length
    );
  }
  //#endregion
}
