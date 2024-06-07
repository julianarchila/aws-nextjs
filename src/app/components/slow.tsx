import { headers } from "next/headers";
import React from "react";

type Props = {};

const SlowComponent = async (props: Props) => {
  headers();
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return <div>SlowComponent</div>;
};

export default SlowComponent;
