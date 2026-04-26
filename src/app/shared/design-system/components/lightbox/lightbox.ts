import { Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-lightbox',
  templateUrl: './lightbox.html',
  styleUrl: './lightbox.scss',
})
export class Lightbox {
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<Lightbox>);

  isDesktopPointer = window.matchMedia('(pointer: fine)').matches;

  activeIndex = signal(this.data.startIndex || 0);

  images = this.data.images;

  activeImage = computed(() => {
    return this.images[this.activeIndex()];
  });

  close() {
    this.dialogRef.close();
  }

  private touchStartX = 0;

  //#region Swiper (mobile)
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].clientX;
  }

  onTouchEnd(event: TouchEvent) {
    const delta = event.changedTouches[0].clientX - this.touchStartX;

    if (delta > 50) {
      this.prev();
    } else if (delta < -50) {
      this.next();
    }
  }

  next() {
    this.activeIndex.set((this.activeIndex() + 1) % this.images.length);
  }

  prev() {
    this.activeIndex.set(
      (this.activeIndex() - 1 + this.images.length) % this.images.length
    );
  }
  //#endregion

  //#region Zoom Lens logic
showLens = signal(false);

lensPosition = signal({ x: 0, y: 0 });

backgroundPosition = signal('0% 0%');

zoom = 2;

onLensMove(event: MouseEvent) {
  const container = event.currentTarget as HTMLElement;
  const rect = container.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const percentX = x / rect.width;
  const percentY = y / rect.height;

  this.lensPosition.set({
    x: x - 50,
    y: y - 50
  });

  this.backgroundPosition.set(
    `${percentX * 100}% ${percentY * 100}%`
  );

  this.showLens.set(true);
}

hideLens() {
  this.showLens.set(false);
}
  //#endregion
}