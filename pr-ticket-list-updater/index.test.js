const pr = require('./src/pr');

test("hasMarkedArea with explicit markers", () => {
  const m = pr("foo", "bar");
  expect(m.hasMarkedArea("aaafoobbbbarccc")).toBe(true);
  expect(m.hasMarkedArea("aaafoobbbbaccc")).toBe(false);
});

describe("replacing text", () => {
  test("'no newline marker' replaced with nothing", () => {
    const matcher = pr("START", "END");
    const oldText = "fooSTARTcoolioENDbar";
    expect(matcher.replaceMarkedAreaWith(oldText, "")).toStrictEqual("fooSTARTENDbar");
  });

  test("'markers with newline' replaced with nothing", () => {
    const matcher = pr("\nSTART\n", "\nEND\n");
    const oldText = "foo\nSTART\ncoolio\nEND\nbar";
    expect(matcher.replaceMarkedAreaWith(oldText, "")).toStrictEqual("foo\nSTART\n\nEND\nbar");
  });

  test("'no newline marker' replaced with new text", ()=> {
    const matcher = pr("START", "END");
    const oldText = "fooSTARTcoolioENDbar";
    expect(matcher.replaceMarkedAreaWith(oldText, "mario")).toStrictEqual("fooSTARTmarioENDbar");
  });

  test("'markers with newline' replaced with new text", () => {
    const matcher = pr("\nSTART\n", "\nEND\n");
    const oldText = "foo\nSTART\ncoolio\nEND\nbar";
    expect(matcher.replaceMarkedAreaWith(oldText, "cookie")).toStrictEqual("foo\nSTART\ncookie\nEND\nbar");
  });

  test("'markers without newline' and multiple hits only replaces last hit", () => {
    const matcher = pr("START", "END");
    const oldText = "prefixSTARTuntouchedENDmiddleSTARTtargetENDsuffix";
    expect(matcher.replaceMarkedAreaWith(oldText, "newtext")).toStrictEqual("prefixSTARTuntouchedENDmiddleSTARTnewtextENDsuffix");
  });

  test("'markers without newline' ignores extra end markers", () => {
    const matcher = pr("START", "END");
    const oldText = "prefixSTARTuntouchedENDmiddleSTARTtargetENDsuffixENDsuffix2";
    expect(matcher.replaceMarkedAreaWith(oldText, "newtext")).toStrictEqual("prefixSTARTuntouchedENDmiddleSTARTnewtextENDsuffixENDsuffix2");
  });

  test("'markers without newline' ignores extra start markers", () => {
    const matcher = pr("START", "END");
    const oldText = "prefixSTARTuntouchedSTARTtargetENDsuffix";
    expect(matcher.replaceMarkedAreaWith(oldText, "newtext")).toStrictEqual("prefixSTARTuntouchedSTARTnewtextENDsuffix");
  });

  test("'markers without newline' ignores extra start and end markers", () => {
    const matcher = pr("START", "END");
    const oldText = "prefixSTARTuntouchedSTARTtargetENDsuffixENDsuffix2";
    expect(matcher.replaceMarkedAreaWith(oldText, "newtext")).toStrictEqual("prefixSTARTuntouchedSTARTnewtextENDsuffixENDsuffix2");
  });


  test("'markers without newline' handles no matches", () => {
    const matcher = pr("START", "END");
    const oldText = "prefixSTARTuntouched";
    expect(matcher.replaceMarkedAreaWith(oldText, "newtext")).toStrictEqual("prefixSTARTuntouched");
  });
});



describe("constructing the module", () => {
  test("construct with default markers works", () => {
    expect(() => {pr()}).not.toThrow();
  });

  test("construct with missing markers throws", () => {
    expect(() => {pr("onlyone")}).toThrow();
    expect(() => {pr("foo", undefined)}).toThrow();
    expect(() => {pr(undefined, "foo")}).toThrow();
  });

  test("construct with explicit markers works",  () => {
    const sm = "this is the start marker";
    const em = "this is the end my friend";
    const m = pr(sm, em);
    expect(m.getStartMarker()).toStrictEqual(sm);
    expect(m.getEndMarker()).toStrictEqual(em);
  });
});
