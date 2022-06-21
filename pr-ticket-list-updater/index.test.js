const prUpdater = require('./src/pr-updater');

test("hasMarkedArea with explicit markers", () => {
  const m = prUpdater("foo", "bar");
  expect(m.hasMarkedArea("aaafoobbbbarccc")).toBe(true);
  expect(m.hasMarkedArea("aaafoobbbbaccc")).toBe(false);
});

describe("replacing text", () => {
  test("'no newline marker' replaced with nothing", () => {
    const matcher = prUpdater("START", "END");
    const oldText = "fooSTARTcoolioENDbar";
    expect(matcher.replaceOrAddMarkedArea(oldText, "")).toStrictEqual("fooSTARTENDbar");
  });

  test("'markers with newline' replaced with nothing", () => {
    const matcher = prUpdater("\nSTART\n", "\nEND\n");
    const oldText = "foo\nSTART\ncoolio\nEND\nbar";
    expect(matcher.replaceOrAddMarkedArea(oldText, "")).toStrictEqual("foo\nSTART\n\nEND\nbar");
  });

  test("'no newline marker' replaced with new text", ()=> {
    const matcher = prUpdater("START", "END");
    const oldText = "fooSTARTcoolioENDbar";
    expect(matcher.replaceOrAddMarkedArea(oldText, "mario")).toStrictEqual("fooSTARTmarioENDbar");
  });

  test("'markers with newline' replaced with new text", () => {
    const matcher = prUpdater("\nSTART\n", "\nEND\n");
    const oldText = "foo\nSTART\ncoolio\nEND\nbar";
    expect(matcher.replaceOrAddMarkedArea(oldText, "cookie")).toStrictEqual("foo\nSTART\ncookie\nEND\nbar");
  });

  test("'markers without newline' and multiple hits only replaces last hit", () => {
    const matcher = prUpdater("START", "END");
    const oldText = "prefixSTARTuntouchedENDmiddleSTARTtargetENDsuffix";
    expect(matcher.replaceOrAddMarkedArea(oldText, "newtext")).toStrictEqual("prefixSTARTuntouchedENDmiddleSTARTnewtextENDsuffix");
  });

  test("'markers without newline' ignores extra end markers", () => {
    const matcher = prUpdater("START", "END");
    const oldText = "prefixSTARTuntouchedENDmiddleSTARTtargetENDsuffixENDsuffix2";
    expect(matcher.replaceOrAddMarkedArea(oldText, "newtext")).toStrictEqual("prefixSTARTuntouchedENDmiddleSTARTnewtextENDsuffixENDsuffix2");
  });

  test("'markers without newline' ignores extra start markers", () => {
    const matcher = prUpdater("START", "END");
    const oldText = "prefixSTARTuntouchedSTARTtargetENDsuffix";
    expect(matcher.replaceOrAddMarkedArea(oldText, "newtext")).toStrictEqual("prefixSTARTuntouchedSTARTnewtextENDsuffix");
  });

  test("'markers without newline' ignores extra start and end markers", () => {
    const matcher = prUpdater("START", "END");
    const oldText = "prefixSTARTuntouchedSTARTtargetENDsuffixENDsuffix2";
    expect(matcher.replaceOrAddMarkedArea(oldText, "newtext")).toStrictEqual("prefixSTARTuntouchedSTARTnewtextENDsuffixENDsuffix2");
  });


  test("'markers without newline' handles no matches", () => {
    const matcher = prUpdater("START", "END");
    const oldText = "prefixSTARTuntouched";
    expect(matcher.replaceOrAddMarkedArea(oldText, "newtext")).toStrictEqual("prefixSTARTuntouchedSTARTnewtextEND");
  });
});



describe("constructing the module", () => {
  test("construct with default markers works", () => {
    expect(() => {prUpdater()}).not.toThrow();
  });

  test("construct with missing markers throws", () => {
    expect(() => {prUpdater("onlyone")}).toThrow();
    expect(() => {prUpdater("foo", undefined)}).toThrow();
    expect(() => {prUpdater(undefined, "foo")}).toThrow();
  });

  test("construct with explicit markers works",  () => {
    const sm = "this is the start marker";
    const em = "this is the end my friend";
    const m = prUpdater(sm, em);
    expect(m.getStartMarker()).toStrictEqual(sm);
    expect(m.getEndMarker()).toStrictEqual(em);
  });
});
