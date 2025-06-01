import {
  CanvasStyleSignal,
  canvasStyleSignal,
  Code,
  Gradient,
  initial,
  Layout,
  LayoutProps,
  makeScene2D,
  nodeName,
  Rect,
  RectProps,
  signal,
  Txt,
  View2D,
  type PossibleCanvasStyle,
} from "@revideo/2d";
import {
  waitFor as _waitFor,
  all,
  chain,
  Color,
  createRef,
  createSignal,
  DEFAULT,
  easeInOutCubic,
  easeInOutQuad,
  makeRef,
  PossibleColor,
  sequence,
  SignalValue,
  SimpleSignal,
  ThreadGenerator,
  tween,
  Vector2,
  waitFor,
} from "@revideo/core";

export interface BackgroundProps extends RectProps {
  view: View2D;
}

@nodeName("Background")
export class Background extends Rect {
  public constructor(props: BackgroundProps) {
    super(props);

    this.width(props.view.width());
    this.height(props.view.height());
  }
}

export function createGradient(
  w: number,
  h: number,
  c1: PossibleColor = "#ccddff",
  c2: PossibleColor = "#000011"
) {
  return new Gradient({
    from: new Vector2(-w * 0.4, -h * 0.4),
    to: new Vector2(w * 0.3, h * 0.4),
    stops: [
      { offset: 0, color: c1 },
      { offset: 1, color: c2 },
    ],
  });
}

export function tToRadians(v: number): number {
  return v * Math.PI * 2;
}

export const positionItemInRow = (
  i: number,
  count: number,
  size: number,
  padding: number
) => {
  const spacing = size + padding;
  const start = -(count - 1) * 0.5 * spacing;
  return start + i * spacing;
};

export const getViewportData = (view: View2D) => {
  const [viewW, viewH] = [view.width(), view.height()];
  const landscape = viewW >= viewH;
  const axisX = "x" as const;
  const axisY = "y" as const;
  const axes = landscape ? [axisX, axisY] : [axisY, axisX];
  const [primaryAxis, crossAxis] = axes;
  const byOrientation = <T,>(primary: T, cross: T): T => {
    return landscape ? primary : cross;
  };

  return {
    landscape,
    portrait: !landscape,
    viewW,
    viewH,
    axes,
    primaryAxis,
    crossAxis,
    byOrientation,
  } as const;
};

export function* repeat(
  iterations: number,
  thing: (iterationIndex: number) => ThreadGenerator
) {
  for (let i = 0; i < iterations; ++i) {
    yield* thing(i);
  }
}

export function* allMap<T>(
  arr: T[],
  callback: (item: T, index: number) => ThreadGenerator
) {
  yield* all(...arr.map(callback));
}

export function* chainWithWait(
  waitSeconds: number,
  ...items: ThreadGenerator[]
) {
  yield* waitFor(waitSeconds);
  yield* chain(
    ...items.map((item) => {
      return chain(item, waitFor(waitSeconds));
    })
  );
}

export function getSketchId(importMetaUrl: string) {
  return +/sketch-(\d+)/.exec(importMetaUrl)[1];
}

export const initSpeed = (view: View2D, bg: Background, base = 1) => {
  const speed = createSignal(base);
  const speedStr = createSignal(() => `Speed: ${(speed() / base).toFixed(1)}x`);
  const ref = createRef<Credits>();

  view.add(
    <Credits.AoC
      ref={ref}
      author={speedStr}
      textAlign="left"
      bottomLeft={bg.bottomLeft}
      view={view}
    />
  );

  function* _waitFor(value: number) {
    yield* waitFor(value / speed());
  }

  const adjust = (value: number) => value / speed();

  return {
    speed,
    adjust,
    waitFor: _waitFor,
    ref,
  };
};

export const AoCTheme = {
  fontFamily: '"Source Code Pro", monospace',
  background: "#0f0f23",
  white: "#fff",
  gray: "#cccccc",
  darkGray: "#999",
  green: "#009900",
  blue: "#0066ff",
  purple: "#990099",
  yellow: "#ffff66",
  orange: "#ff9900",
  red: "#ff0000",
  codeBackground: "#10101a",
  codeBorder: "#333340",

  gold: "#ffff66",
  silver: "#9999cc",
};

export interface CreditsProps extends LayoutProps {
  view?: View2D;
  title?: string | SimpleSignal<string>;
  author: string | SimpleSignal<string>;
  fontFamily?: string;
  fontSize1?: number;
  fontSize2?: number;
  color1?: PossibleCanvasStyle;
  color2?: PossibleCanvasStyle;
}

@nodeName("Credits")
export class Credits extends Layout {
  public constructor(props: CreditsProps) {
    super(props);

    this.zIndex(1000);
    this.layout(true);
    this.direction("column");
    this.padding([12, 20]);

    this.add(
      <>
        <Txt
          text={props.title}
          fill={props.color1 ?? "#aaa"}
          fontFamily={props.fontFamily}
          fontSize={props.fontSize1}
        />
        <Txt
          text={props.author}
          fill={props.color2 ?? "#efefef"}
          fontFamily={props.fontFamily}
          fontSize={props.fontSize2}
        />
      </>
    );
  }

  public static AoC(props: CreditsProps) {
    const credits = new Credits({
      ...props,
      fontFamily: AoCTheme.fontFamily,
      fontSize1: 32,
      color1: AoCTheme.white,
      color2: AoCTheme.gray,
    });

    const { byOrientation } = getViewportData(props.view);
    credits.padding([byOrientation(12, 100), 20]);

    props.ref?.(credits);

    return credits;
  }
}

interface Options {
  sketchId: number;
  year: number;
  day: number;
  part: number;
  wip?: boolean;
  hideTitle?: boolean;
}

export function addBgCredits(
  view: View2D,
  { sketchId, year, day, part, wip, hideTitle }: Options
) {
  const { byOrientation, viewW, viewH } = getViewportData(view);

  const bg = createRef<Background>();

  const fontSize = 48;
  const x = 10;

  view.add(
    <>
      <Background ref={bg} view={view} fill={AoCTheme.background} />
      {!hideTitle ? (
        <Layout
          x={x}
          textAlign="center"
          width={viewW}
          height={viewH}
          layout
          direction="column"
          padding={byOrientation(30, 100)}
        >
          <Txt
            text={`Advent of Code ${year}`}
            fill={AoCTheme.gray}
            fontSize={fontSize}
          />
          <Txt
            text={`Day ${day} Solution (Part ${part})`}
            fill={AoCTheme.yellow}
            fontSize={fontSize}
          />
        </Layout>
      ) : null}
      <Credits.AoC
        title={`Sketch ${sketchId.toString().padStart(3, "0")}`}
        author="Bret Hudson"
        textAlign="right"
        bottomRight={bg().bottomRight}
        view={view}
      />
    </>
  );

  if (wip) {
    view.add(
      <Txt
        text="*WIP*"
        fill={AoCTheme.orange}
        zIndex={100000}
        fontSize={100}
        rotation={byOrientation(-10, -7)}
        topLeft={bg().topLeft}
        padding={byOrientation([70, 30], [260, 0])}
      />
    );
  }

  return bg;
}

export interface CellProps extends RectProps {
  size: SignalValue<number>;
  value: SignalValue<string>;
  speed?: SignalValue<number | null>;
  initialValue?: number;
}

const defaultLineWidth = 5;

const dur = 0.5;

@nodeName("Cell")
export class Cell extends Rect {
  txt = createRef<Txt>();

  @initial(AoCTheme.codeBackground)
  @canvasStyleSignal()
  public declare readonly fill: CanvasStyleSignal<this>;

  @initial(AoCTheme.codeBorder)
  @canvasStyleSignal()
  public declare readonly stroke: CanvasStyleSignal<this>;

  @initial(5)
  @signal()
  public declare readonly lineWidth: SimpleSignal<number, this>;

  @initial(1)
  @signal()
  public declare readonly speed: SimpleSignal<number, this>;

  public value: SimpleSignal<number>;

  @initial(AoCTheme.gray)
  @canvasStyleSignal()
  public declare readonly textFill: CanvasStyleSignal<this>;

  @initial("")
  @signal()
  public declare readonly text: SimpleSignal<string, this>;

  public initialValue: number;

  public constructor(props: CellProps) {
    super(props);

    this.initialValue = props.initialValue;

    this.value = createSignal<number>(() => {
      const txt = this.txt().text();
      if (txt === "∞") return this.initialValue;
      if (txt === "-∞") return this.initialValue;
      if (txt) return +txt;
      return this.initialValue;
    });

    this.width(props.size);
    this.height(props.size);

    this.radius(2);

    this.text(props.value);

    // handy for this.clone();
    this.removeChildren();

    this.add(
      <Txt
        alignContent="center"
        textAlign="center"
        width={props.size}
        height={props.size}
        ref={this.txt}
        text={this.text}
        fill={this.textFill}
        fontFamily={AoCTheme.fontFamily}
      />
    );
  }

  get dur() {
    return dur / this.speed();
  }

  public *validate(valid: boolean) {
    const color = `${valid ? AoCTheme.green : AoCTheme.red}`;
    yield* all(this.stroke(color, this.dur), this.fill(color + "33", this.dur));
  }

  public *select(dur = this.dur) {
    yield* all(
      this.lineWidth(3, dur),
      this.fill(DEFAULT, dur),
      this.stroke(AoCTheme.white, dur),
      this.textFill(AoCTheme.white, dur),
      this.opacity(1, dur)
    );
  }

  public *selectText(dur = this.dur) {
    const curFill = new Color(this.fill() as unknown as string);
    yield* all(
      this.fill(DEFAULT, dur),
      // this.textFill(AoCTheme.white, dur),
      this.opacity(1, dur),
      tween(dur, (value) => {
        const scale = value * Math.PI;
        const sin = Math.sin(scale) * 0.3;
        // this.scale(1 + 0.2 * sin);
        this.fill(Color.lerp(curFill, AoCTheme.white, sin));
      })
    );
  }

  public *softSelect(dur = this.dur) {
    yield* all(
      this.lineWidth(3, dur),
      this.fill(DEFAULT, dur),
      this.stroke(AoCTheme.white, dur),
      this.textFill(AoCTheme.white, dur),
      this.opacity(1, dur)
    );
  }

  public *deselect(dur = this.dur) {
    yield* all(
      this.fill(DEFAULT, dur),
      this.stroke(DEFAULT, dur),
      this.opacity(0.5, dur),
      this.textFill(DEFAULT, dur)
    );
    this.save();
  }

  public *reset(dur = this.dur) {
    yield* all(
      this.lineWidth(DEFAULT, dur),
      this.fill(DEFAULT, dur),
      this.stroke(DEFAULT, dur),
      this.opacity(1, dur),
      this.textFill(DEFAULT, dur)
    );
  }

  public updateValue(value: number) {
    let txt = value.toString();
    if (value === Infinity) txt = "∞";
    if (value === -Infinity) txt = "-∞";
    this.text(txt);
  }

  public *updateValueWithTransition(value: number, dur = 0.3) {
    yield* this.txt().opacity(0, dur);
    yield* this.updateValueYield(value);
    yield* this.txt().opacity(1, dur);
  }

  public *updateValueYield(value: number) {
    let txt = value.toString();
    if (value === Infinity) txt = "∞";
    if (value === -Infinity) txt = "-∞";
    yield* this.text(txt, 0);
  }
}

interface FramesLayoutProps extends LayoutProps {
  frameSize: SignalValue<number>;
}

@nodeName("FramesLayout")
export class FramesLayout extends Layout {
  @signal()
  public declare readonly frameSize: SimpleSignal<number, this>;

  @initial(0)
  @signal()
  public declare readonly spacing: SimpleSignal<number, this>;

  public get frames() {
    return this.childrenAs<Frame>();
  }

  public constructor(props: FramesLayoutProps) {
    super(props);
  }

  public getPosition(index: number) {
    return positionItemInRow(
      index,
      this.frames.length,
      this.frameSize(),
      this.spacing()
    );
  }

  public animateFrames(callback: (frame: Frame) => ThreadGenerator) {
    return this.frames.map(callback);
  }

  public showOutlines() {
    return sequence(0.1, ...this.animateFrames((frame) => frame.showOutline()));
  }

  public splitFrames() {
    return this.spacing(32, 0.4, easeInOutQuad);
  }

  public *transitionToTop() {
    yield* all(
      this.scale(0.5, 0.6, easeInOutCubic),
      this.position.y(-300, 0.6, easeInOutCubic)
    );
  }

  public *highlightFrame(index?: number, duration?: number) {
    yield* allMap(this.frames, (frame) => frame.highlight(index, duration));
  }
}

const waitDur = 0.3;

const parseExamples = (...examples: string[]) => {
  return examples.map((v) => v.split("").map(Number));
};

const part1Examples = parseExamples("1122", "1111", "1234", "91212129");
const part2Examples = parseExamples(
  "1212",
  "1221",
  "123425",
  "123123",
  "12131415"
);

export interface ValueDisplayProps extends LayoutProps {
  label: string;
  value: SignalValue<number>;
  speed?: SignalValue<number | null>;
}

const valueToString = (value: number) => (value > -1 ? value.toString() : "-");

@nodeName("ValueDisplay")
export class ValueDisplay extends Layout {
  @signal()
  public declare readonly value: SimpleSignal<number, this>;

  @initial(1)
  @signal()
  public declare readonly speed: SimpleSignal<number, this>;

  private codeRef = createRef<Code>();
  private n = 0;

  public constructor(props: ValueDisplayProps) {
    super(props);

    this.gap(22);

    this.add(
      <>
        <Txt text={`${props.label}:`} fill={AoCTheme.gray} />
        <Code ref={this.codeRef} code={valueToString(this.value())} />
      </>
    );
  }

  public *set(value: number) {
    this.value(value);

    yield* this.codeRef().code(
      "​".repeat(++this.n) + valueToString(this.value()),
      0.5 / this.speed()
    );
  }

  public *increment(inc: number) {
    yield* this.set(this.value() + inc);
  }
}

export default makeScene2D("name", function* (view) {
  const { landscape } = getViewportData(view);

  addBgCredits(view, { sketchId: 2017, year: 1, day: 1, part: 1 }); // Adjusted call

  const yGap = 120;

  const curExample = createSignal(0);
  const y = createSignal(() => curExample() * -yGap);

  const examples = part1Examples.map((e) => {
    if (landscape) return e;
    const shortened = e
      .join("")
      .replace("91212129", "912129")
      .split("")
      .map(Number);
    return shortened;
  });

  const xPos = examples.map(() => createSignal(0));

  const cells = examples.map(() => [] as Cell[]);

  const speed = createSignal(1);

  function* waitFor(value: number) {
    yield* _waitFor(value / speed());
  }

  view.add(
    <Layout y={y}>
      {examples.map((input, index) => (
        <Layout
          x={xPos[index]}
          y={index * yGap}
          opacity={createSignal(() => 1 - Math.abs(index - curExample()))}
        >
          {input.map((digit, i) => (
            <Cell
              ref={makeRef(cells[index], i)}
              speed={speed}
              x={positionItemInRow(i, input.length, 100, 50)}
              value={digit.toString()}
              size={100}
            />
          ))}
        </Layout>
      ))}
    </Layout>
  );

  const sumDisplay = createRef<ValueDisplay>();
  const curDisplay = createRef<ValueDisplay>();
  const nextDisplay = createRef<ValueDisplay>();

  view.add(
    <Layout
      layout
      direction="column"
      alignContent={"center"}
      justifyContent={"center"}
      alignItems={"center"}
      y={7}
      gap={130}
    >
      <Layout layout gap={70}>
        <ValueDisplay ref={curDisplay} label="Cur" value={-1} speed={speed} />
        <ValueDisplay ref={nextDisplay} label="Next" value={-1} speed={speed} />
      </Layout>
      <ValueDisplay ref={sumDisplay} label="Sum" value={-1} speed={speed} />
    </Layout>
  );

  function* addResult(valid: boolean, value: number) {
    if (!valid) return;

    yield* sumDisplay().increment(value);

    yield* waitFor(waitDur * 2);
  }

  const numExamples = examples.length;
  for (let i = 0; i < numExamples; ++i) {
    const e = curExample();

    yield* sumDisplay().set(0);

    const input = examples[e];
    const n = input.length;
    for (let i = 0; i < n; ++i) {
      const next = (i + 1) % n;
      const valid = input[i] === input[next];
      yield* allMap(cells[e], (cell, index) => {
        if (!(index === i || index === next))
          return chain(waitFor(0.3), cell.deselect());
        return chain(
          // blah
          all(
            //blah
            chain(
              waitFor(0.3),
              all(curDisplay().set(input[i]), nextDisplay().set(input[next]))
            ),
            cell.select()
          ),
          waitFor(0.2),
          cell.validate(valid)
        );
      });
      if (valid) {
        yield* waitFor(waitDur);
        yield* addResult(valid, input[i]);
      } else {
        yield* waitFor(waitDur * 3 + 0.2);
      }
      yield* waitFor(waitDur);
    }

    yield* all(
      allMap(cells[e], (cell) => cell.deselect()),
      chain(waitFor(0.1), all(curDisplay().set(-1), nextDisplay().set(-1)))
    );
    yield* waitFor(waitDur * 3);

    yield* all(
      chain(waitFor(0.1), sumDisplay().set(-1)),
      curExample((i + 1) % numExamples, 0.5, easeInOutQuad)
    );
    yield* waitFor(waitDur);

    speed(3);
  }
});
