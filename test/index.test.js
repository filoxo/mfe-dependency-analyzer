const { expect, test } = require("@oclif/test");
const cmd = require("../lib");

describe("mfedeps", () => {
  test
    .stdout()
    .do(() => cmd.run(["-n", "@test/microfrontend", "-f", "test/src/**/*.js"]))
    .it("runs with files", (ctx) => {
      expect(ctx.stdout).to.contain("@test/microfrontend");
      // expect(ctx.stdout).to.contain("poop");
    });
});
