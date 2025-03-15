export abstract class TextGenerator {
  static generator(length: number = 12) {
    const characters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&*';
    let generatedText = '';
    let randomIndex = 0;

    for (let i = 0; i < length; i++) {
      randomIndex = Math.floor(Math.random() * characters.length - 1);
      generatedText += characters[randomIndex];
    }

    return generatedText;
  }
}
