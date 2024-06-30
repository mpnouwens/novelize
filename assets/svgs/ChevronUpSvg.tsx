import * as React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

function ChevronUpSvg(props: SvgProps) {
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
        d="M4.5 15.75l7.5-7.5 7.5 7.5"
      />
    </Svg>
  );
}

export default ChevronUpSvg;
