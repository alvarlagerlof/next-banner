import { useEffect, useState } from "react";

export default function Test() {
  //   useEffect(() => {
  //     new Proxy(window.test, {
  //       set: function (target, key, value) {
  //         console.log(`${key} set to ${value}`);
  //         target[key] = value;

  //         setTest(value);

  //         return true;
  //       },
  //     });
  //   }, []);

  if (typeof window === "undefined") return null;

  return <div>Test is: {window.test}</div>;
}
