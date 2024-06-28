import { MaturityRating } from "@/constants";

export function getReadableMaturityRating(maturityRating: MaturityRating) {
  switch (maturityRating) {
    case "NOT_MATURE":
      return "Suitable for all ages";
    case "MATURE":
      return "Mature content";
    default:
      return "Rating not available";
  }
}
