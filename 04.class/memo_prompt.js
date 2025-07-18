import enquirer from "enquirer";

export class MemoPrompt {
  async selectMemo(memos, execution) {
    const prompt = new enquirer.Select({
      name: "memo",
      message: `Choose a memo you want to ${execution}:`,
      footer() {
        const lines = memos[this.index].lines.join("\n");
        return `\n${lines}`;
      },
      choices: memos.map((memo) => memo.lines[0]),
      result() {
        return memos[this.index];
      },
    });

    return await prompt.run();
  }
}
