import { headers } from "next/headers";
import React from "react";

type Props = {
  seconds?: number;
};

const SlowComponent = async (props: Props) => {
  headers();
  const { seconds = 3 } = props;

  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  return <div>SlowComponent</div>;
};

export default SlowComponent;
