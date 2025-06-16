import { $ } from '@/utils';

export type ToastProps = {
  message: string;
  duration?: number;
};

export default class Toast2 {
  private readonly $root = document.createElement('div');

  constructor({ message, duration = 3000 }: ToastProps) {
    this.$root.innerText = message;
    this.$root.classList.add('toast', 'fade');

    this.$root.addEventListener('animationend', () => {
      this.$root.classList.remove('fade');

      setTimeout(() => {
        this.$root.classList.add('fade', 'dispose');
        this.$root.addEventListener('animationend', () => {
          this.$root.remove();
        });
      }, duration);
    });
  }

  getRoot() {
    return this.$root;
  }

  static create(message: string, duration?: number) {
    const toast = new Toast2({ message, duration });
    $('#toast').append(toast.getRoot());
    return toast;
  }
}
