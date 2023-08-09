export class Card {
  constructor(container, identifier, flipHandler) {
    this.container = container;
    this.identifier = identifier;
    this.flipHandler = flipHandler;

    this.cardElement = null;
    this.childSpan = null;

    this.createElement();
  }

  createElement() {
    this.cardElement = document.createElement('div');
    this.cardElement.classList.add('card');
    this.cardElement.addEventListener('click', () => this.flipHandler(this));

    this.childSpan = document.createElement('span');
    this.childSpan.classList.add('flipped');
    this.childSpan.innerText = this.identifier;

    this.cardElement.append(this.childSpan);
    this.container.append(this.cardElement);
  }

  set identifier(number) {
    this._identifier = number;
  }

  get identifier() {
    return this._identifier;
  }

  flip() {
    this.childSpan.classList.toggle('flipped');
  }

  getElement() {
    return this.cardElement;
  }
}
