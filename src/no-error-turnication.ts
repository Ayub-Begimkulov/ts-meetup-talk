export type Test =
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; }
  | { a: number; b: string; };

declare const x: {
  propertyWithAnExceedinglyLongName1: string;
  propertyWithAnExceedinglyLongName2: string;
  propertyWithAnExceedinglyLongName3: string;
  propertyWithAnExceedinglyLongName4: string;
  propertyWithAnExceedinglyLongName5: string;
  propertyWithAnExceedinglyLongName6: string;
  propertyWithAnExceedinglyLongName7: string;
  propertyWithAnExceedinglyLongName8: string;
  propertyWithAnExceedinglyLongName9: string;
  propertyWithAnExceedinglyLongName10: string;
  propertyWithAnExceedinglyLongName11: string;
  propertyWithAnExceedinglyLongName12: string;
};

// String representation of type of 'x' should be truncated in error message
var s: string = x;
