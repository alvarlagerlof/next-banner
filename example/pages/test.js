import { useState } from "react";

export default function Test() {
  const [test, setTest] = useState("Nothing yet");

  const onClick = () => {
    setTest(window.test);
  };

  return (
    <div>
      Test: {test}
      <button onClick={onClick}>Calulate</button>
    </div>
  );
}
