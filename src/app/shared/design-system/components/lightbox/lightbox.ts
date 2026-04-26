import { Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-lightbox',
  template: `
<div 
  class="lightbox"
  (click)="close()"
  (touchstart)="onTouchStart($event)"
  (touchend)="onTouchEnd($event)"
>

  @if (activeImage(); as img) {
    <img 
      [src]="img.url"
      (click)="$event.stopPropagation()"
    />
  }

  <!-- BOTÃO FECHAR -->
  <button class="close-btn" (click)="close()">✕</button>

  <!-- SETAS -->
  @if (images.length > 1) {
    <button class="nav prev" (click)="prev(); $event.stopPropagation()">‹</button>
    <button class="nav next" (click)="next(); $event.stopPropagation()">›</button>
  }

  <!-- DOTS -->
  @if (images.length > 1) {
    <div class="dots">
      @for (img of images; track img.url; let i = $index) {
        <span 
          [class.active]="i === activeIndex()"
          (click)="activeIndex.set(i); $event.stopPropagation()"
        ></span>
      }
    </div>
  }

</div>
  `,
  styles: [`
    .lightbox {
  display: flex;
  justify-content: center;
  align-items: center;
}


/* NAV */
.nav {
  display: flex;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  align-items: center;
  justify-content: center;
  font-size: 48px;
  width: 48px;
  height: 48px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.nav.prev { left: 20px; }
.nav.next { right: 20px; }

/* DOTS */
.dots {
  position: absolute;
  bottom: 20px;
  display: flex;
  gap: 6px;
}

.dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  cursor: pointer;
}

.dots span.active {
  background: white;
}

    img {
      max-width: 90vw;
      max-height: 90vh;
      border-radius: 12px;
      animation: fadeIn 0.25s ease;
      will-change: transform, opacity;

    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }

    .close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 24px;
      background: none;
      border: none;
      color: white;
      cursor: pointer;
    }

  `]
})
export class Lightbox {
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<Lightbox>);

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
}