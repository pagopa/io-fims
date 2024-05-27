import * as E from "fp-ts/Either";
import * as b from "fp-ts/boolean";
import * as f from "fp-ts/function";
import * as D from "io-ts/Decoder";

const booleanDecoder: D.Decoder<unknown, boolean> = {
  decode: (str) =>
    f.pipe(
      str,
      D.literal("true", "false").decode,
      E.map((x) => b.fold(f.constant(false), f.constant(true))(x === "true")),
    ),
};

export { booleanDecoder };
