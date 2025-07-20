import enquirer from "enquirer";

export class MemoPrompt {
  async selectMemo(memos, status) {
    const prompt = new enquirer.Select({
      name: "memo",
      message: `Choose a memo you want to ${status}:`,
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
