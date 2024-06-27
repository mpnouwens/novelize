import * as React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

function ArrowSvg(props: SvgProps) {
  return (
    <Svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <Path
        fillRule="evenodd"
        d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export { ArrowSvg };
