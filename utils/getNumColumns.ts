import { Dimensions } from "react-native";

export function getNumColumns() {
  const { width } = Dimensions.get("window");
  if (width > 1200) return 4;
  if (width > 970) return 3;
  if (width > 600) return 2;
  return 1;
}
