import enquirer from "enquirer";

export class MemoPreparation {
  referencePrompt(memos) {
    return new enquirer.Select({
      name: "memo",
      message: "Choose a memo you want to see:",
      footer() {
        const lines = memos[this.index].lines.join("\n");
        return `\n${lines}`;
      },

      choices: memos.map((memo) => memo.lines[0]),
      result() {
        return memos[this.index].lines.join("\n");
      },
    });
  }

  deletePrompt(memos) {
    return new enquirer.Select({
      name: "memo",
      message: "Choose a memo you want to delete:",
      footer() {
        const lines = memos[this.index].lines.join("\n");
        return `\n${lines}`;
      },
      choices: memos.map((memo) => memo.lines[0]),
      result() {
        return memos[this.index].lines.join("\n");
      },
    });
  }
}
