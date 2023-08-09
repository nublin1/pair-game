import { Card } from './Card.js';

export class AmazingCard extends Card {
  constructor(container, identifier, flipHandler, imageSrc) {
    super(container, identifier, flipHandler);

    this.imageSrc = String(imageSrc);
    this.createImage();
  }

  createImage() {
    this.childSpan.innerHTML = '';

    this.childSpan = document.createElement('img');
    this.childSpan.classList.add('flipped');
    this.childSpan.src = this.imageSrc;
    this.childSpan.onerror = () => {
      this.childSpan.src = './img/default.png';
      throw new Error('Image load failed: ' + this.imageSrc);
  }

    this.cardElement.append(this.childSpan);
    this.container.append(this.cardElement);
  }

  set imageSrc(src) {
    this._imageSrc = src;
  }

  get imageSrc() {
    return this._imageSrc;
  }

  // flip() {
  //   this.childSpan.classList.toggle('flipped');
  // }
}
