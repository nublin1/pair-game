import { Card } from "./Card.js";
import { AmazingCard } from "./AmazingCard.js";

class MemoryGame {
  constructor(container, settingsForm, startButton, timer) {
    this.container = document.getElementById(container);
    this.settingsForm = document.getElementById(settingsForm);
    this.startButton = document.getElementById(startButton);
    this.timer = document.getElementById(timer);
    this.useAmazingCards = true;
    //this.useAmazingCards = useAmazingCards;

    this.cards = [];
    this.flippedCards = [];
    this.matchedCards = [];
    this.evenArray = [];
    this.time = this.timer.textContent;
  }

  resetGame() {
    this.matchedCards = [];
    this.flippedCards = [];
    this.evenArray.length = 0;
  }

  createEvenArray(max) {
    for (let i = 1; i <= max; i++) {
      this.evenArray.push(i, i);
    }
  }

  shuffle() {
    for (let i = this.evenArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.evenArray[i], this.evenArray[j]] = [
        this.evenArray[j],
        this.evenArray[i],
      ];
    }
  }

  createGameField(size) {
    this.container.innerHTML = "";
    for (let i = 0; i < size * size; i++) {
      let card;
      if (this.useAmazingCards === true) {
        card = new AmazingCard(
          this.container,
          this.evenArray[i],
          this.flipCard.bind(this),
          `./img/${this.evenArray[i]}.png`
        );
      } else {
        card = new Card(
          this.container,
          this.evenArray[i],
          this.flipCard.bind(this)
        );
      }
      this.cards.push(card);
    }

    this.container.style.width = size * 62.5 + (10 * size + 10) + "px";
    this.container.style.height = size * 62.5 + (10 * size + 10) + "px";
  }

  startTimer() {
    clearInterval(this.time);
    let count = this.time;

    let intervalId = setInterval(() => {
      count--;
      //console.log(count);

      if (count < 0) {
        count = 0;
        this.timer.textContent = "Игра окончена";
        this.container.classList.add("hidden");
        this.settingsForm.classList.remove("hidden");
        clearInterval(intervalId); // останавливаем интервал
      } else if (this.matchedCards.length === this.evenArray.length) {
        clearInterval(intervalId); // останавливаем интервал
        this.timer.textContent = "Вы победили!";
        this.container.classList.add("hidden");
        this.settingsForm.classList.remove("hidden");
      } else {
        this.timer.textContent = "Оставшиеся время: " + count;
      }
    }, 1000); // интервал в 1 секунду (1000 миллисекунд)
  }

  flipCard(card) {
    if (
      this.flippedCards.length < 2 &&
      !this.flippedCards.includes(card) &&
      !this.matchedCards.includes(card)
    ) {
      card.flip();
      this.flippedCards.push(card);
      if (this.flippedCards.length === 2) {
        this.checkCard(this.flippedCards[0], this.flippedCards[1]);
      }
    }
  }

  checkCard(card1, card2) {
    if (card1.identifier === card2.identifier) {
      this.matchedCards.push(card1);
      this.matchedCards.push(card2);
      this.flippedCards = [];
    } else {
      setTimeout(() => {
        this.flippedCards.forEach((card) => {
          card.flip();
        });
        this.flippedCards = [];
      }, 500);
    }
  }

  init() {
    this.startButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.resetGame();
      this.settingsForm.classList.add("hidden");

      let value = this.settingsForm.querySelector("input").value;
      if (value < 2 || value > 10 || value % 2 !== 0) {
        value = 4;
      }

      this.createEvenArray((value * value) / 2);
      this.shuffle();
      this.createGameField(value);

      this.container.classList.remove("hidden");
      this.startTimer();
    });

    const numberRadio = document.getElementById("number");
    numberRadio.addEventListener("change", () => {
      if (numberRadio.checked) {
        console.log('Выбран тип "Числа"');
        this.useAmazingCards = false;
      }
    });
  }
}

const game = new MemoryGame("container", "game-settings", "start", "timer");
game.init();
