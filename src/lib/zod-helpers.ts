import * as z from "zod";

export const emptyToUndefined = (val: unknown) => (val === "" ? undefined : val);

export const optionalString = () =>
  z.preprocess(emptyToUndefined, z.string().trim().optional());

export const optionalEmail = () =>
  z.preprocess(
    emptyToUndefined,
    z.email({ error: "Enter a valid email." }).optional()
  );
