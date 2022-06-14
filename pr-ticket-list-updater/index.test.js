const pr = require('./pr');


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
});

test("construct with explicit markers works",  () => {
  const sm = "this is the start marker";
  const em = "this is the end my friend";
  const m = pr(sm, em);
  expect(m.getStartMarker()).toStrictEqual(sm);
  expect(m.getEndMarker()).toStrictEqual(em);
});
