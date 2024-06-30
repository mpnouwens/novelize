import * as React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

function ChevronDownSvg(props: SvgProps) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke={props.color ? props.color : "currentColor"}
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </Svg>
  );
}

export default ChevronDownSvg;
